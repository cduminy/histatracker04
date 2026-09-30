import { create } from "zustand";
import type { Insight } from "@/utils/types";

interface InsightState {
  insights: Insight[];
  setInsights: (insights: Insight[]) => void;
}

export const useInsightStore = create<InsightState>((set) => ({
  insights: [],
  setInsights: (insights) => set({ insights }),
}));