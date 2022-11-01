import type { AppProps } from "next/app";
import Layout from "../components/Latyout";
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";

import "../../styles/global.css";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
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
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
