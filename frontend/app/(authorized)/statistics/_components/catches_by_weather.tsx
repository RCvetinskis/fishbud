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
import { CatchesStatistics } from "@/services/statistics-service";

type Props = {
  data: CatchesStatistics["catches_by_weather"];
};

const chartConfig = {
  catches: {
    label: "Catches",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const CatchesByWeather = ({ data }: Props) => {
  const weatherStats = data
    .map((item) => ({
      weather: `${item.temperature ?? "Unknown"}°C | ${
        item.wind_direction ?? "Unknown"
      } | ${item.pressure != null ? `${item.pressure} hPa` : "Unknown"}`,
      temperature: item.temperature,
      windDirection: item.wind_direction,
      pressure: item.pressure,
      catches: item.count,
    }))
    .sort((a, b) => b.catches - a.catches);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Catches by weather</CardTitle>
        <CardDescription>
          Top 10 weather conditions by catch count.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {weatherStats.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={weatherStats}
              layout="vertical"
              margin={{ top: 8, right: 16, bottom: 8, left: 8 }}
            >
              <CartesianGrid horizontal={false} />

              <XAxis
                type="number"
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                type="category"
                dataKey="weather"
                tickLine={false}
                axisLine={false}
                width={190}
                tick={{ fontSize: 11 }}
              />

              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, _name, item) => (
                      <div className="flex flex-col gap-1">
                        <span>{value} catches</span>
                        <span>
                          Temperature: {item.payload.temperature ?? "Unknown"}°C
                        </span>
                        <span>
                          Wind: {item.payload.windDirection ?? "Unknown"}
                        </span>
                        <span>
                          Pressure:{" "}
                          {item.payload.pressure != null
                            ? `${item.payload.pressure} hPa`
                            : "Unknown"}
                        </span>
                      </div>
                    )}
                  />
                }
              />

              <Bar
                dataKey="catches"
                name="Catches"
                fill="var(--color-catches)"
                radius={[0, 4, 4, 0]}
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
