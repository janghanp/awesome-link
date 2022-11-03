import {
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Container,
  ButtonProps,
} from "@mantine/core";
import { signIn } from "next-auth/react";
import { AiOutlineGithub } from "react-icons/ai";
import LoginForm from "../components/LoginForm";

const login = (props: PaperProps) => {
  const GithubButton = (props: ButtonProps) => {
    return (
      <Button
        onClick={() => signIn("github", { callbackUrl: "/" })}
        {...props}
        leftIcon={<AiOutlineGithub size={16} />}
        sx={(theme) => ({
          backgroundColor:
            theme.colors.dark[theme.colorScheme === "dark" ? 9 : 6],
          color: "#fff",
          "&:hover": {
            backgroundColor:
              theme.colors.dark[theme.colorScheme === "dark" ? 9 : 6],
          },
        })}
      />
    );
  };

  return (
    <Container size={500}>
      <Paper radius="md" p="xl" withBorder {...props}>
        <Text
          size="lg"
          weight="800"
          align="center"
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan", deg: 45 }}
        >
          Welcome to Awesome-link
        </Text>

        <Group grow mb="md" mt="md">
          <GithubButton>Login with GitHub</GithubButton>
        </Group>

        <Divider
          label="Or continue with email"
          labelPosition="center"
          my="lg"
        />

        <LoginForm type="register" />
      </Paper>
    </Container>
  );
};

export default login;
