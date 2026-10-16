"use client";

import {
  CalendarDays,
  Fish,
  MapPin,
  Trophy,
  Weight,
  Clock,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TTopFishingTripStatistic } from "@/services/statistics-service";
import Link from "next/link";
import { cn, formatDateTime, formatDuration } from "@/lib/utils";

type Props = {
  data: TTopFishingTripStatistic[];
};

const rankStyles = [
  "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md shadow-amber-500/30",
  "bg-gradient-to-br from-slate-300 to-slate-500 text-white shadow-md shadow-slate-400/30",
  "bg-gradient-to-br from-orange-400 to-orange-700 text-white shadow-md shadow-orange-500/30",
];

const TopFishingTrips = ({ data }: Props) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10">
            <Trophy className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <CardTitle>Top fishing trips</CardTitle>
            <CardDescription>
              Trips ranked by catches and total weight. Timestamps show when
              each trip started and ended.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <Fish className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              No fishing trips found for this period.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.map((trip, index) => (
              <div
                key={trip.id}
                className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all duration-200 hover: hover:shadow-lg"
              >
                {/* Header strip */}
                <div className="relative flex items-center justify-between gap-2 border-b bg-muted/40 px-3 py-2.5">
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                      rankStyles[index] ?? "bg-muted text-muted-foreground",
                    )}
                  >
                    {index + 1}
                  </div>

                  <Badge variant="secondary" className="gap-1">
                    <Fish className="h-3.5 w-3.5" />
                    {trip.catches_count}{" "}
                    {trip.catches_count === 1 ? "catch" : "catches"}
                  </Badge>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col gap-3 p-3">
                  <div className="space-y-2 text-sm">
                    <Link
                      href={`/lakes/${trip.lake_id}/?view=fishing_trips&fishing_trip_id=${trip.id}`}
                      className="flex items-center gap-2 text-primary underline-offset-4 hover:underline"
                    >
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {trip.lake_name || "Unknown lake"}
                      </span>
                    </Link>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays className="h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {formatDateTime(trip.started_at)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {formatDuration(trip.started_at, trip.ended_at)}
                      </span>
                    </div>
                  </div>

                  {/* Footer stats */}
                  <div className="mt-auto flex items-center justify-between border-t pt-3 text-sm">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Fish className="h-4 w-4 text-muted-foreground" />
                      {trip.catches_count}{" "}
                      {trip.catches_count === 1 ? "fish" : "fish"}
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Weight className="h-4 w-4" />
                      {Number(trip.total_weight).toLocaleString("lt-LT", {
                        maximumFractionDigits: 2,
                      })}{" "}
                      kg
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopFishingTrips;
