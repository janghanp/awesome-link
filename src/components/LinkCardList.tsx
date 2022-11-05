import { gql, useQuery } from "@apollo/client";
import { SimpleGrid, Container, Skeleton } from "@mantine/core";
import { Link } from "@prisma/client";
import LinkCard from "./LinkCard";

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
  const { loading, data, error } = useQuery<LinksData>(GET_LINKS);

  return (
    <Container py="xl">
      <SimpleGrid cols={3} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
        {loading && !data ? (
          <>
            {Array.from({ length: 7 }).map(() => (
              <Skeleton height="300px" width="300px" mb="xl" radius="md" />
            ))}
          </>
        ) : (
          data.getLinks.map((link) => {
            return (
              <LinkCard
                key={link.id}
                id={link.id}
                title={link.title}
                description={link.description}
                link={link.url}
                imageUrl={link.imageUrl}
                public_id={link.public_id}
              />
            );
          })
        )}
      </SimpleGrid>
    </Container>
  );
};

export default LinkCardList;
