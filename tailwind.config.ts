import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        crema: {
          50: "#FDFBF7",
          100: "#FAF6EE",
          200: "#F2E9D8",
          300: "#E5D7BE",
        },
        tierra: {
          900: "#241C15",
          800: "#3A2E25",
          700: "#57463A",
          600: "#786455",
        },
        terracotta: {
          50: "#FDF3EF",
          100: "#FBE3D9",
          500: "#D4653B",
          600: "#C0522A",
          700: "#9E3F1D",
        },
        valle: {
          50: "#EFFAF5",
          100: "#D7F2E6",
          500: "#238564",
          600: "#1B6B50",
          700: "#14533E",
        },
        lago: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          500: "#2B6CB0",
          600: "#23568F",
        },
      },
      keyframes: {
        kenburns: {
          "0%": { transform: "scale(1) translate(0px, 0px)" },
          "50%": { transform: "scale(1.05) translate(-8px, -6px)" },
          "100%": { transform: "scale(1) translate(0px, 0px)" },
        },
      },
      animation: {
        kenburns: "kenburns 30s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
