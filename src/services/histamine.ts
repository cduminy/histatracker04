import type { LogEntry } from "@/utils/types";

export function calculateHistamineScore(logs: LogEntry[], days = 7): number {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const recentLogs = logs.filter((log) => new Date(log.timestamp).getTime() >= cutoff);
  if (recentLogs.length === 0) return 0;

  const symptomLoad = recentLogs.reduce(
    (total, log) => total + log.severity * Math.max(log.symptoms.length, 1),
    0,
  );
  return Math.min(100, Math.round((symptomLoad / (recentLogs.length * 5 * 3)) * 100));
}

export function getScoreLabel(score: number): string {
  if (score === 0) return "No recent entries";
  if (score < 35) return "Lighter symptom load";
  if (score < 70) return "Moderate symptom load";
  return "Higher symptom load";
}