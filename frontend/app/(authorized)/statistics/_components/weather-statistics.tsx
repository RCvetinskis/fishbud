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
const WeatherStatistics = async ({ weatherStatistics }: Props) => {
  const items = [
    {
      title: "Temperature",
      value: weatherStatistics.best_temperature
        ? `${weatherStatistics.best_temperature.min}–${weatherStatistics.best_temperature.max}°C`
        : "No data",
      description: weatherStatistics.best_temperature
        ? `${weatherStatistics.best_temperature.catch_count} catches in this range`
        : "No temperature data available",
      icon: Thermometer,
      color: "text-orange-500",
      background: "bg-orange-500/10",
    },
    {
      title: "Wind speed",
      value: weatherStatistics.best_wind_speed
        ? `${weatherStatistics.best_wind_speed.min}–${weatherStatistics.best_wind_speed.max} km/h`
        : "No data",
      description: weatherStatistics.best_wind_speed
        ? `${weatherStatistics.best_wind_speed.catch_count} catches in this range`
        : "No wind data available",
      icon: Wind,
      color: "text-sky-500",
      background: "bg-sky-500/10",
    },
    {
      title: "Wind direction",
      value: weatherStatistics.best_wind_direction?.direction ?? "No data",
      description: weatherStatistics.best_wind_direction
        ? `${weatherStatistics.best_wind_direction.catch_count} catches with this wind`
        : "No wind direction data available",
      icon: Compass,
      color: "text-teal-500",
      background: "bg-teal-500/10",
    },
    {
      title: "Air pressure",
      value: weatherStatistics.best_pressure
        ? `${weatherStatistics.best_pressure.min}–${weatherStatistics.best_pressure.max} hPa`
        : "No data",
      description: weatherStatistics.best_pressure
        ? `${weatherStatistics.best_pressure.catch_count} catches in this range`
        : "No pressure data available",
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
            Best fishing conditions
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

          return (
            <Card
              key={item.title}
              className="border-border/60 transition-colors hover:border-emerald-500/30"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
                <div className="text-2xl font-bold tracking-tight">
                  {item.value}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.description}
                </p>
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
              These weatherStatistics highlight the weather conditions most
              frequently associated with catches recorded in Fishbud.
            </p>
          </div>
        </CardContent>
      </Card>
    </Card>
  );
};

export default WeatherStatistics;
