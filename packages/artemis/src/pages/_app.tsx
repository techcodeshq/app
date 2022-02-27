import { ChakraProvider } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";
import theme from "../theme";
import "../../public/styles/nprogress.css";
import "github-markdown-css";
import "swiper/css";
import "react-mde/lib/styles/css/react-mde-all.css";
import { useProgressBar } from "@hooks/useProgressBar";
import { PermissionsProvider } from "@modules/auth/permissions/socket";

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
