import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Card from "@/components/Card";
import Input from "@/components/Input";
import ScreenFrame from "@/components/ScreenFrame";
import Section from "@/components/Section";
import { useTriggers } from "@/hooks/useTriggers";
import type { AppColors } from "@/styles/colors";
import { useAppColors } from "@/hooks/useAppColors";
import { typography } from "@/styles/typography";

export default function TriggerScreen() {
  const colors = useAppColors();
  const styles = createStyles(colors);
  const [name, setName] = useState("");
  const { analysis, evaluations, addTrigger, toggleTrigger, removeTrigger } = useTriggers();
  const analysisById = new Map(analysis.map((item) => [item.triggerId, item]));

  return (
    <ScreenFrame eyebrow="Personal tracking" title="Follow what stands out." subtitle="Track foods or context you want to compare with your own entries.">
      <Section title="Add an item">
        <View style={styles.addRow}>
          <Input label="Food or context" value={name} onChangeText={setName} onSubmitEditing={() => { addTrigger(name); setName(""); }} placeholder="e.g. a meal, sleep, stress" returnKeyType="done" style={styles.input} />
          <Pressable accessibilityRole="button" accessibilityLabel="Add tracked item" onPress={() => { addTrigger(name); setName(""); }} style={styles.addButton}><Text style={styles.addGlyph}>+</Text></Pressable>
        </View>
      </Section>

      <Section title="Your tracked items" aside={`${evaluations.length} total`}>
        {evaluations.length ? evaluations.map(({ trigger, exposures, symptomDays, score }) => {
          const itemAnalysis = analysisById.get(trigger.id);
          return (
            <Card key={trigger.id} style={styles.triggerCard}>
              <Pressable accessibilityRole="switch" accessibilityState={{ checked: trigger.enabled }} onPress={() => toggleTrigger(trigger.id)} style={[styles.toggle, trigger.enabled && styles.toggleOn]}>
                <View style={[styles.toggleDot, trigger.enabled && styles.toggleDotOn]} />
              </Pressable>
              <View style={styles.triggerCopy}>
                <Text style={styles.triggerName}>{trigger.name}</Text>
                <Text style={styles.detail}>{exposures ? `${symptomDays} symptom log${symptomDays === 1 ? "" : "s"} across ${exposures} matched entr${exposures === 1 ? "y" : "ies"}` : "No matching log entries yet"}</Text>
                {itemAnalysis?.frequency ? (
                  <View style={styles.analysisGrid}>
                    <Text style={styles.analysisDetail}>Frequency: {itemAnalysis.frequency}</Text>
                    <Text style={styles.analysisDetail}>Avg intensity: {itemAnalysis.avgSeverity.toFixed(1)}</Text>
                    <Text style={styles.analysisDetail}>Latest: {itemAnalysis.recentSeverity}</Text>
                    <Text style={styles.analysisDetail}>Trend: {itemAnalysis.trend}</Text>
                  </View>
                ) : <Text style={styles.analysisDetail}>No severity analysis yet</Text>}
              </View>
              <View style={styles.scorePill}><Text style={styles.scoreText}>{exposures ? `${score}%` : "—"}</Text></View>
              <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${trigger.name}`} onPress={() => removeTrigger(trigger.id)} hitSlop={10} style={styles.remove}>
                <Text style={styles.removeText}>×</Text>
              </Pressable>
            </Card>
          );
        }) : (
          <Card style={styles.empty}><Text style={styles.emptyTitle}>Start with a question</Text><Text style={styles.detail}>Add one food or daily-life factor. We only compare exact food names in your notes; patterns need repeated entries.</Text></Card>
        )}
      </Section>
      <Text style={styles.footnote}>The percentage is a simple count of symptom entries among matching food entries. It does not establish a trigger or predict a reaction.</Text>
    </ScreenFrame>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  addRow: { flexDirection: "row", alignItems: "flex-end", gap: 10 },
  input: { flex: 1 },
  addButton: { width: 48, height: 48, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: colors.green },
  addGlyph: { color: colors.onGreen, fontFamily: typography.fontFamily.regular, fontSize: 25, lineHeight: 28, fontWeight: "400" },
  triggerCard: { flexDirection: "row", alignItems: "center", gap: 11, paddingVertical: 13, paddingHorizontal: 13 },
  toggle: { width: 36, height: 21, padding: 3, borderRadius: 12, backgroundColor: colors.line, justifyContent: "center" },
  toggleOn: { backgroundColor: colors.green },
  toggleDot: { width: 15, height: 15, borderRadius: 8, backgroundColor: colors.surface },
  toggleDotOn: { alignSelf: "flex-end" },
  triggerCopy: { flex: 1, gap: 3 },
  triggerName: { color: colors.ink, fontFamily: typography.fontFamily.bold, fontSize: 14, fontWeight: "700" },
  detail: { color: colors.muted, fontFamily: typography.fontFamily.regular, fontSize: 11, lineHeight: 16 },
  analysisGrid: { gap: 3, marginTop: 2 },
  analysisDetail: { color: colors.greenDark, fontFamily: typography.fontFamily.regular, fontSize: 10, lineHeight: 15 },
  scorePill: { minWidth: 37, alignItems: "center", paddingHorizontal: 5, paddingVertical: 6, borderRadius: 6, backgroundColor: colors.softGreen },
  scoreText: { color: colors.greenDark, fontFamily: typography.fontFamily.bold, fontSize: 11, fontWeight: "700" },
  remove: { paddingHorizontal: 2 },
  removeText: { color: colors.muted, fontSize: 22, lineHeight: 22 },
  empty: { gap: 6, backgroundColor: colors.softGreen },
  emptyTitle: { color: colors.ink, fontFamily: typography.fontFamily.bold, fontSize: 15, fontWeight: "700" },
  footnote: { color: colors.muted, fontFamily: typography.fontFamily.regular, fontSize: 11, lineHeight: 17, marginTop: 16 },
  });
}