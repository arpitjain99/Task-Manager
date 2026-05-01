module.exports = {
  content: ["./src/**/*.{js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0a0a0f",
          surface: "#111118",
          elevated: "#1a1a24",
          hover: "#1e1e2e",
          border: "#2a2a3d",
        },
        accent: {
          DEFAULT: "#6366f1",
          hover: "#4f52e0",
        },
      },
      fontFamily: {
        sans: ["Sora", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        accent: "0 0 0 3px rgba(99, 102, 241, 0.15)",
        card: "0 4px 24px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
};
