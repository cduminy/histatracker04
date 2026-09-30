import { create } from "zustand";
import type { TrackedTrigger } from "@/utils/types";

interface TriggerState {
  triggers: TrackedTrigger[];
  addTrigger: (name: string) => void;
  toggleTrigger: (id: string) => void;
  removeTrigger: (id: string) => void;
  clearTriggers: () => void;
}

export const useTriggerStore = create<TriggerState>((set) => ({
  triggers: [],
  addTrigger: (name) => set((state) => {
    const cleanName = name.trim();
    if (!cleanName || state.triggers.some((trigger) => trigger.name.toLowerCase() === cleanName.toLowerCase())) return state;
    return { triggers: [...state.triggers, { id: `${Date.now()}`, name: cleanName, enabled: true }] };
  }),
  toggleTrigger: (id) => set((state) => ({
    triggers: state.triggers.map((trigger) => trigger.id === id ? { ...trigger, enabled: !trigger.enabled } : trigger),
  })),
  removeTrigger: (id) => set((state) => ({ triggers: state.triggers.filter((trigger) => trigger.id !== id) })),
  clearTriggers: () => set({ triggers: [] }),
}));