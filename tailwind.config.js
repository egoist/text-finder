/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      backgroundColor: {
        modal: "var(--modal-bg)",
      },
    },
  },
  plugins: [],
}
