import { StyleSheet, Text, View } from "react-native";
import Card from "@/components/Card";
import Chart from "@/components/Chart";
import ScreenFrame from "@/components/ScreenFrame";
import Section from "@/components/Section";
import { useInsights } from "@/hooks/useInsights";
import { useLogs } from "@/hooks/useLogs";
import { useProducts } from "@/hooks/useProducts";
import { useTriggers } from "@/hooks/useTriggers";
import { recommendBasedOnLogs, recommendBasedOnTriggers } from "@/services/recommendations";
import type { AppColors } from "@/styles/colors";
import { useAppColors } from "@/hooks/useAppColors";
import { typography } from "@/styles/typography";

export default function InsightScreen() {
  const colors = useAppColors();
  const styles = createStyles(colors);
  const { logs } = useLogs();
  const { triggers } = useTriggers();
  const { insights, trend, correlations, summary } = useInsights();
  const { products } = useProducts();
  const severityTrend = trend.slice(-7).map((point) => ({
    label: point.date.slice(5),
    value: point.avgSeverity,
  }));
  const recommendations = [
    ...recommendBasedOnTriggers(triggers, logs, products),
    ...recommendBasedOnLogs(logs, products),
  ];

  return (
    <ScreenFrame eyebrow="Your data, gently" title="Patterns over time." subtitle="A simple view of what you have recorded. Empty days are left empty, not filled in.">
      <Section title="Severity Trend" aside="Latest logged dates · 0 to 5">
        {severityTrend.length ? (
          <Card><Chart data={severityTrend} accessibilityLabel="Average severity across the seven most recent logged dates" /></Card>
        ) : (
          <Card><Text style={styles.detail}>Severity trends will appear after you record a log.</Text></Card>
        )}
      </Section>
      <Section title="At a glance">
        {logs.length ? (
          <View style={styles.summaryGrid}>
            <Card style={styles.summaryMetric}>
              <Text style={styles.summaryLabel}>Days with symptoms</Text>
              <Text style={styles.summaryValue}>{summary.symptomDayPercentage.toFixed(0)}%</Text>
            </Card>
            <Card style={styles.summaryMetric}>
              <Text style={styles.summaryLabel}>Highest severity day</Text>
              <Text style={styles.summaryValue}>{summary.highestSeverityDay ?? "—"}</Text>
            </Card>
            <Card style={styles.summaryMetric}>
              <Text style={styles.summaryLabel}>Top tracked match</Text>
              <Text style={styles.summaryValue}>{summary.mostCorrelatedTrigger ?? "No match"}</Text>
            </Card>
          </View>
        ) : (
          <Card><Text style={styles.detail}>Your summary will appear after you record a log.</Text></Card>
        )}
      </Section>
      <Section title="Tracked-item log share" aside="Matching food entries">
        {!triggers.length ? (
          <Card><Text style={styles.detail}>Add a tracked item to compare it with your food logs.</Text></Card>
        ) : !logs.length ? (
          <Card><Text style={styles.detail}>Log entries are needed before tracked-item matches can be calculated.</Text></Card>
        ) : correlations.map((item) => (
          <Card key={item.triggerId} style={styles.correlationRow}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.correlationValue}>{(item.correlation * 100).toFixed(0)}% of logs</Text>
          </Card>
        ))}
      </Section>
      <Section title="What your notes suggest">
        {insights.map((insight) => (
          <Card key={insight.id} style={styles.insightCard}>
            <View style={styles.insightRule} />
            <View style={styles.insightCopy}>
              <Text style={styles.title}>{insight.title}</Text>
              <Text style={styles.detail}>{insight.detail}</Text>
            </View>
          </Card>
        ))}
      </Section>
      <Section title="Review prompts" aside="Based on your entries">
        {recommendations.length ? recommendations.map((item) => (
          <Card key={item.id} style={styles.prompt}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.detail}>{item.detail}</Text>
          </Card>
        )) : <Card><Text style={styles.detail}>Your notes will appear here as gentle prompts when there is a repeated pattern to review.</Text></Card>}
      </Section>
      <Text style={styles.disclaimer}>Patterns are descriptive only. They cannot identify a cause or replace medical advice.</Text>
    </ScreenFrame>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  summaryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  summaryMetric: { flexBasis: "46%", flexGrow: 1, minHeight: 92, justifyContent: "space-between", padding: 12 },
  summaryLabel: { color: colors.muted, fontFamily: typography.fontFamily.regular, fontSize: 11, lineHeight: 15 },
  summaryValue: { color: colors.ink, fontFamily: typography.fontFamily.bold, fontSize: 16, lineHeight: 22, fontWeight: "700" },
  correlationRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  correlationValue: { color: colors.greenDark, fontFamily: typography.fontFamily.medium, fontSize: 12, fontWeight: "500" },
  insightCard: { flexDirection: "row", gap: 13, paddingVertical: 14 },
  insightRule: { width: 4, borderRadius: 2, backgroundColor: colors.coral },
  insightCopy: { flex: 1, gap: 5 },
  title: { color: colors.ink, fontFamily: typography.fontFamily.bold, fontSize: 14, lineHeight: 20, fontWeight: "700" },
  detail: { color: colors.muted, fontFamily: typography.fontFamily.regular, fontSize: 12, lineHeight: 18 },
  prompt: { gap: 5 },
  disclaimer: { marginTop: 20, color: colors.warning, fontFamily: typography.fontFamily.regular, fontSize: 11, lineHeight: 16 },
  });
}