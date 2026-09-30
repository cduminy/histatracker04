import { useLogStore } from "@/state/useLogStore";

export function useLogs() {
  const logs = useLogStore((state) => state.logs);
  const addLog = useLogStore((state) => state.addLog);
  const updateLog = useLogStore((state) => state.updateLog);
  const deleteLog = useLogStore((state) => state.deleteLog);
  const removeLog = useLogStore((state) => state.removeLog);
  const clearLogs = useLogStore((state) => state.clearLogs);
  return { logs, addLog, updateLog, deleteLog, removeLog, clearLogs };
}