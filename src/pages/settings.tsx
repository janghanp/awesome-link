import { Container, LoadingOverlay, Stack } from "@mantine/core";
import { GetServerSideProps } from "next";
import { getToken } from "next-auth/jwt";
import { useState } from "react";

import ProfileForm from "../components/ProfileForm";
import ProfileAvatar from "../components/ProfileAvatar";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const jwt = await getToken({
    req: context.req,
    secret: process.env.JWT_SECRET,
  });

  if (!jwt) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const Settings = () => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <>
      <LoadingOverlay visible={visible} overlayBlur={2} />

      <Container size={500}>
        <Stack>
          <ProfileAvatar />
          <ProfileForm setVisible={setVisible} />
        </Stack>
      </Container>
    </>
  );
};

export default Settings;
