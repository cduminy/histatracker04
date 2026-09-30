import type { ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import type { AppColors } from "@/styles/colors";
import { useAppColors } from "@/hooks/useAppColors";
import { spacing } from "@/styles/spacing";
import { radius, shadow } from "@/styles/theme";

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
}

export default function Card({ children, style }: CardProps) {
  const colors = useAppColors();
  const styles = createStyles(colors);
  return <View style={[styles.card, style]}>{children}</View>;
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    card: { padding: spacing.md, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, ...shadow.card },
  });
}