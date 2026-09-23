import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "GFS Didot", "serif"],
        reading: ["var(--font-reading)", "EB Garamond", "serif"],
        sans: ["var(--font-ui)", "Inter", "sans-serif"],
      },
      colors: {
        paper: {
          50: "#F3EDDF",
          100: "#F6F0E3",
          200: "#EEE6D7",
          300: "#E2D7C5",
        },
        ink: {
          900: "#1F1C19",
          700: "#4B4640",
          500: "#777069",
          bg: "#20282B",
          surface: "#293235",
          "surface-2": "#323B3E",
          line: "#475155",
        },
        line: "#CFC4B4",
        brand: {
          300: "#D18A90",
          500: "#A64A54",
          700: "#7C303B",
          dark: "#B65A64",
        },
        semantic: {
          success: "#B8D86A",
          warning: "#F4D35E",
          error: "#E9827D",
          info: "#7DBBDA",
        },
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        lg: "10px",
        pill: "999px",
      },
      boxShadow: {
        sm: "0 2px 8px rgba(31, 28, 25, 0.08)",
        editorial: "0 4px 20px rgba(31, 28, 25, 0.06)",
      },
      maxWidth: {
        reading: "68ch",
      },
      fontSize: {
        "display-xl": ["4.5rem", { lineHeight: "0.95" }], // 72px (GFS Didot)
        "display-lg": ["3.5rem", { lineHeight: "1.0" }],  // 56px (GFS Didot)
        h1: ["2.75rem", { lineHeight: "1.0" }],           // 44px (GFS Didot)
        h2: ["2.125rem", { lineHeight: "1.08" }],         // 34px (GFS Didot)
        h3: ["1.625rem", { lineHeight: "1.12" }],         // 26px (GFS Didot)
        h4: ["1.25rem", { lineHeight: "1.2", fontWeight: "600" }], // 20px (Inter 600)
        "body-lg": ["1.3125rem", { lineHeight: "1.55" }], // 21px (EB Garamond)
        body: ["1.125rem", { lineHeight: "1.55" }],       // 18px (EB Garamond)
        "body-sm": ["0.875rem", { lineHeight: "1.45" }],  // 14px (Inter)
        label: ["0.75rem", { lineHeight: "1.3", letterSpacing: "0.04em" }], // 12px (Inter 600)
        caption: ["0.6875rem", { lineHeight: "1.35" }],   // 11px (Inter 500)
      },
    },
  },
  plugins: [],
};

export default config;
