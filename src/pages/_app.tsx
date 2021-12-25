import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import theme from "../theme";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    console.log("effect");

    router.events.on("routeChangeComplete", () => {
      console.log("route change");
    });
  }, []);

  return (
    <SessionProvider>
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
}

export default MyApp;
