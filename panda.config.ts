import { defineConfig, defineGlobalStyles } from "@pandacss/dev";

const globalCss = defineGlobalStyles({
  "::selection": {
    backgroundColor: "purple.500",
    color: "white",
  },

  body: {
    backgroundColor: { base: "neutral.100", _dark: "neutral.900" },
    color: { base: "black", _dark: "white" },
    fontFamily: "sans",
    fontSize: 14,
  },

  "#modal-root": {
    position: "absolute",
    zIndex: 50,
  },
});

export default defineConfig({
  globalCss,

  preflight: true,

  outdir: "src/browser/styled-system",
  outExtension: "js",

  jsxFramework: "react",
  jsxStyleProps: "minimal",

  include: ["src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      tokens: {
        fonts: {
          sans: {
            value:
              "'Noto Sans Display', system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'",
          },
        },
      },
    },
  },
});
