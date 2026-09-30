const freshGreen = "#1F5F49" as const;

const lightMode = {
  background: "#F9FAF9",
  surface: "#FFFFFF",
  ink: "#2A2A2A",
  muted: "#666666",
  line: "#E0E0E0",
  green: "#2E8F6F",
  freshGreen,
  greenDark: "#1F5F49",
  deep: "#1F5F49",
  onGreen: "#FFFFFF",
  lime: "#A8E8C9",
  coral: "#A8E8C9",
  blue: "#A8E8C9",
  softGreen: "#E8F5EE",
  warning: "#8C4A35",
  error: "#D9534F",
  success: "#5CB85C",
} as const;

const darkMode = {
  background: "#1F1F1F",
  surface: "#2A2A2A",
  ink: "#F9FAF9",
  muted: "#C0C0C0",
  line: "#3A3A3A",
  green: "#A8E8C9",
  freshGreen: "#A8E8C9",
  greenDark: "#A8E8C9",
  deep: "#1F5F49",
  onGreen: "#1F1F1F",
  lime: "#A8E8C9",
  coral: "#A8E8C9",
  blue: "#A8E8C9",
  softGreen: "#273A32",
  warning: "#F0B7A4",
  error: "#F58B88",
  success: "#79D77A",
} as const;

export const colors = {
  brand: {
    primary: "#2E8F6F",
    fresh: freshGreen,
    deep: "#1F5F49",
    highlight: "#A8E8C9",
    onPrimary: "#FFFFFF",
  },
  background: {
    base: "#F9FAF9",
    surface: "#FFFFFF",
    dark: "#1F1F1F",
  },
  text: {
    primary: "#2A2A2A",
    secondary: "#666666",
    muted: "#666666",
    inverse: "#F9FAF9",
  },
  border: {
    subtle: "#E0E0E0",
  },
  status: {
    error: "#D9534F",
    warning: "#F0AD4E",
    success: "#5CB85C",
  },
  modes: {
    light: lightMode,
    dark: darkMode,
  },
} as const;

export const legacyColors = lightMode;
export const darkColors = darkMode;
export type AppColors = { [Key in keyof typeof lightMode]: string };