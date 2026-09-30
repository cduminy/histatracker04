import { useState } from "react";
import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, type ViewStyle } from "react-native";
import type { AppColors } from "@/styles/colors";
import { useAppColors } from "@/hooks/useAppColors";
import { spacing } from "@/styles/spacing";
import { typography } from "@/styles/typography";
import { radius } from "@/styles/theme";

interface ButtonProps {
  children: ReactNode;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "solid" | "outline" | "quiet";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export default function Button({ children, onPress, variant = "primary", disabled = false, loading = false, style }: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const colors = useAppColors();
  const styles = createStyles(colors);
  const variantStyle = variant === "solid" ? styles.primary
    : variant === "outline" ? styles.secondary
      : variant === "quiet" ? styles.ghost
        : styles[variant];
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [
        styles.button,
        variantStyle,
        inactive && styles.disabled,
        (pressed || hovered) && !inactive && styles.pressed,
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={variant === "primary" || variant === "solid" ? colors.onGreen : colors.green} size="small" /> : (
        <Text style={[styles.label, (variant === "primary" || variant === "solid") && styles.primaryLabel]}>{children}</Text>
      )}
    </Pressable>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    button: { minHeight: 46, paddingVertical: spacing.xs, paddingHorizontal: spacing.md, borderRadius: radius.button, alignItems: "center", justifyContent: "center", marginVertical: spacing.xs },
    primary: { backgroundColor: colors.green },
    secondary: { borderWidth: 1, borderColor: colors.green, backgroundColor: colors.surface },
    ghost: { backgroundColor: "transparent", paddingHorizontal: spacing.sm },
    label: { color: colors.green, fontFamily: typography.fontFamily.medium, fontSize: typography.size.md, fontWeight: "500" },
    primaryLabel: { color: colors.onGreen },
    disabled: { opacity: 0.45 },
    pressed: { opacity: 0.75 },
  });
}