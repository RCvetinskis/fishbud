import { formatDateTime } from "@/lib/utils";
import { TFishingTripCatch } from "@/types";
import { Scale, Ruler } from "lucide-react";
import WeatherCard from "./weather-card";
import LureCard from "./lure-card";

type Props = {
  catchData: TFishingTripCatch;
};

const SmallCatchCard = ({ catchData }: Props) => {
  return (
    <div className="rounded-lg border border-border/60 space-y-2 p-3 transition-colors hover:bg-muted/20">
      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold">{catchData.fish_name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {catchData.caught_at
              ? formatDateTime(catchData.caught_at)
              : "Catch time not recorded"}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {catchData.weight != null && (
            <span className="flex items-center gap-1">
              <Scale className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              {catchData.weight} kg
            </span>
          )}

          {catchData.length != null && (
            <span className="flex items-center gap-1">
              <Ruler className="size-3.5 text-teal-600 dark:text-teal-400" />
              {catchData.length} cm
            </span>
          )}
        </div>
      </div>
      {/* lure  */}
      {catchData.lure && <LureCard lure={catchData.lure} />}

      {/* weather */}
      {catchData.weather && (
        <WeatherCard
          weather={catchData.weather}
          layoutClassName={"grid-cols-4"}
        />
      )}
    </div>
  );
};

export default SmallCatchCard;
