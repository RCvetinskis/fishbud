"use client";

import { CalendarDays, Fish, MapPin, Trophy, Weight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TTopFishingTripStatistic } from "@/services/statistics-service";
import Link from "next/link";
import { formatDateTime, formatDuration } from "@/lib/utils";

type Props = {
  data: TTopFishingTripStatistic[];
};

const TopFishingTrips = ({ data }: Props) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <CardTitle>Top fishing trips</CardTitle>
        </div>
        <CardDescription>
          <p> Trips ranked by catches and total weight.</p>
          <p>
            Information below represents when trip started and when its ended.
          </p>
        </CardDescription>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No fishing trips found for this period.
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((trip, index) => (
              <div key={trip.id}>
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                      index === 0
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          href={`/lakes/${trip.lake_id}/?view=fishing_trips`}
                          className="block  truncate text-right text-primary underline underline-offset-4 hover:opacity-80"
                        >
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {trip.lake_name}
                          </span>
                        </Link>

                        <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                          <span>{formatDateTime(trip.started_at)}</span>
                          <span>·</span>
                          <span>
                            {formatDuration(trip.started_at, trip.ended_at)}
                          </span>
                        </div>
                      </div>

                      <Badge variant="secondary">
                        {trip.catches_count}{" "}
                        {trip.catches_count === 1 ? "catch" : "catches"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Fish className="h-4 w-4" />
                        {trip.catches_count}{" "}
                        {trip.catches_count === 1 ? "fish" : "fish"}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Weight className="h-4 w-4" />
                        {Number(trip.total_weight).toLocaleString("lt-LT", {
                          maximumFractionDigits: 2,
                        })}{" "}
                        kg
                      </span>
                    </div>
                  </div>
                </div>

                {index < data.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopFishingTrips;
