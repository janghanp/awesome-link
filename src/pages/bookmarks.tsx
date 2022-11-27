import { gql, useQuery } from '@apollo/client';
import { Container, Divider, Title } from '@mantine/core';
import { useRouter } from 'next/router';

import { useCurrentUserState } from '../store';
import { Link } from '../types';
import LinkCardList from '../components/LinkCardList';

export const GET_BOOKMARK_LINKS = gql`
  query BookmarkLinks($userId: String!) {
    bookmarkLinks(userId: $userId) {
      id
      title
      description
      url
      imageUrl
      public_id
      createdAt
    }
  }
`;

interface LinksData {
  bookmarkLinks: Link[];
}

const Bookmarks = () => {
  const router = useRouter();

  const currentUser = useCurrentUserState((state) => state.currentUser);

  if (!currentUser) {
    router.push('/');
    return;
  }

  const {
    loading,
    data,
    refetch: refetchBookmarks,
  } = useQuery<LinksData>(GET_BOOKMARK_LINKS, {
    variables: {
      userId: currentUser.id,
    },
    skip: !currentUser,
    fetchPolicy: 'no-cache',
  });

  if (loading) {
    return;
  }

  return (
    <Container
      size={1500}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Title order={1} mb="md">
        Your list
      </Title>
      <Divider />
      {/* <LinkCardList links={data.bookmarkLinks} refetch={refetchBookmarks} /> */}
    </Container>
  );
};

export default Bookmarks;
