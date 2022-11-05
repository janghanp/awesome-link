import { Container, Paper, Text } from "@mantine/core";
import { GetServerSideProps } from "next";
import { getToken } from "next-auth/jwt";
import { useRouter } from "next/router";

import { useCurrentUserState } from "../store";
import CreateLinkForm from "../components/CreateLinkForm";

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

const Admin = () => {
  const router = useRouter();

  const currnetUser = useCurrentUserState((state) => state.currentUser);

  if (currnetUser.role !== "ADMIN") {
    router.push("/");
    return;
  }

  return (
    <Container size={500}>
      <Paper radius="md" p="xl" withBorder>
        <Text
          size="xl"
          weight="900"
          align="left"
          variant="gradient"
          mb="xl"
        >
        Create a link
        </Text>

        <CreateLinkForm />
      </Paper>
    </Container>
  );
};

export default Admin;
