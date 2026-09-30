import { useLogStore } from "@/state/useLogStore";
import { useTriggerStore } from "@/state/useTriggerStore";
import { analyzeTriggers, evaluateTriggers } from "@/services/triggers";

export function useTriggers() {
  const triggers = useTriggerStore((state) => state.triggers);
  const logs = useLogStore((state) => state.logs);
  const addTrigger = useTriggerStore((state) => state.addTrigger);
  const toggleTrigger = useTriggerStore((state) => state.toggleTrigger);
  const removeTrigger = useTriggerStore((state) => state.removeTrigger);
  return {
    triggers,
    analysis: analyzeTriggers(triggers, logs),
    evaluations: evaluateTriggers(logs, triggers),
    addTrigger,
    toggleTrigger,
    removeTrigger,
  };
}