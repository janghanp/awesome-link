import { useEffect } from 'react';
import { Paper } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { gql, useQuery } from '@apollo/client';

import CustomHeader from './CustomHeader';
import { useCurrentUserState } from '../store';
import { UserWithBookmarks } from '../types';

const GET_USER = gql`
  query User($email: String!) {
    getUser(email: $email) {
      id
      name
      email
      image
      role
      bookmarks {
        id
      }
    }
  }
`;

interface UserData {
  getUser: UserWithBookmarks;
}

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const { status, data: session } = useSession();

  const { data } = useQuery<UserData>(GET_USER, {
    variables: { email: session?.user.email },
    skip: !session,
  });

  const { currentUser, setCurrentUser } = useCurrentUserState();

  useEffect(() => {
    if (data) {
      setCurrentUser(data.getUser);
    }
  }, [data, setCurrentUser]);

  if (status === 'loading' || (session && !currentUser)) {
    return <div></div>;
  }

  return (
    <>
      <Paper>
        <CustomHeader />
        <main>{children}</main>
      </Paper>
    </>
  );
}
