import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Input from "@/components/Input";
import ScreenFrame from "@/components/ScreenFrame";
import Section from "@/components/Section";
import { useLogs } from "@/hooks/useLogs";
import { formatLogDate } from "@/utils/dates";
import type { Symptom } from "@/utils/types";
import type { AppColors } from "@/styles/colors";
import { useAppColors } from "@/hooks/useAppColors";
import { radius } from "@/styles/theme";
import { typography } from "@/styles/typography";

const symptoms: Symptom[] = ["Headache", "Flushing", "Congestion", "Itching", "Digestive", "Fatigue", "Other"];

export default function LogScreen() {
  const colors = useAppColors();
  const styles = createStyles(colors);
  const [foodFirstFoods, setFoodFirstFoods] = useState("");
  const [foodFirstSeverity, setFoodFirstSeverity] = useState("1");
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [foodText, setFoodText] = useState("");
  const [reaction, setReaction] = useState("");
  const [severity, setSeverity] = useState(2);
  const { addLog, logs } = useLogs();
  const recentLogs = logs.slice(0, 3);
  const canSave = selectedSymptoms.length > 0 || foodText.trim().length > 0;
  const foodFirstList = foodFirstFoods.split(",").map((food) => food.trim()).filter(Boolean);
  const parsedFoodFirstSeverity = Number(foodFirstSeverity);
  const canSaveFoodFirst = foodFirstList.length > 0
    && Number.isInteger(parsedFoodFirstSeverity)
    && parsedFoodFirstSeverity >= 1
    && parsedFoodFirstSeverity <= 5;

  function saveFoodFirstEntry() {
    if (!canSaveFoodFirst) return;
    addLog(foodFirstList, parsedFoodFirstSeverity);
    setFoodFirstFoods("");
    setFoodFirstSeverity("1");
    Alert.alert("Food log added", "Your entry is in your history.");
  }

  function toggleSymptom(symptom: Symptom) {
    setSelectedSymptoms((current) => current.includes(symptom)
      ? current.filter((item) => item !== symptom)
      : [...current, symptom]);
  }

  function saveEntry() {
    if (!canSave) return;
    addLog({
      foods: foodText.split(",").map((food) => food.trim()).filter(Boolean),
      symptoms: selectedSymptoms,
      severity: selectedSymptoms.length ? severity : 0,
      reaction: reaction.trim(),
    });
    setSelectedSymptoms([]);
    setFoodText("");
    setReaction("");
    setSeverity(2);
    Alert.alert("Entry saved", "Your note is in your history.");
  }

  return (
    <ScreenFrame eyebrow="Quick check-in" title="How are you feeling?" subtitle="Add a symptom, a meal, or both. A rough note is enough.">
      <Section title="Food-first log" aside="No symptom required">
        <View style={styles.foodFirstFields}>
          <Input
            label="Foods, separated by commas"
            value={foodFirstFoods}
            onChangeText={setFoodFirstFoods}
            placeholder="e.g. coffee, cheese"
            autoCapitalize="sentences"
          />
          <Input
            label="Severity, 1 to 5"
            value={foodFirstSeverity}
            onChangeText={setFoodFirstSeverity}
            placeholder="1"
            keyboardType="number-pad"
            maxLength={1}
          />
          <Button onPress={saveFoodFirstEntry} disabled={!canSaveFoodFirst}>
            Add food log
          </Button>
        </View>
      </Section>

      <Section title="Symptoms" aside="Choose any that fit">
        <View style={styles.chips}>
          {symptoms.map((symptom) => {
            const selected = selectedSymptoms.includes(symptom);
            return <Pressable key={symptom} accessibilityRole="checkbox" accessibilityState={{ checked: selected }} onPress={() => toggleSymptom(symptom)} style={[styles.chip, selected && styles.chipSelected]}><Text style={[styles.chipText, selected && styles.chipTextSelected]}>{symptom}</Text></Pressable>;
          })}
        </View>
      </Section>

      {selectedSymptoms.length ? <Section title="Intensity" aside={`${severity} of 5`}>
        <View style={styles.severityRow}>
          {[1, 2, 3, 4, 5].map((value) => (
            <Pressable key={value} accessibilityRole="radio" accessibilityState={{ checked: severity === value }} onPress={() => setSeverity(value)} style={[styles.severityButton, severity === value && styles.severitySelected]}>
              <Text style={[styles.severityNumber, severity === value && styles.severityNumberSelected]}>{value}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.scaleLabels}><Text style={styles.helper}>Mild</Text><Text style={styles.helper}>Strong</Text></View>
      </Section> : null}

      <Section title="Food or drink" aside="Optional">
        <Input label="Separate items with commas" value={foodText} onChangeText={setFoodText} placeholder="e.g. lunch, tea" autoCapitalize="sentences" />
      </Section>
      <Section title="What happened?" aside="Optional">
        <Input label="A little context" value={reaction} onChangeText={setReaction} placeholder="Timing, setting, sleep, anything notable" multiline numberOfLines={4} textAlignVertical="top" style={styles.multiline} />
      </Section>
      <Card style={styles.privacy}><Text style={styles.privacyText}>Your entry stays on this device for this session. Cloud sync is not enabled until Supabase credentials are configured.</Text></Card>
      <Button onPress={saveEntry} disabled={!canSave} style={styles.save}>Save entry</Button>
      <Section title="Recent logs" aside={`${logs.length} total`}>
        {recentLogs.length ? recentLogs.map((log) => (
          <Card key={log.id} style={styles.recentEntry}>
            <Text style={styles.recentDate}>{formatLogDate(log.timestamp)}</Text>
            <Text style={styles.recentText}>Foods: {log.foods.join(", ") || "None noted"}</Text>
            <Text style={styles.recentText}>{log.symptoms.length ? `Intensity: ${log.severity} of 5` : "No symptom intensity recorded"}</Text>
          </Card>
        )) : (
          <Card><Text style={styles.privacyText}>Saved entries will appear here.</Text></Card>
        )}
      </Section>
    </ScreenFrame>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  foodFirstFields: { gap: 12 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { minHeight: 44, justifyContent: "center", paddingHorizontal: 12, paddingVertical: 4, borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill, backgroundColor: colors.surface },
  chipSelected: { backgroundColor: colors.green, borderColor: colors.green },
  chipText: { color: colors.ink, fontFamily: typography.fontFamily.medium, fontSize: 12, fontWeight: "500" },
  chipTextSelected: { color: colors.onGreen },
  severityRow: { flexDirection: "row", gap: 9 },
  severityButton: { flex: 1, aspectRatio: 1, maxHeight: 54, alignItems: "center", justifyContent: "center", borderRadius: 8, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  severitySelected: { backgroundColor: colors.lime, borderColor: colors.lime },
  severityNumber: { color: colors.ink, fontFamily: typography.fontFamily.bold, fontSize: 16, fontWeight: "700" },
  severityNumberSelected: { color: colors.deep },
  scaleLabels: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  helper: { color: colors.muted, fontSize: 11 },
  multiline: { minHeight: 96 },
  privacy: { marginTop: 22, backgroundColor: colors.softGreen, borderColor: colors.softGreen },
  privacyText: { color: colors.greenDark, fontFamily: typography.fontFamily.regular, fontSize: 11, lineHeight: 17 },
  save: { marginTop: 14 },
  recentEntry: { gap: 5 },
  recentDate: { color: colors.muted, fontFamily: typography.fontFamily.regular, fontSize: 11 },
  recentText: { color: colors.ink, fontFamily: typography.fontFamily.regular, fontSize: 12, lineHeight: 18 },
  });
}