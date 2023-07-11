/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    screens: {
      xs: "475px",
      md: "668px",
      lg: "820px",
    },
    extend: {},
  },
  plugins: [],
};
