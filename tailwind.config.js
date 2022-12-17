/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        darkBg: "#050505",
        primary: {
          default: "#00FF78",
          alt: "#00CC5F",
          hover: "#0000FF",
          light: "#8EFAB0",
        },
        dark: {
          black: "#0C0E12",
          background: "#17191E",
          foreground: "#22262E",
          forefront: "#292D37",
        },
        neutral: {
          0: "#FAFBFF",
          100: "#F0F2F7",
          200: "#DADEE6",
        },
        border: {
          default: "#292D37",
          light: "#393E48",
        },
        text: {
          default: "rgba(12, 14, 18, 0.92)",
          light: "rgba(12, 14, 18, 0.76)",
          disabled: "rgba(12, 14, 18, 0.6)",
          inverse: {
            default: "rgba(250, 251, 255, 0.92)",
            light: "rgba(250, 251, 255, 0.76)",
            disabled: "rgba(250, 251, 255, 0.6)",
          },
        },
        gradients: {
          white: "rgba(255, 255, 255, 1)",
          whiteStart: "rgba(255, 255, 255, 0.5)",
          whiteMiddle: "rgba(255, 255, 255, 0.8)",
          red: "rgba(251, 123, 162, 0.3)",
          yellow: "rgba(252, 224, 67, 0.3)",
          green: "rgba(128, 255, 114, 0.3)",
          blue: "rgba(126, 232, 250, 0.3)",
        },
        yellow: "#F7EA4A",
      },
      typography: {
        DEFAULT: {
          css: {
            a: {
              color: "#0000FF",
            },
            maxWidth: "100%",
            paddingRight: "2rem",
          },
        },
      },
    },
  },
  plugins: [],
};
