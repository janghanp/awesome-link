import { Container, Text } from "@mantine/core";

import LinkCard from "../components/LinkCard";

export default function Home() {
  return (
    <Container
      style={{
        borderStyle: "solid",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <LinkCard />
      <LinkCard />
      <LinkCard />
      <LinkCard />
      <LinkCard />
      <LinkCard />
      <LinkCard />
    </Container>
  );
}
