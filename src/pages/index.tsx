import { Container } from '@mantine/core';

import LinkCardList from '../components/LinkCardList';


export default function Home() {
  return (
    <Container
      size={1500}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <LinkCardList />
    </Container>
  );
}
