import merge from "deepmerge";
import { green } from "@material-ui/core/colors";
import { THEMES } from "../constants";
import { darken, lighten } from "@material-ui/core";

const secondarySource = "#b50128";

export const customSecondary = {
  50: darken(secondarySource, 0.25),
  100: darken(secondarySource, 0.2),
  200: darken(secondarySource, 0.15),
  300: darken(secondarySource, 0.1),
  400: darken(secondarySource, 0.05),
  500: secondarySource,
  600: lighten(secondarySource, 0.05),
  700: lighten(secondarySource, 0.1),
  800: lighten(secondarySource, 0.15),
  900: lighten(secondarySource, 0.2),
};

const highlightSource = "#01236a";

export const customHighlight = {
  50: darken(highlightSource, 0.25),
  100: darken(highlightSource, 0.2),
  200: darken(highlightSource, 0.15),
  300: darken(highlightSource, 0.1),
  400: darken(highlightSource, 0.05),
  500: highlightSource,
  600: lighten(highlightSource, 0.05),
  700: lighten(highlightSource, 0.1),
  800: lighten(highlightSource, 0.15),
  900: lighten(highlightSource, 0.2),
};

const darkSource = "#1D2228";

export const customDark = {
  50: darken(darkSource, 0.25),
  100: darken(darkSource, 0.2),
  200: darken(darkSource, 0.15),
  300: darken(darkSource, 0.1),
  400: darken(darkSource, 0.05),
  500: darkSource,
  600: lighten(darkSource, 0.05),
  700: lighten(darkSource, 0.1),
  800: lighten(darkSource, 0.15),
  900: lighten(darkSource, 0.2),
};

const greySource = "#E1E2E2";

export const customGrey = {
  50: darken(greySource, 0.25),
  100: darken(greySource, 0.2),
  200: darken(greySource, 0.15),
  300: darken(greySource, 0.1),
  400: darken(greySource, 0.05),
  500: greySource,
  600: lighten(greySource, 0.05),
  700: lighten(greySource, 0.1),
  800: lighten(greySource, 0.15),
  900: lighten(greySource, 0.2),
};

const defaultVariant = {
  name: THEMES.DEFAULT,
  palette: {
    type: "light",
    primary: {
      main: customHighlight[700],
      contrastText: "#FFF",
    },
    secondary: {
      main: customSecondary[500],
      contrastText: "#FFF",
    },
    background: {
      default: "#F7F9FC",
      toolbar: darken("#F7F9FC", 0.05),
      toolbar2: darken("#F7F9FC", 0.02),
      paper: "#FFF",
    },
  },
  header: {
    color: customGrey[500],
    background: customDark[50],
    search: {
      color: customGrey[800],
    },
    indicator: {
      background: customHighlight[600],
    },
  },
  footer: {
    color: customGrey[200],
    background: "#FFF",
  },
  sidebar: {
    color: customGrey[200],
    background: customDark[400],
    header: {
      color: customGrey[200],
      background: customDark[50],
      brand: {
        color: customHighlight[500],
      },
    },
    footer: {
      color: customGrey[200],
      background: customDark[100],
      online: {
        background: green[500],
      },
    },
    badge: {
      color: "#FFF",
      background: customHighlight[500],
    },
  },
  scrollbar: {
    track: "rgb(240, 242, 247)",
    thumb: "rgb(218, 222, 237)",
  },
  severity: {
    success: "",
    warning: "",
    info: "",
    error: "",
  },
};

const darkVariant = merge(defaultVariant, {
  name: THEMES.DARK,
  palette: {
    type: "dark",
    primary: {
      main: customHighlight[600],
      contrastText: "#FFF",
    },
    background: {
      default: customDark[200],
      toolbar: lighten(customDark[200], 0.02),
      toolbar2: lighten(customDark[200], 0.02),
      paper: customDark[400],
    },
    text: {
      primary: "rgba(255, 255, 255, 0.95)",
      secondary: "rgba(255, 255, 255, 0.5)",
    },
  },
  sidebar: {
    header: {
      background: "#000000",
    },
  },
  header: {
    color: customGrey[300],
    background: "#000000",
    search: {
      color: customGrey[200],
    },
  },
  footer: {
    color: customGrey[300],
    background: "#000000",
  },
  scrollbar: {
    track: darken(customDark[300], 0.05),
    thumb: customDark[500],
  },
});

const lightVariant = merge(defaultVariant, {
  name: THEMES.LIGHT,
  palette: {
    type: "light",
  },
  header: {
    color: customGrey[200],
    background: customHighlight[800],
    search: {
      color: customGrey[100],
    },
    indicator: {
      background: customHighlight[700],
    },
  },
  sidebar: {
    color: customDark[50],
    background: "#FFF",
    header: {
      color: "#FFF",
      background: customHighlight[800],
      brand: {
        color: "#FFFFFF",
      },
    },
    footer: {
      color: customDark[800],
      background: "#F7F7F7",
      online: {
        background: green[500],
      },
    },
  },
  footer: {
    color: customDark[800],
    background: "#FFF",
  },
  scrollbar: {
    track: darken(customGrey[300], 0.05),
    thumb: customGrey[500],
  },
});

const variants = [defaultVariant, darkVariant, lightVariant];

export default variants;
