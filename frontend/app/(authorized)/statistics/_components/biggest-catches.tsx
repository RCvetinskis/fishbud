"use client";

import {
  Trophy,
  Ruler,
  MapPin,
  CalendarDays,
  Weight,
  UserRound,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { BiggestCatch } from "@/services/statistics-service";
import Link from "next/link";

type Props = {
  data: BiggestCatch[];
};

const BiggestCatches = ({ data }: Props) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <CardTitle>Biggest catches</CardTitle>
        </div>
        <CardDescription>
          The community's biggest catches in the selected period.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No catches with recorded lengths for this period.
          </p>
        ) : (
          <div className="space-y-3">
            {data.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted font-semibold">
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {item.fish || "Unknown fish"}
                  </p>

                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <UserRound className="h-3.5 w-3.5" />
                      {item.username || "Unknown angler"}
                    </span>

                    <Link
                      href={`/lakes/${item.lake_id}`}
                      className="block max-w-45 truncate text-right text-primary underline underline-offset-4 hover:opacity-80"
                    >
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {item.lake_name || "Unknown lake"}
                      </span>
                    </Link>

                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {item.date
                        ? new Date(`${item.date}T12:00:00`).toLocaleDateString()
                        : "Unknown date"}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1 text-sm">
                  <span className="flex items-center gap-1 font-semibold">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    {item.length != null ? `${item.length} cm` : "—"}
                  </span>

                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Weight className="h-3.5 w-3.5" />
                    {item.weight != null ? `${item.weight} kg` : "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BiggestCatches;
