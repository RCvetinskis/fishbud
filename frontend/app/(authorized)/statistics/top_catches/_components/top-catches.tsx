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
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TTopCatch } from "@/services/statistics-service";
import ImageDialog from "@/components/image-dialog";

type Props = {
  data: TTopCatch[];
};

const TopCatches = ({ data }: Props) => {
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
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    index === 0
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </div>

                {item.image_url ? (
                  <ImageDialog
                    src={item.image_url}
                    alt={item.fish || "Caught fish"}
                  >
                    <img
                      src={item.image_url}
                      alt={item.fish || "Caught fish"}
                      className="h-24 w-24 rounded-lg object-cover transition-transform duration-200 hover:scale-105"
                      loading="lazy"
                    />
                  </ImageDialog>
                ) : (
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Fish className="h-9 w-9 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {item.fish || "Unknown fish"}
                  </p>

                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <UserRound className="h-3.5 w-3.5 shrink-0" />
                      {item.username || "Unknown angler"}
                    </span>

                    <Link
                      href={`/lakes/${item.lake_id}`}
                      className="flex max-w-45 items-center gap-1 text-primary underline underline-offset-4 hover:opacity-80"
                    >
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">
                        {item.lake_name || "Unknown lake"}
                      </span>
                    </Link>

                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5 shrink-0" />
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

export default TopCatches;
