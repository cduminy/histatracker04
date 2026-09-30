import type {
  LogEntry,
  ProductBriefing,
  ProductChange,
  Recommendation,
  TrackedTrigger,
} from "@/utils/types";
import { findRepeatedFoodPatterns } from "./triggers";

function normalized(value: string): string {
  return value.trim().toLocaleLowerCase();
}

export function recommendBasedOnTriggers(
  triggers: TrackedTrigger[],
  logs: LogEntry[],
  briefings: ProductBriefing[],
): Recommendation[] {
  const enabled = triggers.filter((trigger) => trigger.enabled);
  if (enabled.length === 0 || briefings.length === 0) return [];
  const productNames = briefings.map((product) => product.productName).join(", ");
  return enabled.map((trigger) => ({
    id: `trigger-${trigger.id}`,
    title: `Keep tracking ${trigger.name}`,
    detail: `${logs.length} log entries are available for comparison. Product briefing catalog (${productNames}) has no verified ingredient data yet, so no product match can be made.`,
    source: "trigger",
  }));
}

export function recommendBasedOnLogs(logs: LogEntry[], briefings: ProductBriefing[]): Recommendation[] {
  if (briefings.length === 0) return [];
  return findRepeatedFoodPatterns(logs)
    .filter((pattern) => pattern.entries >= 2 && pattern.symptomEntries > 0)
    .slice(0, 3)
    .map((pattern) => ({
      id: `log-${normalized(pattern.food)}`,
      title: `Review your ${pattern.food} entries`,
      detail: `You noted symptoms in ${pattern.symptomEntries} of ${pattern.entries} entries. Compare dates and context with your clinician; this does not establish causation. ${briefings.length} product briefings are available, but their ingredient lists are unverified.`,
      source: "log",
    }));
}

export function recommendBasedOnProductChanges(
  change: ProductChange,
  logs: LogEntry[],
  triggers: TrackedTrigger[],
  briefings: ProductBriefing[],
): Recommendation[] {
  const previous = briefings.find((product) => product.productName === change.previousProduct);
  const current = briefings.find((product) => product.productName === change.currentProduct);
  if (!previous || !current) return [];
  const previousIngredients = new Set(previous.ingredients.map(normalized));
  const added = current.ingredients.filter((ingredient) => !previousIngredients.has(normalized(ingredient)));
  const relevantLogs = logs.filter((log) =>
    log.foods.some((food) => added.some((ingredient) => normalized(food).includes(normalized(ingredient)))),
  ).length;
  const enabledTriggers = triggers.filter((trigger) => trigger.enabled).length;
  return [{
    id: `product-change-${normalized(current.productName)}`,
    title: "Review the product change",
    detail: `${added.length} newly listed ingredients and ${relevantLogs} related food log(s) found; ${enabledTriggers} tracked trigger(s) may help organize your notes. Product ingredient data is unverified, so check the official labels before drawing conclusions.`,
    source: "product",
  }];
}