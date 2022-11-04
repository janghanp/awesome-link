import React from "react";
import { Button, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

import { User } from "@prisma/client";
import { useCurrentUserState } from "../store";

type Props = {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfileForm = ({ setVisible }: Props) => {
  const currentUser = useCurrentUserState((state) => state.currentUser);

  const form = useForm({
    initialValues: {
      email: currentUser.email,
      name: currentUser.name,
    },
  });

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(form.values);
  };

  return (
    <form onSubmit={submitHandler}>
      <Stack>
        <TextInput
          label="Name"
          value={form.values.name}
          onChange={(event) =>
            form.setFieldValue("name", event.currentTarget.value)
          }
        />

        <TextInput
          label="Email"
          disabled
          value={form.values.email}
          onChange={(event) =>
            form.setFieldValue("email", event.currentTarget.value)
          }
          error={form.errors.email && form.errors.email}
        />

        {/* <PasswordInput
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
        /> */}
      </Stack>

      <Button type="submit" mt="lg">
        Update
      </Button>
    </form>
  );
};

export default ProfileForm;
