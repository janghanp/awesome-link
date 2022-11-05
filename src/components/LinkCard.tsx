import {
  createStyles,
  Card,
  Image,
  Text,
  AspectRatio,
  ActionIcon,
  Group,
  LoadingOverlay,
} from "@mantine/core";
import React, { useState } from "react";
import { IconBookmark } from "@tabler/icons";
import { gql, useMutation } from "@apollo/client";
import toast, { Toaster } from "react-hot-toast";

import { useCurrentUserState } from "../store";
import ControlMenu from "./ControlMenu";
import { GET_LINKS } from "./LinkCardList";

const useStyles = createStyles((theme) => ({
  card: {
    transition: "transform 150ms ease, box-shadow 150ms ease",

    "&:hover": {
      transform: "scale(1.01)",
      boxShadow: theme.shadows.md,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 600,
  },
}));

const DELETE_LINK = gql`
  mutation DeleteLink($id: String!, $public_id: String!) {
    deleteLink(id: $id, public_id: $public_id) {
      id
    }
  }
`;

type Props = {
  id: number;
  title: string;
  description: string;
  link: string;
  imageUrl: string;
  public_id: string;
};

const LinkCard = ({
  title,
  description,
  link,
  imageUrl,
  public_id,
  id,
}: Props) => {
  const { classes, theme } = useStyles();

  const [deleteLink] = useMutation(DELETE_LINK, {
    refetchQueries: [{ query: GET_LINKS }],
  });

  const currentUser = useCurrentUserState((state) => state.currentUser);

  const [visible, setVisible] = useState<boolean>(false);

  const bookmarkHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("bookmark");
  };

  const deleteLinkHandler = async (
    cb: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setVisible(true);

    await deleteLink({ variables: { id, public_id } });

    setVisible(false);
    toast.success("Successfully deleted!");
    cb(false);
  };

  return (
    <>
      <LoadingOverlay visible={visible} overlayBlur={2} />

      <Card
        p="md"
        radius="md"
        component="a"
        href={link}
        className={classes.card}
        withBorder
        style={{ minWidth: "300px" }}
      >
        {currentUser && currentUser.role === "ADMIN" && (
          <Group position="right" mb={5} onClick={(e) => e.preventDefault()}>
            <ControlMenu deleteLinkHandler={deleteLinkHandler} />
          </Group>
        )}

        <AspectRatio ratio={1920 / 1080}>
          <Image src={imageUrl} />
        </AspectRatio>
        <Text mt={20} className={classes.title}>
          {title}
        </Text>
        <Group position="right">
          <ActionIcon onClick={bookmarkHandler}>
            <IconBookmark
              size={18}
              color={theme.colors.yellow[6]}
              stroke={1.5}
            />
          </ActionIcon>
        </Group>
      </Card>

      <Toaster />
    </>
  );
};

export default LinkCard;
