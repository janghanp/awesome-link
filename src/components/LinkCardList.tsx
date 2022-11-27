import { SimpleGrid, Container } from '@mantine/core';

import LinkCard from './LinkCard';
import { Link, LinkWithCursor } from '../types';

type Props = {
  links: LinkWithCursor[];
  refetch?: () => void;
};

const LinkCardList = ({ links, refetch }: Props) => {
  return (
    <Container py="xl">
      <SimpleGrid className="grid" cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        {links.map((link) => {
          return <LinkCard key={link.node.id} link={link.node} refetch={refetch} />;
        })}
      </SimpleGrid>
    </Container>
  );
};

export default LinkCardList;
