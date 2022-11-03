import type { AppProps } from "next/app";
import { useState } from "react";
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";
import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";

import "../../styles/global.css";
import Layout from "../components/Latyout";
import apolloClient from "../lib/apollo";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");

  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme((prevState) => (prevState === "dark" ? "light" : "dark"));
  };

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <SessionProvider session={session}>
          <ApolloProvider client={apolloClient}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ApolloProvider>
        </SessionProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
