import { SimpleGrid, Container } from '@mantine/core';

import LinkCard from './LinkCard';
import { LinkWithCursor } from '../types';
import { useCallback, useRef } from 'react';

type Props = {
  loadNextPage: () => void;
  hasNextPage: boolean;
  links: LinkWithCursor[];
};

const LinkCardList = ({ links, loadNextPage, hasNextPage }: Props) => {
  const observer = useRef<IntersectionObserver>();

  const lastLinkElementRef = useCallback(
    (node) => {
      //delete previous one.
      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          //load nextPage if there is one to fetch
          if (hasNextPage) {
            loadNextPage();
          }
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [links]
  );

  return (
    <Container py="xl">
      <SimpleGrid className="grid" cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        {links.map((link, index) => {
          if (index + 1 === links.length) {
            //last element
            return (
              <div key={link.node.id} ref={lastLinkElementRef}>
                <LinkCard link={link.node} />
              </div>
            );
          } else {
            return (
              <div key={link.node.id}>
                <LinkCard link={link.node} />
              </div>
            );
          }
        })}
      </SimpleGrid>
    </Container>
  );
};

export default LinkCardList;
