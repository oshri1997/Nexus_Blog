/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      animation: {
        moveRightToLeft: "moveRightToLeft 1s infinite linear",
      },
      keyframes: {
        moveRightToLeft: {
          "0%,100%": { transform: "translateX(2px)" },
          "50%": { transform: "translateX(-2px)" },
        },
      },
    },
  },
  plugins: [require("flowbite/plugin"), require("tailwind-scrollbar")],
};
