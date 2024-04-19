import { defineConfig, defineGlobalStyles } from "@pandacss/dev";

const globalCss = defineGlobalStyles({
  "*": {
    scrollbarColor: "{colors.purple.500} {colors.transparent}",
    scrollbarWidth: "thin",
  },

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

  ".os-theme-gumbo": {
    "--os-handle-bg-active": "{colors.purple.600}",
    "--os-handle-bg-hover": "{colors.purple.400}",
    "--os-handle-bg": "{colors.purple.500}",
    "--os-handle-border-radius": "{radii.full}",
    "--os-handle-interactive-area-offset": "3px",
    "--os-padding-axis": "3px",
    "--os-padding-perpendicular": "3px",
    "--os-size": "8px",

    "& .os-scrollbar-handle": {
      opacity: 0.5,
    },

    _hover: {
      "--os-size": "10px",

      "& .os-scrollbar-handle": {
        opacity: 1,
      },
    },
  },
});

export default defineConfig({
  globalCss,

  preflight: true,

  outdir: "src/browser/styled-system",
  outExtension: "js",

  importMap: "",

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
