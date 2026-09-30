import { useEffect, useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import * as Sharing from "expo-sharing";
import { router } from "expo-router";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Input from "@/components/Input";
import ScreenFrame from "@/components/ScreenFrame";
import Section from "@/components/Section";
import { useLogs } from "@/hooks/useLogs";
import { useLogStore } from "@/state/useLogStore";
import { useInsightStore } from "@/state/useInsightStore";
import { useProductStore } from "@/state/useProductStore";
import { useTriggerStore } from "@/state/useTriggerStore";
import type { AppColors } from "@/styles/colors";
import { useAppColors } from "@/hooks/useAppColors";
import { typography } from "@/styles/typography";

const PROFILE_KEYS = ["profile_name", "profile_preferences", "profile_severity"] as const;

export default function SettingsScreen() {
  const colors = useAppColors();
  const styles = createStyles(colors);
  const [name, setName] = useState("");
  const [preferences, setPreferences] = useState("");
  const [severity, setSeverity] = useState(3);
  const [reminders, setReminders] = useState(false);
  const { logs, clearLogs } = useLogs();
  const triggers = useTriggerStore((state) => state.triggers);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const [[, savedName], [, savedPreferences], [, savedSeverity]] = await AsyncStorage.multiGet([...PROFILE_KEYS]);
        if (!isMounted) return;
        if (savedName !== null) setName(savedName);
        if (savedPreferences !== null) setPreferences(savedPreferences);
        if (savedSeverity !== null) {
          const parsedSeverity = Number(savedSeverity);
          if (Number.isFinite(parsedSeverity)) setSeverity(Math.min(5, Math.max(1, parsedSeverity)));
        }
      } catch {
        if (isMounted) Alert.alert("Could not load profile", "Your saved profile could not be read.");
      }
    }

    void loadProfile();
    return () => { isMounted = false; };
  }, []);

  async function saveProfile() {
    try {
      await AsyncStorage.multiSet([
        [PROFILE_KEYS[0], name],
        [PROFILE_KEYS[1], preferences],
        [PROFILE_KEYS[2], severity.toString()],
      ]);
      Alert.alert("Saved", "Your profile has been updated.");
    } catch {
      Alert.alert("Could not save profile", "Please try again.");
    }
  }

  function exportData() {
    Alert.alert("Export data", "Export your profile and current app data as a JSON file?", [
      { text: "Cancel", style: "cancel" },
      { text: "Export", onPress: () => { void createExport(); } },
    ]);
  }

  async function createExport() {
    const exportedAt = new Date().toISOString();
    const filename = `histatracker-export-${Date.now()}.json`;
    const data = {
      exportedAt,
      profile: { name, preferences, severity },
      logs: useLogStore.getState().logs,
      triggers: useTriggerStore.getState().triggers,
      insights: useInsightStore.getState().insights,
      selectedProduct: useProductStore.getState().selectedProduct,
    };

    try {
      const content = JSON.stringify(data, null, 2);
      if (Platform.OS === "web") {
        const url = URL.createObjectURL(new Blob([content], { type: "application/json" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
        return;
      }

      const { File, Paths } = await import("expo-file-system");
      const file = new File(Paths.cache, filename);
      file.create({ overwrite: true });
      file.write(content);
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Sharing unavailable", "This device cannot share the export file.");
        return;
      }
      await Sharing.shareAsync(file.uri, { dialogTitle: "Export HistaTracker data", mimeType: "application/json" });
    } catch {
      Alert.alert("Export failed", "Your data could not be exported. Please try again.");
    }
  }

  function resetProfile() {
    Alert.alert("Reset profile", "Reset your name, preferences, and severity scale? Logs will remain.", [
      { text: "Cancel", style: "cancel" },
      { text: "Reset", onPress: () => { void clearProfile(); } },
    ]);
  }

  async function clearProfile() {
    try {
      await AsyncStorage.multiRemove([...PROFILE_KEYS]);
      setName("");
      setPreferences("");
      setSeverity(3);
      Alert.alert("Profile reset", "Your profile has been cleared.");
    } catch {
      Alert.alert("Reset failed", "Your profile could not be cleared. Please try again.");
    }
  }

  function confirmClearAll(fullReset = false) {
    const title = fullReset ? "Full app reset" : "Clear all data";
    const message = fullReset
      ? "This will delete all profile data, logs, triggers, and insights."
      : "This will permanently delete your profile, logs, triggers, and insights.";
    Alert.alert(title, message, [
      { text: "Cancel", style: "cancel" },
      {
        text: fullReset ? "Reset everything" : "Delete all data",
        style: "destructive",
        onPress: () => { void clearAllData(fullReset); },
      },
    ]);
  }

  async function clearAllData(fullReset: boolean) {
    try {
      await AsyncStorage.multiRemove([...PROFILE_KEYS]);
      clearLogs();
      useTriggerStore.getState().clearTriggers();
      useInsightStore.getState().setInsights([]);
      useProductStore.getState().selectProduct(null);
      setName("");
      setPreferences("");
      setSeverity(3);
      setReminders(false);
      Alert.alert("Done", "All profile and tracking data has been deleted.");
      if (fullReset) router.replace("/");
    } catch {
      Alert.alert("Reset failed", "Some data could not be cleared. Please try again.");
    }
  }

  function confirmClearLogs() {
    if (!logs.length) return;
    Alert.alert("Clear all logs?", `This will remove ${logs.length} log entries from this session.`, [
      { text: "Cancel", style: "cancel" },
      { text: "Clear logs", style: "destructive", onPress: clearLogs },
    ]);
  }

  return (
    <ScreenFrame eyebrow="Your preferences" title="Make it yours." subtitle="Keep the tracker comfortable and useful for your routine.">
      <Section title="Profile">
        <Card style={styles.profile}>
          <Input label="Name or nickname" value={name} onChangeText={setName} placeholder="What should we call you?" autoCapitalize="words" />
          <Input label="Preferences" value={preferences} onChangeText={setPreferences} placeholder="Add any preferences" multiline />
          <Text style={styles.label}>Severity scale: 1–5</Text>
          <Slider
            accessibilityLabel="Profile severity scale"
            minimumValue={1}
            maximumValue={5}
            step={1}
            value={severity}
            onValueChange={setSeverity}
            minimumTrackTintColor={colors.green}
            maximumTrackTintColor={colors.line}
            thumbTintColor={colors.green}
            style={styles.slider}
          />
          <Text style={styles.hint}>Current profile severity: {severity}</Text>
          <Button onPress={saveProfile}>Save profile</Button>
        </Card>
      </Section>
      <Section title="Preferences">
        <Card style={styles.preference}>
          <View style={styles.preferenceCopy}><Text style={styles.prefTitle}>Daily reminder</Text><Text style={styles.hint}>A gentle prompt to add a check-in.</Text></View>
          <Pressable accessibilityRole="switch" accessibilityState={{ checked: reminders }} onPress={() => setReminders((enabled) => !enabled)} style={[styles.switch, reminders && styles.switchOn]}>
            <View style={[styles.switchDot, reminders && styles.switchDotOn]} />
          </Pressable>
        </Card>
        <Card style={styles.preference}>
          <View style={styles.preferenceCopy}><Text style={styles.prefTitle}>Health information</Text><Text style={styles.hint}>This app supports personal note-taking; it does not diagnose or treat a condition.</Text></View>
        </Card>
      </Section>
      <Section title="Severity Scale">
        <Card style={styles.infoCard}>
          <Text style={styles.prefTitle}>Severity range: 1–5</Text>
          <Text style={styles.hint}>1 is very mild; 5 is very intense.</Text>
        </Card>
      </Section>
      <Section title="Data & Storage">
        <Card style={styles.dataCard}>
          <View style={styles.infoRow}>
            <Text style={styles.hint}>Current log entries</Text>
            <Text style={styles.infoValue}>{logs.length}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.hint}>Tracked triggers</Text>
            <Text style={styles.infoValue}>{triggers.length}</Text>
          </View>
          <Text style={styles.hint}>Logs and triggers are held in memory for this app session. Profile fields are saved on this device.</Text>
          <Button variant="outline" onPress={exportData}>Export data</Button>
          <Button variant="outline" disabled={!logs.length} onPress={confirmClearLogs}>
            Clear all logs
          </Button>
          <Button variant="outline" onPress={resetProfile}>Reset profile</Button>
          <Button variant="quiet" onPress={() => confirmClearAll()}>Clear all data</Button>
          <Button variant="quiet" onPress={() => confirmClearAll(true)}>Full app reset</Button>
        </Card>
      </Section>
      <Section title="HistaStack product data">
        <Card style={styles.productNote}><Text style={styles.prefTitle}>Briefings need verification</Text><Text style={styles.hint}>The included product files are clearly marked placeholders. Ingredient and health-effect details should be checked against official product labels before relying on them.</Text></Card>
      </Section>
      <Section title="Account and sync">
        <Card style={styles.productNote}><Text style={styles.hint}>Supabase is optional and remains disconnected until EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are configured.</Text></Card>
      </Section>
      <Section title="About">
        <Card style={styles.infoCard}>
          <Text style={styles.prefTitle}>HistaTracker v1</Text>
          <Text style={styles.hint}>First-generation release</Text>
          <Text style={styles.hint}>Data model: foods, symptoms, severity, and notes.</Text>
          <Text style={styles.hint}>Analysis: daily trends and tracked-item matches.</Text>
        </Card>
      </Section>
    </ScreenFrame>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  profile: { gap: 11 },
  label: { color: colors.ink, fontFamily: typography.fontFamily.medium, fontSize: 13, fontWeight: "500" },
  slider: { width: "100%", height: 40 },
  hint: { color: colors.muted, fontFamily: typography.fontFamily.regular, fontSize: 12, lineHeight: 18 },
  preference: { flexDirection: "row", alignItems: "center", gap: 14 },
  preferenceCopy: { flex: 1, gap: 4 },
  infoCard: { gap: 10 },
  dataCard: { gap: 12 },
  infoRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  infoValue: { maxWidth: "60%", color: colors.ink, fontFamily: typography.fontFamily.medium, fontSize: 12, lineHeight: 18, fontWeight: "500", textAlign: "right" },
  prefTitle: { color: colors.ink, fontFamily: typography.fontFamily.bold, fontSize: 14, lineHeight: 20, fontWeight: "700" },
  switch: { width: 42, height: 25, padding: 3, justifyContent: "center", borderRadius: 13, backgroundColor: colors.line },
  switchOn: { backgroundColor: colors.green },
  switchDot: { width: 19, height: 19, borderRadius: 10, backgroundColor: colors.surface },
  switchDotOn: { alignSelf: "flex-end" },
  productNote: { gap: 6 },
  });
}