import type { ReactNode } from "react";
import { Link } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { AppColors } from "@/styles/colors";
import { useAppColors } from "@/hooks/useAppColors";
import { spacing } from "@/styles/spacing";
import { typography } from "@/styles/typography";

interface ScreenFrameProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function ScreenFrame({ eyebrow, title, subtitle, children }: ScreenFrameProps) {
  const colors = useAppColors();
  const styles = createStyles(colors);
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.topline}>
            <View style={styles.brandGroup}>
              <Image source={require("../../assets/images/HistaTracker Logo.png")} style={styles.logo} resizeMode="contain" accessibilityLabel="HistaTracker logo" />
            </View>
            <Link href="/settings" style={styles.settings}>SETTINGS</Link>
          </View>
          <Text style={styles.eyebrow}>{eyebrow.toUpperCase()}</Text>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          {children}
          <Text style={styles.disclaimer}>Personal tracking only. Not medical advice.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    scroll: { flexGrow: 1, alignItems: "center" },
    content: { width: "100%", maxWidth: 560, paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
    topline: { minHeight: 125, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.xs, marginBottom: spacing.md },
    brandGroup: { flex: 1, flexDirection: "row", alignItems: "center" },
    logo: { width: 172, height: 115 },
    settings: { color: colors.green, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs, minHeight: 44, textAlignVertical: "center", paddingHorizontal: spacing.xs },
    eyebrow: { color: colors.freshGreen, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs, marginBottom: spacing.xxs },
    title: { color: colors.ink, ...typography.title },
    subtitle: { maxWidth: 440, color: colors.muted, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, lineHeight: typography.lineHeight.sm, marginTop: spacing.xs },
    disclaimer: { color: colors.muted, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs, lineHeight: typography.lineHeight.xs, textAlign: "center", marginTop: spacing.xl },
  });
}