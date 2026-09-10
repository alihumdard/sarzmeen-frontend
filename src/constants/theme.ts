export const theme = {
  colors: {
    primary: "#1F7A4D",
    primaryDark: "#155C39",
    primaryLight: "#E8F5EE",

    white: "#FFFFFF",
    black: "#111111",

    heading: "#17251F",
    text: "#4B5563",
    muted: "#6B7280",

    background: "#FFFFFF",
    surface: "#F8FAF9",
    border: "#E5E7EB",

    success: "#16A34A",
    warning: "#F59E0B",
    danger: "#DC2626",
    info: "#2563EB",
  },

  layout: {
    container: "1280px",
  },

  radius: {
    sm: "6px",
    md: "10px",
    lg: "16px",
    xl: "24px",
    full: "9999px",
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
    "3xl": "64px",
  },
} as const;