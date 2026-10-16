"use client";

import {
  CalendarDays,
  Fish,
  UserRound,
  Ruler,
  Weight,
  Waves,
  FishSymbol,
  Thermometer,
  Wind,
  Compass,
  Gauge,
} from "lucide-react";

import { TCatch } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import LureCard from "@/components/lure-card";
import ShowMoreText from "@/components/show-more-text";
import WeatherCard from "@/components/weather-card";
import ImageDialog from "@/components/image-dialog";

type Props = {
  catchData: TCatch;
};

const CatchCard = ({ catchData }: Props) => {
  const hasImage = Boolean(catchData.image_url);
  const hasMeasurements = catchData.weight != null || catchData.length != null;

  return (
    <Card className="group relative flex p-0 h-full flex-col overflow-hidden rounded-xl border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-950/5">
      {/* Photo or decorative header */}
      <div className="relative isolate h-28 overflow-hidden rounded-t-xl sm:h-32 ">
        {hasImage ? (
          <>
            <ImageDialog
              src={catchData.image_url!}
              alt={`Caught ${catchData.fish_name}`}
              fill
            >
              <img
                src={catchData.image_url!}
                alt={`Caught ${catchData.fish_name}`}
                loading="lazy"
                className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </ImageDialog>
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-black/20" />

            <div className="absolute left-3 top-3">
              <Badge className="border border-white/20 bg-black/40 px-2 py-0.5 text-xs text-white shadow-sm backdrop-blur-md hover:bg-black/50">
                <Waves className="mr-1 size-3" />
                Catch #{catchData.id}
              </Badge>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-3.5 text-white">
              <h3 className="truncate text-lg font-bold tracking-tight drop-shadow-sm">
                {catchData.fish_name}
              </h3>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/85">
                <UserRound className="size-3 shrink-0" />
                <span className="truncate">{catchData.caught_by}</span>
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-linear-to-br from-emerald-950 via-emerald-800 to-teal-700" />
            <div className="absolute -right-8 -top-12 size-36 rounded-full border border-white/10" />
            <div className="absolute -right-2 -top-6 size-24 rounded-full border border-white/10" />
            <FishSymbol className="absolute -bottom-4 right-4 size-24 -rotate-12 text-white/8" />

            <div className="relative flex h-full flex-col justify-between p-3.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-100/80">
                  <Waves className="size-3.5" />
                  Fishing log
                </span>
                <Badge className="border border-white/15 bg-white/10 px-2 py-0.5 text-xs text-white hover:bg-white/15">
                  #{catchData.id}
                </Badge>
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-lg font-bold tracking-tight text-white">
                  {catchData.fish_name}
                </h3>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-emerald-50/80">
                  <UserRound className="size-3 shrink-0" />
                  <span className="truncate">{catchData.caught_by}</span>
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 p-3.5">
        {/* Catch measurements */}
        {hasMeasurements && (
          <div className="grid grid-cols-2 gap-2">
            {catchData.weight != null && (
              <div className="rounded-lg border border-border/60 bg-muted/40 p-2.5 transition-colors group-hover:bg-muted/60">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Weight className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-[11px] font-medium">Weight</span>
                </div>
                <p className="mt-1.5 text-xl font-bold tracking-tight">
                  {catchData.weight}
                  <span className="ml-1 text-xs font-medium text-muted-foreground">
                    kg
                  </span>
                </p>
              </div>
            )}

            {catchData.length != null && (
              <div className="rounded-lg border border-border/60 bg-muted/40 p-2.5 transition-colors group-hover:bg-muted/60">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Ruler className="size-3.5 text-teal-600 dark:text-teal-400" />
                  <span className="text-[11px] font-medium">Length</span>
                </div>
                <p className="mt-1.5 text-xl font-bold tracking-tight">
                  {catchData.length}
                  <span className="ml-1 text-xs font-medium text-muted-foreground">
                    cm
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {catchData.description && (
          <ShowMoreText text={catchData.description} displayChars={50} />
        )}

        {/* Lure */}
        {catchData.lure && <LureCard lure={catchData.lure} />}

        {/* Weather conditions */}
        {catchData.weather && <WeatherCard weather={catchData.weather} />}
        {/* Footer */}
        <div className="mt-auto flex items-center gap-1.5 border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
          <CalendarDays className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="min-w-0 flex-1 truncate">
            Caught {catchData.caught_at}
          </span>

          {catchData.updated_at !== catchData.created_at && (
            <Badge
              variant="outline"
              className="shrink-0 px-1.5 py-0 text-[9px] font-normal"
            >
              Edited
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CatchCard;
