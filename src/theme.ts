import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const theme: ThemeConfig = extendTheme({
  colors: {
    bg: {
      50: "#F4F2F7",
      100: "#FFFFFF",
      200: "#F9F9F9",
      300: "#EBF4FF",
      400: "#6986af",
      500: "#516e96",
      600: "#3f5574",
      700: "#0F161F",
      800: "#0C121A",
      900: "#080c12",
    },
    text: {
      50: "#edf1fc",
      100: "#ced4e3",
      200: "#aeb8ce",
      300: "#8f9cbb",
      400: "#6f7fa7",
      500: "#56668e",
      600: "#424f6f",
      700: "#2f3850",
      800: "#1c2231",
      900: "#070b15",
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
  },
  styles: {
    global: (props) => {
      return {
        body: {
          backgroundColor: mode("bg.50", "bg.900")(props),
          color: mode("text.900", "text.50")(props),
        },
        "&::-webkit-scrollbar": {
          height: "0.5rem",
          width: "0.5rem",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "gray.700",
          borderRadius: "0.4rem",
        },
        scrollbarWidth: "thin",
        scrollbarColor: "gray.700",
      };
    },
  },
  components: {
    Button: {
      variants: {
        solid: (props) => ({
          bg: "accent.400",
          _hover: {
            bg: "accent.300",
          },
          color: "text.50",
        }),
        outline: (props) => ({
          borderColor: "accent.600",
          _hover: {
            bg: "accent.300",
          },
        }),
      },
    },
    Input: {
      variants: {
        filled: (props) => ({
          bg: "bg.100",
          _hover: {
            bg: "accent.300",
          },
          color: "text.50",
        }),
      },
    },
  },
  config: {
    initialColorMode: "system",
    useSystemColorMode: true,
  },
});

export default theme;
