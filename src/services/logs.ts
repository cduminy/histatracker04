import type { LogEntry } from "@/utils/types";

type LogEntryDetails = Partial<Pick<LogEntry, "symptoms" | "reaction" | "timestamp">>;

export function createLogEntry(
  foods: string[],
  severity: number,
  details: LogEntryDetails = {},
): LogEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    foods,
    severity,
    timestamp: details.timestamp ?? new Date().toISOString(),
    symptoms: details.symptoms ?? [],
    reaction: details.reaction ?? "",
  };
}

export function updateLogEntry(entry: LogEntry, updates: Partial<LogEntry>): LogEntry {
  return {
    ...entry,
    ...updates,
    id: entry.id,
    timestamp: entry.timestamp,
  };
}

export function filterLogsByDay(logs: LogEntry[], date: string): LogEntry[] {
  const dateKey = date.slice(0, 10);
  return logs.filter((log) => log.timestamp.slice(0, 10) === dateKey);
}

export function filterLogsByFood(logs: LogEntry[], food: string): LogEntry[] {
  return logs.filter((log) => log.foods.includes(food));
}