"use client";

import {
  Trophy,
  Ruler,
  MapPin,
  CalendarDays,
  Weight,
  UserRound,
  Fish,
} from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TTopCatch } from "@/services/statistics-service";
import ImageDialog from "@/components/image-dialog";
import { cn } from "@/lib/utils";
import { TOP_STATS_LIMIT } from "@/lib/constants";

type Props = {
  data: TTopCatch[];
  currentPage?: number;
  perPage?: number;
};

const medalStyles: Record<number, string> = {
  1: "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md shadow-amber-500/30",
  2: "bg-gradient-to-br from-slate-300 to-slate-500 text-white shadow-md shadow-slate-400/30",
  3: "bg-gradient-to-br from-orange-400 to-orange-700 text-white shadow-md shadow-orange-500/30",
};

const TopCatches = ({
  data,
  currentPage = 1,
  perPage = TOP_STATS_LIMIT,
}: Props) => {
  const startRank = (currentPage - 1) * perPage + 1;

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10">
            <Trophy className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <CardTitle>Biggest catches</CardTitle>
            <CardDescription>
              The community&apos;s biggest catches in the selected period.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <Fish className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              No catches with recorded lengths for this period.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.map((item, index) => {
              const rank = startRank + index;

              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {/* Image header */}
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                    {item.image_url ? (
                      <ImageDialog
                        src={item.image_url}
                        alt={item.fish || "Caught fish"}
                      >
                        <img
                          src={item.image_url}
                          alt={item.fish || "Caught fish"}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </ImageDialog>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Fish className="h-12 w-12 text-muted-foreground/40" />
                      </div>
                    )}

                    {/* Gradient overlay for readability */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Rank badge — global rank */}
                    <div
                      className={cn(
                        "absolute left-3 top-3 flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm font-bold",
                        medalStyles[rank] ??
                          "bg-muted/90 text-muted-foreground backdrop-blur-sm",
                      )}
                    >
                      #{rank}
                    </div>

                    {/* Length badge */}
                    {item.length != null && (
                      <Badge
                        variant="secondary"
                        className="absolute right-3 top-3 gap-1 bg-background/90 backdrop-blur-sm"
                      >
                        <Ruler className="h-3.5 w-3.5" />
                        {item.length} cm
                      </Badge>
                    )}

                    {/* Fish name overlay */}
                    <div className="absolute bottom-2 left-3 right-3">
                      <p className="truncate text-base font-semibold text-white drop-shadow-md">
                        {item.fish || "Unknown fish"}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col gap-3 p-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <UserRound className="h-4 w-4 shrink-0" />
                        <span className="truncate">
                          {item.username || "Unknown angler"}
                        </span>
                      </div>

                      <Link
                        href={`/lakes/${item.lake_id}&catch_id=${item.id}`}
                        className="flex items-center gap-2 text-primary underline-offset-4 hover:underline"
                      >
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="truncate">
                          {item.lake_name || "Unknown lake"}
                        </span>
                      </Link>

                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarDays className="h-4 w-4 shrink-0" />
                        <span>
                          {item.date
                            ? new Date(
                                `${item.date}T12:00:00`,
                              ).toLocaleDateString()
                            : "Unknown date"}
                        </span>
                      </div>
                    </div>

                    {/* Footer stats */}
                    <div className="mt-auto flex items-center justify-between border-t pt-3 text-sm">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Ruler className="h-4 w-4 text-muted-foreground" />
                        {item.length != null ? `${item.length} cm` : "—"}
                      </span>
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Weight className="h-4 w-4" />
                        {item.weight != null ? `${item.weight} kg` : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopCatches;
