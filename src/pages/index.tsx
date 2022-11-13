import { gql, useQuery } from '@apollo/client';
import { Container } from '@mantine/core';

import LinkCardList from '../components/LinkCardList';
import { Link } from '@prisma/client';

export const GET_LINKS = gql`
  query GetLinks {
    getLinks {
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
  getLinks: Link[];
}

export default function Home() {
  const { loading, data } = useQuery<LinksData>(GET_LINKS);

  if (loading) {
    return <div>Loading...</div>;
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
      <LinkCardList links={data.getLinks} />
    </Container>
  );
}
