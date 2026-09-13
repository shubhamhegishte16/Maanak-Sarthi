import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bis: {
          burgundy: "#4A1525",
          "burgundy-dark": "#380E1B",
          "burgundy-light": "#611E32",
          sage: "#73836C",
          "sage-dark": "#556450",
          "sage-light": "#E9EFE8",
          gold: "#BA9E76",
          "gold-light": "#F6F1E8",
          cream: "#FAF7F2",
          "cream-dark": "#F2EBE0",
          "cream-card": "#F5F0E6",
          terracotta: "#D86D4A",
          slate: "#1F2421",
          "slate-muted": "#646660",
          border: "#E7E1D4",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      boxShadow: {
        'soft-glow': '0 20px 40px -15px rgba(74, 21, 37, 0.08)',
        'floating': '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
    },
  },
  plugins: [],
};
export default config;
