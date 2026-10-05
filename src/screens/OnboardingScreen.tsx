import Card from "@/components/Card";
import ScreenFrame from "@/components/ScreenFrame";
import { useAppColors } from "@/hooks/useAppColors";
import { radius } from "@/styles/theme";
import { typography } from "@/styles/typography";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

export default function OnboardingScreen() {
  const colors = useAppColors();
  const styles = createStyles(colors);
  const router = useRouter();

  async function start() {
    await AsyncStorage.setItem("seen_onboarding", "true");
    router.replace("/log");
  }

  return (
    <ScreenFrame
      eyebrow="Welcome"
      title="HistaTracker"
      subtitle="Track foods, symptoms, and patterns"
    >
      <Card style={styles.card}>
        <Text style={styles.text}>
          HistaTracker helps you understand how foods and symptoms connect.
        </Text>

        <Text style={styles.text}>
          Log meals, symptoms, intensity, and notes. View insights, trends, and
          correlations over time.
        </Text>

        <Text style={styles.text}>
          This is an educational tool designed to help you observe patterns in
          your daily life.
        </Text>
      </Card>

      <Pressable style={styles.button} onPress={start}>
        <Text style={styles.buttonText}>Get started</Text>
      </Pressable>
    </ScreenFrame>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    card: {
      gap: 12,
      paddingVertical: 10,
    },
    text: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 14,
      color: colors.ink,
      lineHeight: 20,
    },
    button: {
      marginTop: 20,
      backgroundColor: colors.blue,
      padding: 14,
      borderRadius: radius.pill,
      alignItems: "center",
    },
    buttonText: {
      color: colors.white,
      fontFamily: typography.fontFamily.medium,
      fontSize: 15,
    },
  });
}
