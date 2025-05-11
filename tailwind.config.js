/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#4CAF50",
          DEFAULT: "#2E7D32",
          dark: "#1B5E20",
        },
        secondary: {
          light: "#2196F3",
          DEFAULT: "#1976D2",
          dark: "#0D47A1",
        },
        warning: {
          light: "#FFC107",
          DEFAULT: "#FFA000",
          dark: "#FF8F00",
        },
        danger: {
          light: "#F44336",
          DEFAULT: "#D32F2F",
          dark: "#B71C1C",
        },
      },
      boxShadow: {
        node: "0 0 10px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
