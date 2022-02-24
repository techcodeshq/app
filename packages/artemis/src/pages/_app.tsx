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

function MyApp({ Component, pageProps }) {
  useProgressBar();
  const variants = {
    hidden: { opacity: 0 },
    enter: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <SWRConfig>
      <SessionProvider>
        <ChakraProvider resetCSS theme={theme}>
          <AnimatePresence>
            <motion.main
              variants={variants}
              initial="hidden"
              animate="enter"
              exit="exit"
              transition={{ type: "linear" }}
            >
              <Component {...pageProps} />
            </motion.main>
          </AnimatePresence>
        </ChakraProvider>
      </SessionProvider>
    </SWRConfig>
  );
}

export default MyApp;
