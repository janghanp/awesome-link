import {
  createStyles,
  ActionIcon,
  LoadingOverlay,
  Image,
  Group,
  Card,
  Text,
  AspectRatio,
} from '@mantine/core';
import React, { useState } from 'react';
import { IconBookmark } from '@tabler/icons';
import { gql, useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { useRouter } from 'next/router';

import { GET_LINKS } from '../pages/index';
import { GET_BOOKMARK_LINKS } from '../pages/bookmarks';
import { useCurrentUserState } from '../store';
import { UserWithBookmarks, Link } from '../types';
import ControlMenu from './ControlMenu';
import EditModal from './EditModal';

const useStyles = createStyles((theme) => ({
  card: {
    transition: 'transform 150ms ease, box-shadow 150ms ease',

    '&:hover': {
      transform: 'scale(1.01)',
      boxShadow: theme.shadows.md,
    },
  },
  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 600,
  },
  bookmark: {
    color: theme.colors.yellow[6],
  },
}));

const BOOKMARK = gql`
  mutation Bookmark($userId: String!, $linkId: String!, $isBookmarking: Boolean!) {
    bookmark(linkId: $linkId, userId: $userId, isBookmarking: $isBookmarking) {
      id
      name
      email
      image
      role
      bookmarks {
        id
        title
        description
        url
        imageUrl
        public_id
        createdAt
      }
    }
  }
`;

const DELETE_LINK = gql`
  mutation DeleteLink($id: String!, $public_id: String!) {
    deleteLink(id: $id, public_id: $public_id) {
      id
    }
  }
`;

type Props = {
  link: Link;
};

interface UserData {
  bookmark: UserWithBookmarks;
}

const LinkCard = ({ link }: Props) => {
  const router = useRouter();

  const { classes } = useStyles();

  const [deleteLink] = useMutation(DELETE_LINK);

  const [bookmark] = useMutation<UserData>(BOOKMARK);

  const { currentUser, setCurrentUser } = useCurrentUserState();

  const [visible, setVisible] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const bookmarkdIds = currentUser && currentUser.bookmarks.map((bookmark) => bookmark.id);
  const isBookmakred = currentUser && bookmarkdIds.includes(link.id);

  const bookmarkHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!currentUser) {
      router.push('/login');
      return;
    }

    const { data } = await bookmark({
      variables: { userId: currentUser.id, linkId: link.id, isBookmarking: !isBookmakred },
      update: (cache, { data }) => {
        const existingGetBookmarkLinks: any = cache.readQuery({
          query: GET_BOOKMARK_LINKS,
          variables: {
            userId: currentUser.id,
            after: null,
          },
        });

        //update getBookmarkLinks cache if it exists in cache.
        if (existingGetBookmarkLinks) {
          let newEdges = null;

          if (isBookmakred) {
            //un-bookmark
            newEdges = existingGetBookmarkLinks.getBookmarkLinks.edges.filter(
              (edge) => edge.cursor !== link.id
            );
          } else {
            //bookmark
            newEdges = data.bookmark.bookmarks.map((node) => {
              return {
                node,
                cursor: node.id,
                __typename: 'Edge',
              };
            });
          }

          cache.writeQuery({
            query: GET_BOOKMARK_LINKS,
            variables: { userId: currentUser.id, after: null },
            data: {
              getBookmarkLinks: {
                edges: newEdges,
                pageInfo: existingGetBookmarkLinks.getBookmarkLinks.pageInfo,
                __typename: 'Response',
              },
            },
          });
        }
      },
    });

    setCurrentUser(data.bookmark);
  };

  const deleteLinkHandler = async (cb: React.Dispatch<React.SetStateAction<boolean>>) => {
    setVisible(true);

    await deleteLink({
      variables: { id: link.id, public_id: link.public_id },
      update: (cache, { data }) => {
        const deletedCursorId: string = data.deleteLink.id;

        const existingGetLinks: any = cache.readQuery({
          query: GET_LINKS,
          variables: { after: null },
        });

        const newEdges = existingGetLinks.getLinks.edges.filter(
          (edge) => edge.cursor !== deletedCursorId
        );

        cache.writeQuery({
          query: GET_LINKS,
          variables: { after: null },
          data: {
            getLinks: {
              edges: newEdges,
              pageInfo: existingGetLinks.getLinks.pageInfo,
              __typename: 'Response',
            },
          },
        });
      },
    });

    setVisible(false);
    toast.success('Successfully deleted!');

    cb(false);
  };

  const editLinkHanlder = async () => {
    setIsEditModalOpen(true);
  };

  return (
    <>
      <LoadingOverlay
        visible={visible}
        overlayBlur={2}
        color="dark"
        style={{
          zIndex: '100',
          position: 'fixed',
        }}
      />

      <Card
        key={link.title}
        p="md"
        radius="md"
        component="a"
        href={link.url}
        className={classes.card}
        withBorder
        style={{ width: '100%', height: '100%' }}
      >
        {currentUser && currentUser.role === 'ADMIN' && (
          <Group position="right" mb="xs" onClick={(e) => e.preventDefault()}>
            <ControlMenu editLinkHandler={editLinkHanlder} deleteLinkHandler={deleteLinkHandler} />
          </Group>
        )}

        <AspectRatio ratio={1920 / 1080}>
          <Image src={link.imageUrl} alt="No way!" />
        </AspectRatio>
        <Group
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          mt="md"
        >
          <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
            {format(new Date(link.createdAt), 'eeee dd,yyyy')}
          </Text>
          <ActionIcon onClick={bookmarkHandler}>
            <IconBookmark className={isBookmakred ? classes.bookmark : ''} />
          </ActionIcon>
        </Group>
        <Text className={classes.title} mt={5}>
          {link.title}
        </Text>
      </Card>

      {isEditModalOpen && (
        <EditModal
          link={link}
          isEditModalOpen={isEditModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
        />
      )}
    </>
  );
};

export default LinkCard;
