import {
  Anchor,
  Button,
  Group,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { upperFirst } from "@mantine/hooks";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

type Props = {
  type: "login" | "register";
};

const LoginForm = ({ type }: Props) => {
  const router = useRouter();

  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
    },

    validate: {
      email: (val: string) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val: string) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  useEffect(() => {
    //check if there is an error(an email is already in use) from next-auth and if there is one set an error to useForm.
  }, []);

  const clickHandler = () => {
    if (type === "login") {
      router.push("/signup");
    }

    if (type === "register") {
      router.push("/login");
    }
  };

  return (
    <form
      onSubmit={form.onSubmit(() => {
        signIn("credentials", {
          email: form.values.email,
          name: form.values.name,
          password: form.values.password,
          callbackUrl: "/",
        });
      })}
    >
      <Stack>
        {type === "register" && (
          <TextInput
            label="Name"
            placeholder="Your name"
            value={form.values.name}
            onChange={(event) =>
              form.setFieldValue("name", event.currentTarget.value)
            }
          />
        )}

        <TextInput
          required
          label="Email"
          placeholder="hello@mantine.dev"
          value={form.values.email}
          onChange={(event) =>
            form.setFieldValue("email", event.currentTarget.value)
          }
          error={form.errors.email && "Invalid email"}
        />

        <PasswordInput
          required
          label="Password"
          placeholder="Your password"
          value={form.values.password}
          onChange={(event) =>
            form.setFieldValue("password", event.currentTarget.value)
          }
          error={
            form.errors.password &&
            "Password should include at least 6 characters"
          }
        />
      </Stack>

      <Group position="apart" mt="xl">
        <Anchor
          component="button"
          type="button"
          color="dimmed"
          onClick={clickHandler}
          size="xs"
        >
          {type === "register"
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </Anchor>
        <Button type="submit">{upperFirst(type)}</Button>
      </Group>
    </form>
  );
};

export default LoginForm;
