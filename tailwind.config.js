const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

/**
 * @type {import("tailwindcss").Config}
 */
module.exports = {
  content: ["src/**/*.{js,ts,tsx}"],
  darkMode: "class",
  theme: {
    colors: {
      current: colors.current,
      white: colors.white,
      black: colors.black,
      transparent: colors.transparent,
      neutral: colors.neutral,
      purple: colors.purple,
      red: colors.red,
    },
    extend: {
      fontFamily: {
        sans: ["Noto Sans Display", ...defaultTheme.fontFamily.sans],
      },
    },
  },
};
