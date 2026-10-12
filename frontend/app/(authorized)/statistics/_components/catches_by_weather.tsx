"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { LakeCatchStatistics } from "@/services/statistics-service";

type Props = {
  data: LakeCatchStatistics["data"]["catches_by_weather"];
};

const chartConfig = {
  catches: {
    label: "Catches",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const CatchesByWeather = ({ data }: Props) => {
  const weatherStats = data.map((item) => ({
    weather: `${item.temperature ?? "Unknown"}°C · ${
      item.wind_direction ?? "Unknown"
    }°`,
    catches: item.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Catches by weather</CardTitle>
        <CardDescription>
          Catch counts grouped by recorded temperature and wind direction.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {weatherStats.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <BarChart
              accessibilityLayer
              data={weatherStats}
              margin={{ top: 8, right: 8, bottom: 8, left: 0 }}
            >
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="weather"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={0}
                tick={{ fontSize: 10 }}
              />

              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                width={32}
              />

              <ChartTooltip content={<ChartTooltipContent />} />

              <Bar
                dataKey="catches"
                name="Catches"
                fill="var(--color-catches)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No weather statistics available.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default CatchesByWeather;
