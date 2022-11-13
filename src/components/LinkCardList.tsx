import { SimpleGrid, Container, Skeleton } from '@mantine/core';
import { Link } from '@prisma/client';
import LinkCard from './LinkCard';

type Props = {
  links: Link[];
};

const LinkCardList = ({ links }: Props) => {
  return (
    <Container py="xl">
      <SimpleGrid className="grid" cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        {links.map((link) => {
          return <LinkCard key={link.id} link={link} />;
        })}
      </SimpleGrid>
    </Container>
  );
};

export default LinkCardList;
