"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TCatch } from "@/types";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Fish, UserRound, Waves } from "lucide-react";

type Props = {
  caughtFish: TCatch;
};
// TODO: At form submit weight,length,image. add pagination in frontend, sort by newest and weight?
const CaughtFishCard = ({ caughtFish }: Props) => {
  return (
    <Card className="group relative overflow-hidden border-border/60 transition-all duration-200 hover:border-primary/40 hover:shadow-md">
      {" "}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Fish className="size-6" />
            </div>

            <div className="min-w-0">
              <CardTitle className="truncate text-lg">
                {caughtFish.fish_name}
              </CardTitle>
              <CardDescription className="mt-1 flex items-center gap-1.5">
                <UserRound className="size-3.5" />
                <span className="truncate">{caughtFish.caught_by}</span>
              </CardDescription>
            </div>
          </div>
          {/* TODO: Instead display weight of fish */}
          <Badge variant="secondary" className="shrink-0 gap-1">
            <Waves className="size-3" />
            Catch #{caughtFish.id}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {caughtFish.description && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {caughtFish.description}
          </p>
        )}

        {caughtFish.lure && (
          <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/60 px-3 py-2.5">
            <span className="text-sm text-muted-foreground">Lure / bait</span>
            <span className="truncate text-sm font-medium">
              {caughtFish.lure}
            </span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            Caught {caughtFish.created_at}
          </span>

          {caughtFish.updated_at !== caughtFish.created_at && (
            <span>Updated {caughtFish.updated_at}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CaughtFishCard;
