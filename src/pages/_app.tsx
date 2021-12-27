import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";
import theme from "../theme";

function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig>
      <SessionProvider>
        <ChakraProvider resetCSS theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </SessionProvider>
    </SWRConfig>
  );
}

export default MyApp;
