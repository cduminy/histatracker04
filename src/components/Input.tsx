import { useState } from "react";
import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";
import type { AppColors } from "@/styles/colors";
import { useAppColors } from "@/hooks/useAppColors";
import { typography } from "@/styles/typography";

interface InputProps extends TextInputProps {
  label: string;
  helperText?: string;
  error?: string;
}

export default function Input({ label, helperText, error, style, onFocus, onBlur, editable = true, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);
  const colors = useAppColors();
  const styles = createStyles(colors, focused, Boolean(error), !editable);

  function handleFocus(event: Parameters<NonNullable<TextInputProps["onFocus"]>>[0]) {
    setFocused(true);
    onFocus?.(event);
  }

  function handleBlur(event: Parameters<NonNullable<TextInputProps["onBlur"]>>[0]) {
    setFocused(false);
    onBlur?.(event);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        editable={editable}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={[styles.input, style]}
        {...props}
      />
      {error || helperText ? <Text style={error ? styles.error : styles.helper}>{error ?? helperText}</Text> : null}
    </View>
  );
}

function createStyles(colors: AppColors, focused: boolean, hasError: boolean, disabled: boolean) {
  return StyleSheet.create({
    container: { gap: 7 },
    label: { color: colors.ink, fontFamily: typography.fontFamily.medium, fontSize: 13, fontWeight: "500" },
    input: { minHeight: 48, paddingHorizontal: 16, paddingVertical: 12, color: colors.ink, backgroundColor: colors.surface, borderWidth: focused ? 2 : 1, borderColor: hasError ? colors.error : focused ? colors.green : colors.line, borderRadius: 10, fontFamily: typography.fontFamily.regular, fontSize: 15, opacity: disabled ? 0.6 : 1 },
    helper: { color: colors.muted, fontFamily: typography.fontFamily.regular, fontSize: 12, lineHeight: 16 },
    error: { color: colors.error, fontFamily: typography.fontFamily.medium, fontSize: 12, lineHeight: 16 },
  });
}