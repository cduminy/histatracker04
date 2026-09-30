import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Button from "@/components/Button";
import Card from "@/components/Card";
import ScreenFrame from "@/components/ScreenFrame";
import Section from "@/components/Section";
import { useInsights } from "@/hooks/useInsights";
import { useLogs } from "@/hooks/useLogs";
import { useProducts } from "@/hooks/useProducts";
import { useTriggers } from "@/hooks/useTriggers";
import { calculateHistamineScore, getScoreLabel } from "@/services/histamine";
import { recommendBasedOnLogs, recommendBasedOnTriggers } from "@/services/recommendations";
import type { AppColors } from "@/styles/colors";
import { useAppColors } from "@/hooks/useAppColors";
import { formatLogDate } from "@/utils/dates";
import { typography } from "@/styles/typography";

export default function HomeScreen() {
  const colors = useAppColors();
  const styles = createStyles(colors);
  const { logs } = useLogs();
  const { triggers } = useTriggers();
  const { insights, summary } = useInsights();
  const { products } = useProducts();
  const score = calculateHistamineScore(logs);
  const recommendations = [
    ...recommendBasedOnTriggers(triggers, logs, products),
    ...recommendBasedOnLogs(logs, products),
  ].slice(0, 2);
  const latest = logs.slice(0, 2);

  return (
    <ScreenFrame eyebrow="Your daily overview" title="Notice your patterns." subtitle="Track. Balance. Thrive. A calm place to connect symptoms, meals, and context over time.">
      <Card style={styles.summary}>
        <View style={styles.scoreBlock}>
          <Text style={styles.score}>{score}</Text>
          <Text style={styles.scoreCaption}>7 DAY{ "\n" }LOAD</Text>
        </View>
        <View style={styles.summaryText}>
          <Text style={styles.summaryTitle}>{getScoreLabel(score)}</Text>
          <Text style={styles.summaryBody}>A personal tracking index from your recent entries, not a clinical score.</Text>
        </View>
      </Card>

      <View style={styles.metrics}>
        <Card style={styles.metric}>
          <Text style={styles.metricNumber}>{logs.length}</Text>
          <Text style={styles.metricLabel}>LOG ENTRIES</Text>
        </Card>
        <Card style={styles.metric}>
          <Text style={styles.metricNumber}>{triggers.filter((trigger) => trigger.enabled).length}</Text>
          <Text style={styles.metricLabel}>TRACKED ITEMS</Text>
        </Card>
      </View>

      <Section title="Daily Summary">
        <Card style={styles.dailySummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Symptom days</Text>
            <Text style={styles.summaryValue}>{summary.symptomDayPercentage.toFixed(0)}%</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Highest severity day</Text>
            <Text style={styles.summaryValue}>{summary.highestSeverityDay ?? "None"}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Top tracked match</Text>
            <Text style={styles.summaryValue}>{summary.mostCorrelatedTrigger ?? "None"}</Text>
          </View>
        </Card>
      </Section>

      <Button onPress={() => router.push("/log")} style={styles.primaryAction}>＋  Add a log entry</Button>

      <Section title="A note for you" aside={`${insights.length} insight${insights.length === 1 ? "" : "s"}`}>
        <Card style={styles.insight}>
          <View style={styles.insightMark}><Text style={styles.insightMarkText}>i</Text></View>
          <View style={styles.insightText}>
            <Text style={styles.summaryTitle}>{insights[0]?.title ?? "Your story starts here"}</Text>
            <Text style={styles.summaryBody}>{insights[0]?.detail ?? "Add a few meals and symptom notes to start seeing your own patterns."}</Text>
          </View>
        </Card>
      </Section>

      <Section title="Recent entries" aside={logs.length ? "View history" : undefined}>
        {latest.length ? latest.map((log) => (
          <Card key={log.id} style={styles.logRow}>
            <View style={styles.logMark} />
            <View style={styles.logCopy}>
              <Text style={styles.summaryTitle}>{log.symptoms.join(", ") || "Food note"}</Text>
              <Text style={styles.summaryBody}>{log.foods.join(", ") || log.reaction || "No food noted"}</Text>
            </View>
            <Text style={styles.logSeverity}>{log.severity}/5</Text>
          </Card>
        )) : <Card><Text style={styles.summaryBody}>No entries yet. Start with how you feel today.</Text></Card>}
        {latest[0] ? <Text style={styles.dateHint}>{formatLogDate(latest[0].timestamp)}</Text> : null}
      </Section>

      {recommendations.length > 0 ? (
        <Section title="Things to review">
          {recommendations.map((item) => (
            <Card key={item.id} style={styles.recommendation}>
              <Text style={styles.summaryTitle}>{item.title}</Text>
              <Text style={styles.summaryBody}>{item.detail}</Text>
            </Card>
          ))}
        </Section>
      ) : null}
    </ScreenFrame>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  summary: { flexDirection: "row", alignItems: "center", gap: 16, marginTop: 24, backgroundColor: colors.deep, borderColor: colors.deep },
  scoreBlock: { width: 76, height: 76, borderRadius: 38, backgroundColor: colors.lime, alignItems: "center", justifyContent: "center" },
  score: { color: colors.greenDark, fontFamily: typography.fontFamily.bold, fontSize: 25, fontWeight: "700" },
  scoreCaption: { color: colors.greenDark, fontFamily: typography.fontFamily.medium, fontSize: 8, lineHeight: 10, fontWeight: "500", textAlign: "center" },
  summaryText: { flex: 1, gap: 5 },
  summaryTitle: { color: colors.ink, fontFamily: typography.fontFamily.bold, fontSize: 14, lineHeight: 19, fontWeight: "700" },
  summaryBody: { color: colors.muted, fontFamily: typography.fontFamily.regular, fontSize: 12, lineHeight: 18 },
  metrics: { flexDirection: "row", gap: 10, marginTop: 10 },
  metric: { flex: 1, paddingVertical: 14 },
  metricNumber: { color: colors.ink, fontFamily: typography.fontFamily.bold, fontSize: 23, fontWeight: "700" },
  metricLabel: { color: colors.muted, fontFamily: typography.fontFamily.medium, fontSize: 9, fontWeight: "500", marginTop: 3 },
  dailySummary: { gap: 12 },
  summaryRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  summaryLabel: { flex: 1, color: colors.muted, fontFamily: typography.fontFamily.regular, fontSize: 12, lineHeight: 18 },
  summaryValue: { maxWidth: "60%", color: colors.ink, fontFamily: typography.fontFamily.medium, fontSize: 12, lineHeight: 18, fontWeight: "500", textAlign: "right" },
  primaryAction: { marginTop: 14 },
  insight: { flexDirection: "row", gap: 12, alignItems: "flex-start", backgroundColor: colors.softGreen, borderColor: colors.softGreen },
  insightMark: { width: 28, height: 28, alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: colors.lime },
  insightMarkText: { color: colors.deep, fontFamily: typography.fontFamily.bold, fontWeight: "700" },
  insightText: { flex: 1, gap: 5 },
  logRow: { flexDirection: "row", gap: 12, alignItems: "center", paddingVertical: 14 },
  logMark: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.coral },
  logCopy: { flex: 1, gap: 3 },
  logSeverity: { color: colors.green, fontFamily: typography.fontFamily.medium, fontWeight: "500", fontSize: 12 },
  dateHint: { color: colors.muted, fontFamily: typography.fontFamily.regular, fontSize: 11 },
  recommendation: { gap: 6, marginBottom: 8 },
  });
}