import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    bg: "#FFFEFC",
    card: "#F5F1E8",
    primary: "#EAC36A",
    textMain: "#1C1C1C",
    textMuted: "#8B846D",
    placeholder: "#A89F88",
  },
  radii: {
    xl: "1rem",
    pill: "9999px",
  },
  styles: {
    global: {
      body: {
        bg: "bg",
        color: "textMain",
      },
    },
  },
});

export default theme;
