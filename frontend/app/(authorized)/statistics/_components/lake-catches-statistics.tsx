"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { useStatisticsStore } from "@/stores/statistics-store";
import type { LakeCatchStatistics } from "@/services/statistics-service";

import SelectPeriod from "./select-period";
import TopStats from "./top-stats";
import CatchesByLake from "./catches_by_lake";
import CatchesByWeather from "./catches_by_weather";
import RecentCatchActivity from "./recent-catch-activity";
import BiggestCatches from "./biggest-catches";

type Props = {
  data: LakeCatchStatistics["data"];
};

const getPeriodStart = (period: "7d" | "30d" | "90d" | "all") => {
  if (period === "all") return null;

  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const start = new Date();
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);

  return start;
};

const LakeCatchesStatistics = ({ data }: Props) => {
  const { period } = useStatisticsStore();

  const filteredDates = useMemo(() => {
    const start = getPeriodStart(period);

    return data.catches_by_date.filter(({ date }) => {
      if (!start) return true;

      const [year, month, day] = date.split("-").map(Number);
      const recordDate = new Date(year, month - 1, day);

      return recordDate >= start && recordDate <= new Date();
    });
  }, [data.catches_by_date, period]);

  return (
    <Card className="space-y-4 p-4">
      <SelectPeriod />

      <TopStats
        topLake={data.top_lake}
        totalCatches={data.total_catches}
        topWeather={data.top_weather}
        averageTemperature={data.average_temperature}
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <CatchesByLake data={data.catches_by_lake} />
        <CatchesByWeather data={data.catches_by_weather} />
      </div>
      <BiggestCatches data={data.biggest_catches} />
      <RecentCatchActivity filteredDates={filteredDates} />
    </Card>
  );
};

export default LakeCatchesStatistics;
