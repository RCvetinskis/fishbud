import { CalendarDays, Clock, Fish, Scale, MapPin, Waves } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TFishingTrip } from "@/types";
import { formatDateTime } from "@/lib/utils";

import FishingTripCatches from "./fishing-trip-catches";

type Props = {
  trip: TFishingTrip;
};

const FishingTripCard = ({ trip }: Props) => {
  const totalWeight = trip.catches.reduce(
    (total, fish) => total + (Number(fish.weight) || 0),
    0,
  );

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden rounded-xl border-border/60 bg-card p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-950/5">
      <div className="relative isolate h-28 overflow-hidden sm:h-32">
        <div className="absolute inset-0 bg-linear-to-br from-emerald-950 via-emerald-800 to-teal-700" />
        <div className="absolute -right-8 -top-12 size-36 rounded-full border border-white/10" />
        <div className="absolute -right-2 -top-6 size-24 rounded-full border border-white/10" />
        <Fish className="absolute -bottom-5 right-5 size-24 -rotate-12 text-white/10" />

        <div className="relative flex h-full flex-col justify-between p-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-100/80">
              <Waves className="size-3.5" />
              Fishing log
            </span>

            <Badge className="border border-white/15 bg-white/10 px-2 py-0.5 text-xs text-white hover:bg-white/15">
              #{trip.id}
            </Badge>
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold tracking-tight text-white">
              {trip.lake_name}
            </h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-emerald-50/80">
              <MapPin className="size-3 shrink-0" />
              Fishing trip
            </p>
          </div>
        </div>
      </div>

      <CardHeader className="space-y-2 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="size-4 text-emerald-600 dark:text-emerald-400" />
              Trip summary
            </CardTitle>
            <CardDescription>
              {trip.catches.length}{" "}
              {trip.catches.length === 1
                ? "catch recorded"
                : "catches recorded"}
            </CardDescription>
          </div>

          <Badge
            variant="outline"
            className={
              trip.status === "completed"
                ? "shrink-0 border-emerald-600/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                : "shrink-0 border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
            }
          >
            {trip.status === "completed" ? "Completed" : "In progress"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 pb-4">
        {/* Start and finish */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-border/60 bg-muted/40 p-2.5">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px] font-medium">Started</span>
            </div>
            <p className="mt-1.5 text-sm font-semibold">
              {formatDateTime(trip.started_at)}
            </p>
          </div>

          <div className="rounded-lg border border-border/60 bg-muted/40 p-2.5">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="size-3.5 text-teal-600 dark:text-teal-400" />
              <span className="text-[11px] font-medium">Finished</span>
            </div>
            <p className="mt-1.5 text-sm font-semibold">
              {trip.ended_at ? formatDateTime(trip.ended_at) : "Not finished"}
            </p>
          </div>
        </div>

        {/* Catch statistics */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-border/60 bg-muted/40 p-2.5">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Fish className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px] font-medium">Total catches</span>
            </div>
            <p className="mt-1.5 text-xl font-bold tracking-tight">
              {trip.catches.length}
            </p>
          </div>

          <div className="rounded-lg border border-border/60 bg-muted/40 p-2.5">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Scale className="size-3.5 text-teal-600 dark:text-teal-400" />
              <span className="text-[11px] font-medium">Total weight</span>
            </div>
            <p className="mt-1.5 text-xl font-bold tracking-tight">
              {totalWeight.toFixed(2)}
              <span className="ml-1 text-xs font-medium text-muted-foreground">
                kg
              </span>
            </p>
          </div>
        </div>

        <Separator />

        {/* Catches */}
        <FishingTripCatches catches={trip.catches} />

        <div className="mt-auto flex items-center gap-1.5 border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
          <CalendarDays className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="min-w-0 flex-1 truncate">
            Started {formatDateTime(trip.started_at)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default FishingTripCard;
