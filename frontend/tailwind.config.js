/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4f7cff",
        "primary-container": "#3a5fd9",
        "primary-fixed": "#4f7cff",
        "on-primary-container": "#ffffff",
        secondary: "#7c5cff",
        "secondary-container": "#e4defc",
        "secondary-fixed": "#7c5cff",
        surface: "#f8f9fc",
        "surface-container": "#eef0f6",
        "surface-container-low": "#f2f3f8",
        "surface-container-lowest": "#ffffff",
        "surface-container-high": "#e7e9f1",
        "on-surface": "#191c24",
        "on-surface-variant": "#5b6270",
        outline: "#c7cbd6",
        "outline-variant": "#dde0e8",
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "sans-serif"],
        "headline-lg": ["Plus Jakarta Sans", "sans-serif"],
        "headline-md": ["Plus Jakarta Sans", "sans-serif"],
        "title-lg": ["Plus Jakarta Sans", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "label-md": ["Inter", "sans-serif"],
      },
      fontSize: {
        "headline-lg": ["28px", "1.2"],
        "headline-md": ["22px", "1.25"],
        "title-lg": ["18px", "1.3"],
        "body-md": ["14px", "1.5"],
        "label-md": ["12px", "1.4"],
      },
      spacing: {
        xs: "6px",
        sm: "10px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        gutter: "20px",
        "margin-mobile": "16px",
        "margin-desktop": "40px",
      },
      animation: {
        "subtle-drift": "drift 12s ease-in-out infinite",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(20px, -10px)" },
        },
      },
    },
  },
  plugins: [],
};
