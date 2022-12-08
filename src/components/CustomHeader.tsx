import {
  createStyles,
  Header,
  Group,
  Button,
  Divider,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  UnstyledButton,
  Text,
  Avatar,
  ActionIcon,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLogout, IconBookmarks } from '@tabler/icons';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCurrentUserState } from '../store';

import ToggleThemeButton from './ToggleThemeButton';
import UserAvatar from './UserAvatar';

const useStyles = createStyles((theme) => ({
  link: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan('sm')]: {
      height: 42,
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },

    ...theme.fn.hover({
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    }),
  },

  subLink: {
    width: '100%',
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    borderRadius: theme.radius.md,

    ...theme.fn.hover({
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
    }),

    '&:active': theme.activeStyles,
  },

  dropdownFooter: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
    margin: -theme.spacing.md,
    marginTop: theme.spacing.sm,
    padding: `${theme.spacing.md}px ${theme.spacing.md * 2}px`,
    paddingBottom: theme.spacing.xl,
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  hiddenMobile: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },
}));

const CustomHeader = () => {
  const router = useRouter();

  const { currentUser, setCurrentUser } = useCurrentUserState();

  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

  const { classes, theme } = useStyles();

  const signOutHandler = () => {
    signOut();
    setCurrentUser(null);
  };

  return (
    <Box pb={20}>
      <Header height={60} px="md">
        <Group position="apart" sx={{ height: '100%' }} px="lg">
          <UnstyledButton onClick={() => router.push('/')}>
            <Text size="md" weight="700">
              Awesome-link
            </Text>
          </UnstyledButton>

          <Group className={classes.hiddenMobile}>
            <ToggleThemeButton />

            {currentUser && currentUser.role === 'ADMIN' && (
              <Button onClick={() => router.push('/admin')} size="sm" variant="filled" color="dark">
                Create Link
              </Button>
            )}

            {currentUser ? (
              <>
                <ActionIcon onClick={() => router.push('/bookmarks')}>
                  <IconBookmarks />
                </ActionIcon>
                <UserAvatar image={currentUser.image} name={currentUser.name} />
              </>
            ) : (
              <>
                <Button variant="default" color="dark" onClick={() => router.push('/login')}>
                  Log in
                </Button>
                <Button color="dark" onClick={() => router.push('/signup')}>
                  Sign up
                </Button>
              </>
            )}
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} className={classes.hiddenDesktop} />
        </Group>
      </Header>

      <Drawer
        styles={{ header: { margin: '0px' } }}
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title={currentUser ? <Avatar radius="xl" src={currentUser.image} /> : ''}
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea sx={{ height: 'calc(100vh - 60px)' }} mx="-md">
          <Divider my="sm" color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'} />

          <Group position="center" grow pb="xl" px="md">
            {currentUser ? (
              <Button onClick={signOutHandler} color="dark">
                <Group>
                  <IconLogout size={18} />
                  <Text size="md">Log out</Text>
                </Group>
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  color="dark"
                  onClick={() => {
                    router.push('/login');
                    closeDrawer();
                  }}
                >
                  Log in
                </Button>
                <Button
                  color="dark"
                  onClick={() => {
                    router.push('/signup');
                    closeDrawer();
                  }}
                >
                  Sign up
                </Button>
              </>
            )}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
};

export default CustomHeader;
