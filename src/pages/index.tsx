import { gql, useQuery } from '@apollo/client';
import { Container } from '@mantine/core';

import LinkCardList from '../components/LinkCardList';
// import { Link } from '../types';

export const GET_LINKS = gql`
  query GetLinks($after: String) {
    getLinks(after: $after) {
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

export default function Home() {
  const {
    loading,
    data,
    refetch: refetchAllLInks,
    fetchMore,
  } = useQuery(GET_LINKS, {
    variables: {
      after: null,
    },
  });

  if (loading) {
    return;
  }

  const { endCursor, hasNextPage } = data.getLinks.pageInfo;

  return (
    <Container
      size={1500}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <LinkCardList links={data.getLinks.edges} refetch={refetchAllLInks} />

      {hasNextPage && (
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded my-10"
          onClick={() => {
            fetchMore({
              variables: { after: endCursor },
              updateQuery: (prevResult, { fetchMoreResult }) => {
                fetchMoreResult.getLinks.edges = [
                  ...prevResult.getLinks.edges,
                  ...fetchMoreResult.getLinks.edges,
                ];
                return fetchMoreResult;
              },
            });
          }}
        >
          more
        </button>
      )}
    </Container>
  );
}
