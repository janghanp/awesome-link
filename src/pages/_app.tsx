import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { ApolloProvider } from '@apollo/client';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

import '../../styles/global.css';
import Layout from '../components/Layout';
import apolloClient from '../lib/apollo';
import useLocalStorage from '../hooks/useLocalStorage';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const { state, setState } = useLocalStorage('theme', 'light');

  const [colorScheme, setColorScheme] = useState<ColorScheme>(state as ColorScheme);

  const toggleColorScheme = () => {
    setColorScheme((prevState) => (prevState === 'dark' ? 'light' : 'dark'));
    setState(state === 'dark' ? 'light' : 'dark');
  };

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <SessionProvider session={session}>
          <ApolloProvider client={apolloClient}>
            <Layout>
              <Component {...pageProps} />
              <Toaster />
            </Layout>
          </ApolloProvider>
        </SessionProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
