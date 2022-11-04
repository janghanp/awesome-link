import { Container, LoadingOverlay, Stack } from "@mantine/core";
import { GetServerSideProps } from "next";
import { getToken } from "next-auth/jwt";
import { useState } from "react";

import ProfileForm from "../components/ProfileForm";
// import { prisma } from "../lib/prisma";
// import { User } from "@prisma/client";
import ProfileAvatar from "../components/ProfileAvatar";

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const jwt = await getToken({
//     req: context.req,
//     secret: process.env.JWT_SECRET,
//   });

//   if (!jwt) {
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }

//   const user = await prisma.user.findUnique({
//     where: {
//       email: jwt.email,
//     },
//   });

//   return {
//     props: { user },
//   };
// };

// type Props = {
//   user: User;
// };

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
