import { gql, useQuery } from '@apollo/client';
import { Container, Divider, Title } from '@mantine/core';
import { useRouter } from 'next/router';

import { useCurrentUserState } from '../store';
import LinkCardList from '../components/LinkCardList';

export const GET_BOOKMARK_LINKS = gql`
  query GetBookmarkLinks($userId: String!, $after: String) {
    getBookmarkLinks(userId: $userId, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          id
          title
          description
          url
          imageUrl
          public_id
          createdAt
        }
      }
    }
  }
`;

const Bookmarks = () => {
  const router = useRouter();

  const currentUser = useCurrentUserState((state) => state.currentUser);

  if (!currentUser) {
    router.push('/');
    return;
  }

  const { loading, data, fetchMore } = useQuery(GET_BOOKMARK_LINKS, {
    variables: {
      userId: currentUser.id,
      after: null,
    },
    skip: !currentUser,
  });

  if (loading) {
    return;
  }

  const { endCursor, hasNextPage } = data.getBookmarkLinks.pageInfo;

  const loadNextPage = async () => {
    await fetchMore({
      variables: { after: endCursor },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        fetchMoreResult.getBookmarkLinks.edges = [
          ...prevResult.getBookmarkLinks.edges,
          ...fetchMoreResult.getBookmarkLinks.edges,
        ];
        return fetchMoreResult;
      },
    });
  };

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
        Bookmarks
      </Title>
      <Divider />
      <LinkCardList
        links={data.getBookmarkLinks.edges}
        hasNextPage={hasNextPage}
        loadNextPage={loadNextPage}
      />
    </Container>
  );
};

export default Bookmarks;
