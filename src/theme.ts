import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    bg: {
      50: "#edf2f7",
      100: "#ced7e3",
      200: "#acbbd0",
      300: "#8aa1c0",
      400: "#6986af",
      500: "#516e96",
      600: "#3f5574",
      700: "#2e3d52",
      800: "#1b2531",
      900: "#080c12",
    },
    accent: {
      50: "#ece8ff",
      100: "#c6bcfa",
      200: "#9f90f0",
      300: "#7964e8",
      400: "#5338e1",
      500: "#391ec7",
      600: "#2b189c",
      700: "#1f1071",
      800: "#110945",
      900: "#06021d",
    },
    styles: {
      global: (props) => ({
        body: {
          backgroundColor: "bg.900",
        },
      }),
    },
  },
});

export default theme;
