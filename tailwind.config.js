/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/*.{pug, html}"],
  theme: {
    extend: {},
  },
  plugins: [
    {
      tailwindcss: {},
      autoprefixer: {},
    },
  ],
  separator: "_",
};
