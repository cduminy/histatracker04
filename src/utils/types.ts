export type Symptom =
  | "Headache"
  | "Flushing"
  | "Congestion"
  | "Itching"
  | "Digestive"
  | "Fatigue"
  | "Other";

export interface LogEntry {
  id: string;
  timestamp: string;
  foods: string[];
  symptoms: Symptom[];
  severity: number;
  reaction: string;
}

export interface TrackedTrigger {
  id: string;
  name: string;
  enabled: boolean;
}

export interface TriggerEvaluation {
  trigger: TrackedTrigger;
  exposures: number;
  symptomDays: number;
  score: number;
}

export interface Insight {
  id: string;
  title: string;
  detail: string;
  kind: "pattern" | "trend" | "reminder";
}

export interface ProductBriefing {
  productName: string;
  version: string;
  formulation: string;
  ingredients: string[];
  histamineImpact: string;
  daoImpact: string;
  hnmtImpact: string;
  contraindications: string;
  recommendedUsage: string;
  notes: string;
}

export interface ProductChange {
  previousProduct: string;
  currentProduct: string;
}

export interface Recommendation {
  id: string;
  title: string;
  detail: string;
  source: "trigger" | "log" | "product";
}

export interface ChartPoint {
  label: string;
  value: number;
}