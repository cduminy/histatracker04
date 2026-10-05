import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function IndexRedirect() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function check() {
      const seen = await AsyncStorage.getItem("seen_onboarding");

      if (!seen) {
        router.replace("/onboarding");
      } else {
        router.replace("/log");
      }

      setReady(true);
    }

    check();
  }, []);

  if (!ready) return null;

  return null;
}
