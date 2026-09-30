import { StyleSheet, Text, View } from "react-native";
import type { ChartPoint } from "@/utils/types";
import type { AppColors } from "@/styles/colors";
import { useAppColors } from "@/hooks/useAppColors";
import { typography } from "@/styles/typography";

interface ChartProps {
  data: ChartPoint[];
  accessibilityLabel?: string;
}

export default function Chart({ data, accessibilityLabel = "Average symptom severity over the last seven days" }: ChartProps) {
  const colors = useAppColors();
  const styles = createStyles(colors);
  const maximum = Math.max(5, ...data.map((point) => point.value));
  return (
    <View accessibilityLabel={accessibilityLabel} style={styles.chart}>
      {data.map((point) => (
        <View key={point.label} style={styles.column}>
          <Text style={styles.value}>{point.value || ""}</Text>
          <View style={styles.track}>
            <View style={[styles.bar, { height: `${Math.max(5, (point.value / maximum) * 100)}%` }]} />
          </View>
          <Text style={styles.day}>{point.label}</Text>
        </View>
      ))}
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    chart: { height: 156, flexDirection: "row", gap: 8, alignItems: "stretch", paddingTop: 4 },
    column: { flex: 1, alignItems: "center", justifyContent: "flex-end", gap: 7 },
    value: { height: 15, color: colors.muted, fontFamily: typography.fontFamily.regular, fontSize: 10 },
    track: { width: "100%", flex: 1, justifyContent: "flex-end", overflow: "hidden", backgroundColor: colors.background, borderRadius: 5 },
    bar: { width: "100%", minHeight: 3, backgroundColor: colors.green, borderRadius: 5 },
    day: { color: colors.muted, fontFamily: typography.fontFamily.regular, fontSize: 10 },
  });
}