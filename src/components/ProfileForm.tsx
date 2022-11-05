import React, { useState } from "react";
import { Button, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";

import { User } from "@prisma/client";
import { useCurrentUserState } from "../store";

const UPDATE_USER_INFO = gql`
  mutation UpdateUserInfo($email: String!, $name: String!) {
    updateUserInfo(email: $email, name: $name) {
      id
      name
      email
      image
      role
    }
  }
`;

interface UpdateUserInfo {
  updateUserInfo: User;
}

type Props = {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfileForm = ({ setVisible }: Props) => {
  const router = useRouter();

  const [updateUserInfo] = useMutation<UpdateUserInfo>(UPDATE_USER_INFO);

  const { currentUser, setCurrentUser } = useCurrentUserState();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      email: currentUser.email,
      name: currentUser.name,
    },
  });

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);

    e.preventDefault();

    const response = await updateUserInfo({
      variables: { email: currentUser.email, name: form.values.name },
    });

    setCurrentUser(response.data.updateUserInfo);

    router.push("/");
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
      </Stack>

      <Button loading={isLoading} type="submit" mt="lg">
        Update
      </Button>
    </form>
  );
};

export default ProfileForm;
