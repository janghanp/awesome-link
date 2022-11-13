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

import { GET_LINKS } from '../pages/index';
import { useCurrentUserState } from '../store';
import ControlMenu from './ControlMenu';
import EditModal from './EditModal';
import { Link } from '@prisma/client';
import { useRouter } from 'next/router';
import { UserWithBookmarks } from '../types';

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
  refetch?: () => void;
};

interface UserData {
  bookmark: UserWithBookmarks;
}

const LinkCard = ({ link, refetch }: Props) => {
  const router = useRouter();

  const { classes } = useStyles();

  const [deleteLink] = useMutation(DELETE_LINK, {
    refetchQueries: [{ query: GET_LINKS }],
  });

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
    });

    setCurrentUser(data.bookmark);

    if (refetch) {
      refetch();
    }
  };

  const deleteLinkHandler = async (cb: React.Dispatch<React.SetStateAction<boolean>>) => {
    setVisible(true);

    await deleteLink({ variables: { id: link.id, public_id: link.public_id } });

    setVisible(false);
    toast.success('Successfully deleted!');

    cb(false);
  };

  const editLinkHanlder = async () => {
    setIsEditModalOpen(true);
  };

  return (
    <>
      <LoadingOverlay visible={visible} overlayBlur={2} color="dark" />

      <Card
        key={link.title}
        p="md"
        radius="md"
        component="a"
        href={link.url}
        className={classes.card}
        withBorder
      >
        {currentUser && currentUser.role === 'ADMIN' && (
          <Group position="right" mb="xs" onClick={(e) => e.preventDefault()}>
            <ControlMenu editLinkHandler={editLinkHanlder} deleteLinkHandler={deleteLinkHandler} />
          </Group>
        )}

        <AspectRatio ratio={1920 / 1080}>
          <Image src={link.imageUrl} />
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
