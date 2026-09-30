import { create } from "zustand";
import { createLogEntry, updateLogEntry } from "@/services/logs";
import type { LogEntry } from "@/utils/types";

type LogEntryInput = Omit<LogEntry, "id" | "timestamp"> & { timestamp?: string };
type AddLogArguments = [entry: LogEntryInput] | [foods: string[], severity: number];

interface LogState {
  logs: LogEntry[];
  addLog: (...args: AddLogArguments) => void;
  updateLog: (id: string, updates: Partial<LogEntry>) => void;
  deleteLog: (id: string) => void;
  removeLog: (id: string) => void;
  clearLogs: () => void;
}

export const useLogStore = create<LogState>((set) => ({
  logs: [],
  addLog: (...args) => set((state) => {
    if (args.length === 2) {
      const [foods, severity] = args;
      return { logs: [createLogEntry(foods, severity), ...state.logs] };
    }
    const [entry] = args;
    return { logs: [createLogEntry(entry.foods, entry.severity, entry), ...state.logs] };
  }),
  updateLog: (id, updates) => set((state) => ({
    logs: state.logs.map((log) => log.id === id ? updateLogEntry(log, updates) : log),
  })),
  deleteLog: (id) => set((state) => ({ logs: state.logs.filter((log) => log.id !== id) })),
  removeLog: (id) => set((state) => ({ logs: state.logs.filter((log) => log.id !== id) })),
  clearLogs: () => set({ logs: [] }),
}));