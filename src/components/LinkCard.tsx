import { createStyles, ActionIcon, LoadingOverlay, Image, Group, Card, Text } from '@mantine/core';
import React, { useState } from 'react';
import { IconBookmark } from '@tabler/icons';
import { gql, useMutation } from '@apollo/client';
import toast from 'react-hot-toast';

import { GET_LINKS } from './LinkCardList';
import { useCurrentUserState } from '../store';
import ControlMenu from './ControlMenu';
import EditModal from './EditModal';
import { Link } from '@prisma/client';

const useStyles = createStyles((theme) => {
  return {
    card: {
      transition: 'transform 150ms ease, box-shadow 150ms ease',
      '&:hover': {
        transform: 'scale(1.01)',
        boxShadow: theme.shadows.md,
      },
    },
    action: {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      ...theme.fn.hover({
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
      }),
    },
  };
});

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

const LinkCard = ({ link }: Props) => {
  const { classes, theme } = useStyles();

  const [deleteLink] = useMutation(DELETE_LINK, {
    refetchQueries: [{ query: GET_LINKS }],
  });

  const currentUser = useCurrentUserState((state) => state.currentUser);

  const [visible, setVisible] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const bookmarkHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('bookmark');
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
        shadow="sm"
        p="xl"
        component="a"
        href={link.url}
        target="_blank"
        className={classes.card}
      >
        <Card.Section>
          <Image src={link.imageUrl} height={160} alt="No way!" />
          <div
            onClick={(e) => e.preventDefault()}
            style={{ position: 'absolute', top: '10px', right: '15px' }}
          >
            {currentUser && currentUser.role === 'ADMIN' && (
              <ControlMenu
                deleteLinkHandler={deleteLinkHandler}
                editLinkHandler={editLinkHanlder}
              />
            )}
          </div>
        </Card.Section>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'cneter',
            justifyContent: 'space-between',
            marginTop: '10px',
          }}
        >
          <Text weight={500} size="lg">
            {link.title}
          </Text>
          <ActionIcon onClick={bookmarkHandler} className={classes.action}>
            <IconBookmark size={16} color={theme.colors.yellow[7]} />
          </ActionIcon>
        </div>

        <Text mt="xs" color="dimmed" size="sm">
          {link.description}
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
