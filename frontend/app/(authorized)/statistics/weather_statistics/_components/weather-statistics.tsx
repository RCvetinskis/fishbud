import {
  Thermometer,
  Wind,
  Compass,
  Gauge,
  TrendingUp,
  Fish,
  CloudSun,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TWeatherStatistics } from "@/types";

type Props = {
  weatherStatistics: TWeatherStatistics;
};

type WeatherRange = {
  min: number;
  max: number;
  catch_count: number;
};

type WeatherDirection = {
  direction: string;
  catch_count: number;
};

type WeatherEntry = WeatherRange | WeatherDirection;

type WeatherItem = {
  title: string;
  data: WeatherEntry[];
  format: (entry: WeatherEntry) => string;
  icon: typeof Thermometer;
  color: string;
  background: string;
};

const formatWeatherEntry = (entry: WeatherEntry, unit: string): string => {
  if ("direction" in entry) {
    return entry.direction;
  }

  return `${entry.min}–${entry.max}${unit}`;
};

const WeatherStatistics = ({ weatherStatistics }: Props) => {
  const items: WeatherItem[] = [
    {
      title: "Temperature",
      data: weatherStatistics.best_temperatures,
      format: (entry) => formatWeatherEntry(entry, "°C"),
      icon: Thermometer,
      color: "text-orange-500",
      background: "bg-orange-500/10",
    },
    {
      title: "Wind speed",
      data: weatherStatistics.best_wind_speeds,
      format: (entry) => formatWeatherEntry(entry, " km/h"),
      icon: Wind,
      color: "text-sky-500",
      background: "bg-sky-500/10",
    },
    {
      title: "Wind direction",
      data: weatherStatistics.best_wind_directions,
      format: (entry) => formatWeatherEntry(entry, ""),
      icon: Compass,
      color: "text-teal-500",
      background: "bg-teal-500/10",
    },
    {
      title: "Air pressure",
      data: weatherStatistics.best_pressures,
      format: (entry) => formatWeatherEntry(entry, " hPa"),
      icon: Gauge,
      color: "text-violet-500",
      background: "bg-violet-500/10",
    },
  ];

  return (
    <Card className="space-y-4 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CloudSun className="size-5" />
            <span className="text-sm font-medium">Fishing insights</span>
          </div>

          <h2 className="text-xl font-bold tracking-tight">
            Weather fishing conditions
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Weather patterns associated with recorded catches
          </p>
        </div>

        <Badge variant="secondary" className="w-fit gap-1.5">
          <Fish className="size-3.5" />
          {weatherStatistics.total_catches} catches analyzed
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;

          const maxCount = Math.max(
            1,
            ...item.data.map((entry) => entry.catch_count),
          );

          return (
            <Card
              key={item.title}
              className="border-border/60 transition-colors hover:border-emerald-500/30"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </CardTitle>

                <div
                  className={`flex size-9 items-center justify-center rounded-lg ${item.background}`}
                >
                  <Icon className={`size-4 ${item.color}`} />
                </div>
              </CardHeader>

              <CardContent>
                {item.data.length > 0 ? (
                  <div className="space-y-3">
                    {item.data.slice(0, 10).map((entry, index) => (
                      <div key={`${item.title}-${index}`} className="space-y-1">
                        <div className="flex items-center justify-between gap-2 text-sm">
                          <span className="min-w-0 truncate font-medium">
                            <span className="mr-2 text-xs text-muted-foreground">
                              {index + 1}.
                            </span>
                            {item.format(entry)}
                          </span>

                          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                            {entry.catch_count}
                          </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-emerald-500 transition-all"
                            style={{
                              width: `${(entry.catch_count / maxCount) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No data available
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-emerald-500/20 bg-emerald-500/[0.03]">
        <CardContent className="flex items-start gap-3 p-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="size-4" />
          </div>

          <div>
            <p className="text-sm font-semibold">Learn from your catches</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              These rankings show the 10 weather ranges or directions most
              frequently associated with recorded catches. They reflect catch
              frequency, not necessarily fishing success rates.
            </p>
          </div>
        </CardContent>
      </Card>
    </Card>
  );
};

export default WeatherStatistics;
