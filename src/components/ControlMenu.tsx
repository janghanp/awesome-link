import {
  Menu,
  ActionIcon,
  Modal,
  Divider,
  Text,
  Group,
  Button,
} from "@mantine/core";
import { IconTrash, IconEdit, IconDots } from "@tabler/icons";
import { useState } from "react";

type Props = {
  deleteLinkHandler: (
    cb: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
};

const ControlMenu = ({ deleteLinkHandler }: Props) => {
  const [opened, setOpened] = useState<boolean>(false);

  return (
    <>
      <Menu shadow="md" width={200} position="bottom-end">
        <Menu.Target>
          <ActionIcon>
            <IconDots color="gray" />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item icon={<IconEdit size={14} />}>Edit</Menu.Item>
          <Menu.Item
            onClick={() => setOpened(true)}
            icon={<IconTrash size={14} />}
          >
            Delete
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        withCloseButton={false}
        title="Confirmation"
        styles={{ title: { fontWeight: "bold", fontSize: "18px" } }}
      >
        <Divider />
        <Text weight="600" color="gray" my="md">
          Are you sure you want to delete this link?
        </Text>
        <Divider />
        <Group position="right" mt="md">
          <Button
            onClick={() => {
              deleteLinkHandler(setOpened);
            }}
            color="red"
          >
            Yes
          </Button>
          <Button onClick={() => setOpened(false)} variant="default">
            No
          </Button>
        </Group>
      </Modal>
    </>
  );
};
export default ControlMenu;
