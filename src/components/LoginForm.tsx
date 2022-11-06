import { Anchor, Button, Group, PasswordInput, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { upperFirst } from '@mantine/hooks';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';

const CREAT_USER = gql`
  mutation Register($email: String!, $name: String!, $password: String!) {
    register(email: $email, name: $name, password: $password) {
      id
      name
      email
    }
  }
`;

type Props = {
  type: 'login' | 'register';
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoginForm = ({ type, setVisible }: Props) => {
  const [signup] = useMutation(CREAT_USER);

  const router = useRouter();

  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
    },

    validate: {
      email: (val: string) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val: string) =>
        val.length <= 6 ? 'Password should include at least 6 characters' : null,
    },
  });

  useEffect(() => {
    if (router.query.error) {
      form.setFieldError('email', 'Check your email again');
      form.setFieldError('password', 'Check your password again');
    }
  }, [router.query.error]);

  const clickHandler = () => {
    if (type === 'login') {
      router.push('/signup');
    }

    if (type === 'register') {
      router.push('/login');
    }
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    setVisible(true);

    if (type === 'login') {
      e.preventDefault();

      signIn('credentials', {
        email: form.values.email,
        password: form.values.password,
        callbackUrl: '/',
      });

      return;
    }

    if (type === 'register') {
      e.preventDefault();

      const { email, name, password } = form.values;

      const { errors } = form.validate();

      if (Object.keys(errors).length > 0) {
        console.log(errors);
        setVisible(false);
        return;
      }

      signup({ variables: { email, name, password } })
        .then(() => {
          signIn('credentials', {
            email: form.values.email,
            password: form.values.password,
            callbackUrl: '/',
          });
        })
        .catch((error) => {
          form.setFieldError('email', error.message);
          setVisible(false);
        });

      return;
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <Stack>
        {type === 'register' && (
          <TextInput
            required
            label="Name"
            placeholder="Your name"
            value={form.values.name}
            onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
          />
        )}

        <TextInput
          required
          label="Email"
          placeholder="hello@mantine.dev"
          value={form.values.email}
          onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
          error={form.errors.email && form.errors.email}
        />

        <PasswordInput
          required
          label="Password"
          placeholder="Your password"
          value={form.values.password}
          onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
          error={form.errors.password && 'Password should include at least 6 characters'}
        />
      </Stack>

      <Group position="apart" mt="xl">
        <Anchor component="button" type="button" color="dimmed" onClick={clickHandler} size="xs">
          {type === 'register'
            ? 'Already have an account? Login'
            : "Don't have an account? Register"}
        </Anchor>
        <Button type="submit">{upperFirst(type)}</Button>
      </Group>
    </form>
  );
};

export default LoginForm;
