import type { LogEntry, TrackedTrigger, TriggerEvaluation } from "@/utils/types";

export interface TriggerAnalysis {
  triggerId: string;
  name: string;
  frequency: number;
  avgSeverity: number;
  recentSeverity: number;
  trend: "rising" | "falling" | "stable";
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase();
}

export function analyzeTriggers(triggers: TrackedTrigger[], logs: LogEntry[]): TriggerAnalysis[] {
  return triggers.map((trigger) => {
    const relatedLogs = logs
      .filter((log) => log.foods.some((food) => normalize(food) === normalize(trigger.name)))
      .sort((first, second) => first.timestamp.localeCompare(second.timestamp));
    const frequency = relatedLogs.length;
    const avgSeverity = frequency === 0
      ? 0
      : relatedLogs.reduce((sum, log) => sum + log.severity, 0) / frequency;
    const recentSeverity = frequency === 0 ? 0 : relatedLogs[frequency - 1].severity;

    let trend: TriggerAnalysis["trend"] = "stable";
    if (frequency >= 2) {
      const firstSeverity = relatedLogs[0].severity;
      if (recentSeverity > firstSeverity) trend = "rising";
      else if (recentSeverity < firstSeverity) trend = "falling";
    }

    return { triggerId: trigger.id, name: trigger.name, frequency, avgSeverity, recentSeverity, trend };
  });
}

export function evaluateTriggers(logs: LogEntry[], triggers: TrackedTrigger[]): TriggerEvaluation[] {
  return triggers.map((trigger) => {
    const matchedLogs = logs.filter((log) =>
      log.foods.some((food) => normalize(food) === normalize(trigger.name)),
    );
    const symptomDays = new Set(
      matchedLogs.filter((log) => log.symptoms.length > 0).map((log) => log.timestamp.slice(0, 10)),
    ).size;
    const score = matchedLogs.length === 0 ? 0 : Math.round((symptomDays / matchedLogs.length) * 100);
    return { trigger, exposures: matchedLogs.length, symptomDays, score };
  });
}

export function findRepeatedFoodPatterns(logs: LogEntry[]): { food: string; entries: number; symptomEntries: number }[] {
  const counts = new Map<string, { food: string; entries: number; symptomEntries: number }>();
  for (const log of logs) {
    for (const food of log.foods) {
      const key = normalize(food);
      const item = counts.get(key) ?? { food, entries: 0, symptomEntries: 0 };
      item.entries += 1;
      if (log.symptoms.length > 0) item.symptomEntries += 1;
      counts.set(key, item);
    }
  }
  return [...counts.values()].sort((a, b) => b.entries - a.entries);
}