import {
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Container,
  LoadingOverlay,
} from '@mantine/core';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AiOutlineGithub } from 'react-icons/ai';
import LoginForm from '../components/LoginForm';

const SignUp = (props: PaperProps) => {
  const router = useRouter();

  const [visible, setVisible] = useState<boolean>(false);

  const { data: session } = useSession();

  if (session) {
    router.push('/');
    return;
  }

  return (
    <>
      <LoadingOverlay visible={visible} overlayBlur={2} />

      <Container size={500}>
        <Paper radius="md" p="xl" withBorder {...props}>
          <Text
            size="lg"
            weight="800"
            align="center"
            variant="gradient"
            gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
          >
            Welcome to Awesome-link
          </Text>

          <Group grow mb="md" mt="md">
            <Button
              color="dark"
              onClick={() => {
                setVisible(true);
                signIn('github', { callbackUrl: '/' });
              }}
              leftIcon={<AiOutlineGithub size={16} />}
            >
              Login with GitHub
            </Button>
          </Group>

          <Divider label="Or continue with email" labelPosition="center" my="lg" />

          <LoginForm type="register" setVisible={setVisible} />
        </Paper>
      </Container>
    </>
  );
};

export default SignUp;
