import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#050712",
        panel: "#0b1020",
        graphite: "#111827",
        cyanfire: "#35f7ff",
        mint: "#6cffb5",
        violet: "#9d7bff",
        ember: "#ffb86b",
      },
      boxShadow: {
        glow: "0 0 40px rgba(53, 247, 255, 0.18)",
        panel: "0 24px 80px rgba(0, 0, 0, 0.42)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -14px, 0)" },
        },
        aurora: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(420%)" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        aurora: "aurora 14s ease infinite",
        scan: "scan 4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
