"use client";

import { CloudSun, Fish, MapPin, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { periods } from "@/lib/constants";
import { useStatisticsStore } from "@/stores/statistics-store";
import { LakeCatchStatistics } from "@/services/statistics-service";

type Period = "7d" | "30d" | "90d" | "all";

type CatchRecord = {
  id: number;
  lake: string;
  fish: string;
  date: string;
  weather: string;
  temperature: number;
  count: number;
};

type Props = {
  totalCatches: number;
  topLake: LakeCatchStatistics["data"]["top_lake"];
  topWeather: LakeCatchStatistics["data"]["top_weather"];
  averageTemperature: string | null;
};

const TopStats = ({
  totalCatches,
  topLake,
  topWeather,
  averageTemperature,
}: Props) => {
  const { period } = useStatisticsStore();
  const formatPeriod = periods.find((item) => item.value === period)?.label;
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm text-muted-foreground">Total catches</p>
            <p className="mt-1 text-2xl font-bold">{totalCatches}</p>
            <p className="text-xs text-muted-foreground">{formatPeriod}</p>
          </div>
          <Fish className="h-5 w-5 text-muted-foreground" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Top lake</p>
            <p className="mt-1 truncate text-lg font-bold">
              {topLake?.lake ?? "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              <span className="mt-1 truncate text-lg font-bold">
                {topLake?.lake ?? "—"}
              </span>
            </p>
          </div>
          <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm text-muted-foreground">Top weather</p>
            <p className="mt-1 text-lg font-bold">
              {topWeather ? `${topWeather.temperature ?? "—"}°C` : "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              <span className="text-xs text-muted-foreground">
                {topWeather
                  ? `${topWeather.count} matching records`
                  : "No data"}
              </span>
            </p>
          </div>
          <CloudSun className="h-5 w-5 text-muted-foreground" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm text-muted-foreground">Avg. temperature</p>
            <p className="mt-1 text-2xl font-bold">
              {averageTemperature == null
                ? "—"
                : `${Number(averageTemperature).toFixed(1)}°C`}
            </p>
            <p className="text-xs text-muted-foreground">
              Across recorded entries
            </p>
          </div>
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
        </CardContent>
      </Card>
    </div>
  );
};

export default TopStats;
