import { cn } from "@/lib/utils";
import { TWeather } from "@/types";
import { Compass, Gauge, Thermometer, Waves, Wind } from "lucide-react";

type Props = {
  weather: TWeather;
  layoutClassName?: string;
};

const WeatherCard = ({ weather, layoutClassName }: Props) => {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
      <div className="mb-2.5 flex items-center gap-2">
        <Waves className="size-4 text-emerald-600 dark:text-emerald-400" />
        <span className="text-xs font-semibold">Weather conditions</span>
      </div>

      <div className={cn("grid grid-cols-2 gap-x-3 gap-y-3", layoutClassName)}>
        {weather.temperature != null && (
          <div className="flex items-center gap-2">
            <Thermometer className="size-4 shrink-0 text-orange-500" />
            <div>
              <p className="text-[10px] text-muted-foreground">Temperature</p>
              <p className="text-sm font-semibold">{weather.temperature}°C</p>
            </div>
          </div>
        )}

        {weather.wind_speed != null && (
          <div className="flex items-center gap-2">
            <Wind className="size-4 shrink-0 text-sky-600 dark:text-sky-400" />
            <div>
              <p className="text-[10px] text-muted-foreground">Wind speed</p>
              <p className="text-sm font-semibold">{weather.wind_speed} km/h</p>
            </div>
          </div>
        )}

        {weather.wind_direction != null && (
          <div className="flex items-center gap-2">
            <Compass className="size-4 shrink-0 text-teal-600 dark:text-teal-400" />
            <div>
              <p className="text-[10px] text-muted-foreground">
                Wind direction
              </p>
              <p className="text-sm font-semibold">{weather.wind_direction}°</p>
            </div>
          </div>
        )}

        {weather.pressure != null && (
          <div className="flex items-center gap-2">
            <Gauge className="size-4 shrink-0 text-violet-600 dark:text-violet-400" />
            <div>
              <p className="text-[10px] text-muted-foreground">Pressure</p>
              <p className="text-sm font-semibold">{weather.pressure} hPa</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;
