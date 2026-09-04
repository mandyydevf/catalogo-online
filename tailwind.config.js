/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F5DBCB",
        surface: "#FFFBF7",
        ink: "#4A2E39",
        pink: "#F92A82",
        coral: "#ED7B84",
        sand: "#D6D5B3",
        olive: "#7EB77F",
      },
      fontFamily: {
        display: ["var(--font-sans)"],
        body: ["var(--font-sans)"],
      },
    },
  },
  plugins: [],
};