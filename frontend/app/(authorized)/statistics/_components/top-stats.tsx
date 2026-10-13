"use client";

import { Fish, MapPin, Trophy } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { periods } from "@/lib/constants";
import { useStatisticsStore } from "@/stores/statistics-store";
import { CatchesStatistics } from "@/services/statistics-service";

type Props = {
  totalCatches: number;
  topLake: CatchesStatistics["top_lake"];
  topFish: CatchesStatistics["top_fish"];
  topAngler: CatchesStatistics["top_angler"];
};

const TopStats = ({ totalCatches, topLake, topFish, topAngler }: Props) => {
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
              {topLake ? `${topLake.count} catches` : "No catches yet"}
            </p>
          </div>
          <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Top fish</p>
            <p className="mt-1 truncate text-lg font-bold">
              {topFish?.fish_name ?? "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              {topFish ? `${topFish.count} catches` : "No catches yet"}
            </p>
          </div>
          <Fish className="h-5 w-5 shrink-0 text-muted-foreground" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Top angler</p>
            <p className="mt-1 truncate text-lg font-bold">
              {topAngler?.username ?? "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              {topAngler ? `${topAngler.count} catches` : "No catches yet"}
            </p>
          </div>
          <Trophy className="h-5 w-5 shrink-0 text-muted-foreground" />
        </CardContent>
      </Card>
    </div>
  );
};

export default TopStats;
