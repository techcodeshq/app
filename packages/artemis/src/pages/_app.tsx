import { ChakraProvider } from "@chakra-ui/react";
import { useProgressBar } from "@hooks/useProgressBar";
import { PermissionsProvider } from "@modules/auth/permissions/socket";
import "focus-visible/dist/focus-visible";
import "github-markdown-css";
import { SessionProvider } from "next-auth/react";
import "react-mde/lib/styles/css/react-mde-all.css";
import "swiper/css";
import { SWRConfig } from "swr";
import "../../public/styles/nprogress.css";
import theme from "../theme";

function MyApp({ Component, pageProps }) {
  useProgressBar();

  return (
    <SWRConfig>
      <SessionProvider>
        <ChakraProvider resetCSS theme={theme}>
          <PermissionsProvider>
            <Component {...pageProps} />
          </PermissionsProvider>
        </ChakraProvider>
      </SessionProvider>
    </SWRConfig>
  );
}

export default MyApp;
