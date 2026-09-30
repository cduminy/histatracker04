import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { AppColors } from "@/styles/colors";
import { useAppColors } from "@/hooks/useAppColors";
import { spacing } from "@/styles/spacing";
import { typography } from "@/styles/typography";

interface SectionProps {
  title: string;
  aside?: string;
  children: ReactNode;
}

export default function Section({ title, aside, children }: SectionProps) {
  const colors = useAppColors();
  const styles = createStyles(colors);
  return (
    <View style={styles.section}>
      <View style={styles.headingRow}>
        <Text style={styles.heading}>{title}</Text>
        {aside ? <Text style={styles.aside}>{aside}</Text> : null}
      </View>
      {children}
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    section: { gap: spacing.md, marginTop: spacing.lg },
    headingRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    heading: { color: colors.green, ...typography.heading },
    aside: { color: colors.muted, ...typography.small },
  });
}