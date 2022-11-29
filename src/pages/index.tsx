import { gql, useQuery } from '@apollo/client';
import { Container } from '@mantine/core';

import LinkCardList from '../components/LinkCardList';

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

const Home = () => {
  const { loading, data, error, fetchMore } = useQuery(GET_LINKS, {
    variables: {
      after: null,
    },
  });

  if (loading) {
    return;
  }

  const { endCursor, hasNextPage } = data.getLinks.pageInfo;

  const loadNextPage = async () => {
    await fetchMore({
      variables: { after: endCursor },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        fetchMoreResult.getLinks.edges = [
          ...prevResult.getLinks.edges,
          ...fetchMoreResult.getLinks.edges,
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
      <LinkCardList
        links={data.getLinks.edges}
        hasNextPage={hasNextPage}
        loadNextPage={loadNextPage}
      />
    </Container>
  );
};

export default Home;
