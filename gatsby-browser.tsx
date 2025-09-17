// custom typefaces
import "@fontsource-variable/montserrat";
import "@fontsource/merriweather";
// normalize CSS across browsers
// import "./src/normalize.css"

// custom CSS styles
import "./src/style.css";

// Highlighting for code blocks
import "prismjs/themes/prism-tomorrow.css";

import React from "react";
import { ThemeProvider } from "./src/components/theme-provider";

export const wrapRootElement = ({ element }) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {element}
    </ThemeProvider>
  );
};
