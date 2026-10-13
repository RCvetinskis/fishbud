"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { getPeriodStart, useStatisticsStore } from "@/stores/statistics-store";
import type { CatchesStatistics } from "@/services/statistics-service";

import SelectPeriod from "./select-period";
import TopStats from "./top-stats";
import CatchesByLake from "./catches_by_lake";
import CatchesByWeather from "./catches_by_weather";
import RecentCatchActivity from "./recent-catch-activity";

type Props = {
  data: CatchesStatistics;
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
        topFish={data.top_fish}
        topLake={data.top_lake}
        totalCatches={data.total_catches}
        topAngler={data.top_angler}
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <CatchesByLake data={data.catches_by_lake} />
        <CatchesByWeather data={data.catches_by_weather} />
      </div>

      <RecentCatchActivity filteredDates={filteredDates} />
    </Card>
  );
};

export default LakeCatchesStatistics;
