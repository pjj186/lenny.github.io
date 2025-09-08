/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/
 */

import React from "react"
import { ThemeProvider } from "./src/components/theme-provider"

/**
 * @type {import('gatsby').GatsbySSR['onRenderBody']}
 */
export const onRenderBody = ({ setHtmlAttributes, setHeadComponents }) => {
  setHtmlAttributes({ lang: `en` })

  // 테마 깜빡임 방지를 위한 스크립트
  setHeadComponents([
    <script
      key="theme-script"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            var storageKey = 'vite-ui-theme';
            var defaultTheme = 'dark';
            try {
              var theme = localStorage.getItem(storageKey) || defaultTheme;
              document.documentElement.classList.add(theme);
            } catch (e) {
              document.documentElement.classList.add(defaultTheme);
            }
          })();
        `,
      }}
    />,
  ])
}

export const wrapRootElement = ({ element }) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {element}
    </ThemeProvider>
  )
}
