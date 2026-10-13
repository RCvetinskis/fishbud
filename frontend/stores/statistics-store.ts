import { create } from "zustand";

export type Period = "7d" | "30d" | "90d" | "all";
type StatisticsStore = {
  period: Period;
  setPeriod: (period: Period) => void;
};

export const useStatisticsStore = create<StatisticsStore>()((set) => ({
  period: "7d",
  setPeriod: (period) => set({ period }),
}));

export const getPeriodStart = (period: Period): Date | null => {
  if (period === "all") return null;

  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const start = new Date();
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);

  return start;
};
