import { SimpleGrid, Container, Skeleton } from '@mantine/core';
import { Link } from '@prisma/client';
import LinkCard from './LinkCard';

type Props = {
  links: Link[];
  refetch?: () => void;
};

const LinkCardList = ({ links, refetch }: Props) => {
  return (
    <Container py="xl">
      <SimpleGrid className="grid" cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        {links.map((link) => {
          return <LinkCard key={link.id} link={link} refetch={refetch} />;
        })}
      </SimpleGrid>
    </Container>
  );
};

export default LinkCardList;
