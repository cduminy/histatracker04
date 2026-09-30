import { useEffect } from "react";
import {
  buildInsightSummary,
  buildSeverityTrend,
  calculateTriggerCorrelation,
  generateInsights,
  getWeeklySymptomTrend,
} from "@/services/insights";
import { useInsightStore } from "@/state/useInsightStore";
import { useLogStore } from "@/state/useLogStore";
import { useTriggerStore } from "@/state/useTriggerStore";

export function useInsights() {
  const logs = useLogStore((state) => state.logs);
  const triggers = useTriggerStore((state) => state.triggers);
  const insights = useInsightStore((state) => state.insights);
  const setInsights = useInsightStore((state) => state.setInsights);

  useEffect(() => {
    setInsights(generateInsights(logs, triggers));
  }, [logs, triggers, setInsights]);

  const trend = buildSeverityTrend(logs);
  const correlations = calculateTriggerCorrelation(triggers, logs);
  const summary = buildInsightSummary(logs, correlations);

  return { insights, weeklyTrend: getWeeklySymptomTrend(logs), trend, correlations, summary };
}