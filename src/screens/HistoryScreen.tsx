import { Pressable, StyleSheet, Text, View } from "react-native";
import Card from "@/components/Card";
import Chart from "@/components/Chart";
import ScreenFrame from "@/components/ScreenFrame";
import Section from "@/components/Section";
import { useInsights } from "@/hooks/useInsights";
import { useLogs } from "@/hooks/useLogs";
import { dayKey } from "@/utils/dates";
import type { AppColors } from "@/styles/colors";
import { useAppColors } from "@/hooks/useAppColors";
import { typography } from "@/styles/typography";

export default function HistoryScreen() {
  const colors = useAppColors();
  const styles = createStyles(colors);
  const { logs, removeLog } = useLogs();
  const { trend } = useInsights();
  const severityTrend = trend.slice(-7).map((point) => ({
    label: point.date.slice(5),
    value: point.avgSeverity,
  }));
  const groupedLogs = new Map<string, typeof logs>();
  for (const log of logs) {
    const day = dayKey(log.timestamp);
    const entries = groupedLogs.get(day) ?? [];
    entries.push(log);
    groupedLogs.set(day, entries);
  }
  const dailyGroups = [...groupedLogs.entries()]
    .sort((firstGroup, secondGroup) => secondGroup[1][0].timestamp.localeCompare(firstGroup[1][0].timestamp));

  return (
    <ScreenFrame eyebrow="Your timeline" title="The details add up." subtitle="Review what you recorded and how the week felt overall.">
      <Section title="Severity Trend" aside="Latest logged dates · 0 to 5">
        {severityTrend.length ? (
          <Card><Chart data={severityTrend} accessibilityLabel="Average severity across the seven most recent logged dates" /></Card>
        ) : (
          <Card><Text style={styles.detail}>Severity trends will appear after you record a log.</Text></Card>
        )}
      </Section>
      <Section title="Daily Summary" aside={`${logs.length} total logs`}>
        {dailyGroups.length ? dailyGroups.map(([day, entries]) => {
          const averageSeverity = entries.reduce((sum, entry) => sum + entry.severity, 0) / entries.length;
          const dateLabel = new Intl.DateTimeFormat(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          }).format(new Date(entries[0].timestamp));
          return (
            <View key={day} style={styles.dayBlock}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>{dateLabel}</Text>
                <Text style={styles.dayAverage}>Avg {averageSeverity.toFixed(1)}/5</Text>
              </View>
              {entries.map((log) => (
                <Card key={log.id} style={styles.entry}>
                  <View style={styles.entryTop}>
                    <Text style={styles.date}>{new Date(log.timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</Text>
                    <Pressable accessibilityRole="button" accessibilityLabel="Delete entry" onPress={() => removeLog(log.id)} hitSlop={10}><Text style={styles.delete}>Remove</Text></Pressable>
                  </View>
                  <Text style={styles.title}>{log.symptoms.length ? log.symptoms.join(" · ") : "Food note"}</Text>
                  {log.foods.length ? <Text style={styles.foods}>{log.foods.join(", ")}</Text> : null}
                  {log.reaction ? <Text style={styles.detail}>{log.reaction}</Text> : null}
                  <Text style={styles.severity}>{log.symptoms.length ? "Intensity" : "Severity"} {log.severity} of 5</Text>
                </Card>
              ))}
            </View>
          );
        }) : <Card style={styles.empty}><Text style={styles.title}>Nothing in your timeline yet</Text><Text style={styles.detail}>Saved check-ins will appear here in date order.</Text></Card>}
      </Section>
    </ScreenFrame>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  dayBlock: { gap: 8, marginBottom: 16, paddingBottom: 13, borderBottomWidth: 1, borderColor: colors.line },
  dayHeader: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: 10 },
  dayTitle: { flex: 1, color: colors.ink, fontFamily: typography.fontFamily.bold, fontSize: 15, lineHeight: 21, fontWeight: "700" },
  dayAverage: { color: colors.greenDark, fontFamily: typography.fontFamily.medium, fontSize: 12, fontWeight: "500" },
  entry: { gap: 7, paddingVertical: 15 },
  entryTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  date: { color: colors.muted, fontFamily: typography.fontFamily.regular, fontSize: 11 },
  delete: { color: colors.warning, fontFamily: typography.fontFamily.medium, fontSize: 11, fontWeight: "500", padding: 4 },
  title: { color: colors.ink, fontFamily: typography.fontFamily.bold, fontSize: 14, lineHeight: 20, fontWeight: "700" },
  foods: { color: colors.green, fontFamily: typography.fontFamily.medium, fontSize: 12, lineHeight: 18, fontWeight: "500" },
  detail: { color: colors.muted, fontFamily: typography.fontFamily.regular, fontSize: 12, lineHeight: 18 },
  severity: { alignSelf: "flex-start", color: colors.greenDark, fontFamily: typography.fontFamily.medium, fontSize: 10, fontWeight: "500", paddingHorizontal: 8, paddingVertical: 5, overflow: "hidden", borderRadius: 5, backgroundColor: colors.softGreen },
  empty: { gap: 5 },
  });
}