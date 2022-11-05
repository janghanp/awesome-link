import { gql, useQuery } from "@apollo/client";
import { SimpleGrid, Container } from "@mantine/core";
import { Link } from "@prisma/client";
import LinkCard from "./LinkCard";

const GET_LINKS = gql`
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
  const { loading, data, error, refetch } = useQuery<LinksData>(GET_LINKS);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container py="xl">
      <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
        {data.getLinks.map((link) => {
          return (
            <LinkCard
              key={link.id}
              id={link.id}
              title={link.title}
              description={link.description}
              link={link.url}
              imageUrl={link.imageUrl}
              public_id={link.public_id}
              refetch={refetch}
            />
          );
        })}
      </SimpleGrid>
    </Container>
  );
};

export default LinkCardList;
