import { gql, useQuery } from '@apollo/client';
import { SimpleGrid, Container, Skeleton } from '@mantine/core';
import { Link } from '@prisma/client';
import LinkCard from './LinkCard';

export const GET_LINKS = gql`
  query GetLinks {
    getLinks {
      id
      title
      description
      url
      imageUrl
      public_id
    }
  }
`;

interface LinksData {
  getLinks: Link[];
}

const LinkCardList = () => {
  const { loading, data } = useQuery<LinksData>(GET_LINKS);

  return (
    <Container py="xl">
      <SimpleGrid className="grid" cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        {loading && !data ? (
          <>
            {Array.from({ length: 7 }).map((_, index) => (
              <Skeleton key={index} height={400} width="300px" mb="xl" radius="md" />
            ))}
          </>
        ) : (
          data.getLinks.map((link) => {
            return <LinkCard key={link.id} link={link} />;
          })
        )}
      </SimpleGrid>
    </Container>
  );
};

export default LinkCardList;
