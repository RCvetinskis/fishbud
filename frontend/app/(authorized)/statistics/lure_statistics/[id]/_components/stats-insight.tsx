"use client";

import { Fish, Thermometer, TrendingUp, Wind } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TLureStatsInsight } from "@/services/statistics-service";
import { formatNumber, formatRange } from "@/lib/utils";

type Props = {
  data: TLureStatsInsight;
};

const StatsInsight = ({ data }: Props) => {
  const { most_common_fish: fish, most_common_weather: weather } = data;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription>Most caught fish</CardDescription>
          <Fish className="size-4 text-muted-foreground" />
        </CardHeader>

        <CardContent>
          {fish ? (
            <>
              <CardTitle className="text-xl">{fish.name}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatNumber(fish.catches_count)} catches
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No fish statistics available
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription>Typical temperature</CardDescription>
          <Thermometer className="size-4 text-muted-foreground" />
        </CardHeader>

        <CardContent>
          {weather ? (
            <>
              <CardTitle className="text-xl">
                {formatRange(weather.temperature_min, weather.temperature_max)}
                °C
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Pressure:{" "}
                {formatRange(weather.pressure_min, weather.pressure_max)} hPa
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No weather statistics available
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription>Typical wind</CardDescription>
          <Wind className="size-4 text-muted-foreground" />
        </CardHeader>

        <CardContent>
          {weather ? (
            <>
              <CardTitle className="text-xl">
                {weather.wind_direction}
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Most common conditions across{" "}
                {formatNumber(weather.catches_count)} catches
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No wind statistics available
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsInsight;
