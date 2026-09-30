import { useColorScheme } from "react-native";
import { darkColors, legacyColors, type AppColors } from "@/styles/colors";

export function useAppColors(): AppColors {
  return useColorScheme() === "dark" ? darkColors : legacyColors;
}