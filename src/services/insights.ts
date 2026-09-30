import { dayKey } from "@/utils/dates";
import type { ChartPoint, Insight, LogEntry, TrackedTrigger } from "@/utils/types";
import { findRepeatedFoodPatterns } from "./triggers";

export interface SeverityTrendPoint {
  date: string;
  avgSeverity: number;
}

export interface TriggerCorrelation {
  triggerId: string;
  name: string;
  correlation: number;
}

export interface InsightSummary {
  symptomDayPercentage: number;
  highestSeverityDay: string | null;
  mostCorrelatedTrigger: string | null;
}

function groupLogsByDay(logs: LogEntry[]): Map<string, LogEntry[]> {
  const grouped = new Map<string, LogEntry[]>();
  for (const log of logs) {
    const date = dayKey(log.timestamp);
    const entries = grouped.get(date) ?? [];
    entries.push(log);
    grouped.set(date, entries);
  }
  return grouped;
}

function compareDayKeys(first: string, second: string): number {
  const [firstYear, firstMonth, firstDay] = first.split("-").map(Number);
  const [secondYear, secondMonth, secondDay] = second.split("-").map(Number);
  return new Date(firstYear, firstMonth, firstDay).getTime()
    - new Date(secondYear, secondMonth, secondDay).getTime();
}

function formatDayKey(value: string): string {
  const [year, month, day] = value.split("-").map(Number);
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase();
}

export function buildSeverityTrend(logs: LogEntry[]): SeverityTrendPoint[] {
  return [...groupLogsByDay(logs).entries()]
    .sort(([first], [second]) => compareDayKeys(first, second))
    .map(([date, entries]) => ({
      date: formatDayKey(date),
      avgSeverity: entries.reduce((sum, log) => sum + log.severity, 0) / entries.length,
    }));
}

export function calculateTriggerCorrelation(
  triggers: TrackedTrigger[],
  logs: LogEntry[],
): TriggerCorrelation[] {
  return triggers.map((trigger) => {
    const matchingLogs = logs.filter((log) =>
      log.foods.some((food) => normalize(food) === normalize(trigger.name)),
    );
    return {
      triggerId: trigger.id,
      name: trigger.name,
      correlation: logs.length ? matchingLogs.length / logs.length : 0,
    };
  });
}

export function buildInsightSummary(
  logs: LogEntry[],
  correlations: TriggerCorrelation[],
): InsightSummary {
  if (logs.length === 0) {
    return { symptomDayPercentage: 0, highestSeverityDay: null, mostCorrelatedTrigger: null };
  }

  const grouped = [...groupLogsByDay(logs).entries()]
    .sort(([first], [second]) => compareDayKeys(first, second));
  const symptomDays = grouped.filter(([, entries]) =>
    entries.some((log) => log.symptoms.length > 0),
  ).length;
  const highestSeverityDay = grouped.reduce<{ date: string; average: number } | null>(
    (highest, [date, entries]) => {
      const average = entries.reduce((sum, log) => sum + log.severity, 0) / entries.length;
      return highest === null || average > highest.average ? { date, average } : highest;
    },
    null,
  );
  const mostCorrelated = correlations.reduce<TriggerCorrelation | null>(
    (highest, current) => current.correlation > (highest?.correlation ?? 0) ? current : highest,
    null,
  );

  return {
    symptomDayPercentage: (symptomDays / grouped.length) * 100,
    highestSeverityDay: highestSeverityDay ? formatDayKey(highestSeverityDay.date) : null,
    mostCorrelatedTrigger: mostCorrelated?.correlation ? mostCorrelated.name : null,
  };
}

export function generateInsights(logs: LogEntry[], triggers: TrackedTrigger[] = []): Insight[] {
  const insights: Insight[] = [];
  const patterns = findRepeatedFoodPatterns(logs);
  const repeated = patterns.find((item) => item.entries >= 2 && item.symptomEntries > 0);

  if (repeated) {
    insights.push({
      id: `food-${repeated.food.toLowerCase()}`,
      title: `${repeated.food} appears in your notes`,
      detail: `Symptoms were logged on ${repeated.symptomEntries} of ${repeated.entries} entries. This is a personal pattern to review, not proof of a cause.`,
      kind: "pattern",
    });
  }

  const activeCount = triggers.filter((trigger) => trigger.enabled).length;
  if (logs.length < 3) {
    insights.push({
      id: "more-entries",
      title: "Build your baseline",
      detail: "A few consistent entries can make your personal trends easier to compare.",
      kind: "reminder",
    });
  } else if (activeCount === 0) {
    insights.push({
      id: "track-trigger",
      title: "Choose something to track",
      detail: "Add a food or context in Triggers to compare it with your own symptom notes.",
      kind: "reminder",
    });
  }
  return insights;
}

export function getWeeklySymptomTrend(logs: LogEntry[], days = 7): ChartPoint[] {
  return Array.from({ length: days }, (_, offset) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - offset));
    const key = dayKey(date.toISOString());
    const daily = logs.filter((log) => dayKey(log.timestamp) === key);
    return {
      label: new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(date),
      value: daily.length ? Math.round(daily.reduce((sum, log) => sum + log.severity, 0) / daily.length) : 0,
    };
  });
}