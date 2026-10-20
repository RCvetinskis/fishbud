"use client";

import { useMemo, useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { CalendarDays, CloudSun, Fish, MapPin, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CatchesStatistics } from "@/services/statistics-service";

const chartConfig = {
  catches: {
    label: "Catches",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type Props = {
  data: CatchesStatistics["catches_by_lake"];
};
const CatchesByLake = ({ data }: Props) => {
  const lakeStats = data.map((item) => ({
    lake: item.lake,
    catches: item.count,
  }));
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Catches by lake</CardTitle>
        <CardDescription>Top 10 lakes by catch count.</CardDescription>
      </CardHeader>
      <CardContent>
        {lakeStats.length > 0 ? (
          <ChartContainer config={chartConfig} className="w-full">
            <BarChart
              accessibilityLayer
              data={lakeStats}
              margin={{ top: 8, right: 8, bottom: 8, left: 0 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="lake"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11 }}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={48}
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
            No catches recorded for this period.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default CatchesByLake;
