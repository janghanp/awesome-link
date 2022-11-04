import { Menu, Avatar, UnstyledButton, Divider, Text } from "@mantine/core";
import { IconLogout, IconSettings } from "@tabler/icons";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

type Props = {
  image?: string;
  name: string;
};

const UserAvatar = ({ image, name }: Props) => {
  const router = useRouter();

  const signOutHandler = () => {
    signOut();
    router.push("/");
  };

  const settingsHandler = () => {
    router.push("/settings");
  };

  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <UnstyledButton>
          <Avatar src={image} radius="xl" />
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label mb="sm">
          <Text weight="800" size="md">
            {name}
          </Text>
        </Menu.Label>

        <Menu.Item onClick={settingsHandler} icon={<IconSettings size={16} />}>
          Settings
        </Menu.Item>

        <Divider my="sm" />

        <Menu.Item onClick={signOutHandler} icon={<IconLogout size={16} />}>
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserAvatar;
function useStyles(): { classes: any; theme: any } {
  throw new Error("Function not implemented.");
}
