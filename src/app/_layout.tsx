import { useEffect } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { Inter_400Regular, Inter_500Medium, Inter_700Bold, useFonts } from "@expo-google-fonts/inter";
import type { AppColors } from "@/styles/colors";
import { legacyColors } from "@/styles/colors";
import { useAppColors } from "@/hooks/useAppColors";
import { spacing } from "@/styles/spacing";
import { typography } from "@/styles/typography";

void SplashScreen.preventAutoHideAsync();

export function createHeaderStyles(colors: AppColors) {
  return {
  headerStyle: { backgroundColor: colors.surface },
  headerTitleStyle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.lg,
    color: colors.ink,
  },
  headerShadowVisible: false,
  headerTintColor: colors.green,
  } as const;
}

export const headerStyles = createHeaderStyles(legacyColors);

export default function RootLayout() {
  const colors = useAppColors();
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });
  const styles = createStyles(colors);

  useEffect(() => {
    if (fontsLoaded || fontError) void SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <>
      <StatusBar style={colors.background === legacyColors.background ? "dark" : "light"} />
      <Tabs screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
      }}>
        <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }} />
        <Tabs.Screen name="triggers/index" options={{ title: "Triggers", tabBarIcon: ({ color, size }) => <Ionicons name="flash-outline" size={size} color={color} /> }} />
        <Tabs.Screen name="insights/index" options={{ title: "Insights", tabBarIcon: ({ color, size }) => <Ionicons name="analytics-outline" size={size} color={color} /> }} />
        <Tabs.Screen name="log/index" options={{ title: "Log", tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" size={size} color={color} /> }} />
        <Tabs.Screen name="history/index" options={{ title: "History", tabBarIcon: ({ color, size }) => <Ionicons name="time-outline" size={size} color={color} /> }} />
        <Tabs.Screen name="settings/index" options={{ title: "Settings", tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} /> }} />
      </Tabs>
    </>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    tabBar: {
      height: 60,
      paddingTop: spacing.xxs,
      paddingBottom: spacing.xxs,
      borderTopWidth: 1,
      borderTopColor: colors.line,
      backgroundColor: colors.surface,
    },
    label: {
      fontFamily: typography.fontFamily.medium,
      fontSize: typography.size.sm,
    },
  });
}