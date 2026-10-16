"use client";
import { useState } from "react";
import { Badge, ChevronDown, ChevronUp, Waves } from "lucide-react";
import { TFishingTripCatch } from "@/types";
import SmallCatchCard from "@/components/small-catch-card";

type Props = {
  catches: TFishingTripCatch[];
};

const FishingTripCatches = ({ catches }: Props) => {
  const [showAllCatches, setShowAllCatches] = useState(false);

  const visibleCatches = showAllCatches ? catches : catches.slice(0, 1);

  const hasMoreCatches = catches.length > 1;
  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <Waves className="size-4 text-emerald-600 dark:text-emerald-400" />
        Catches during this trip
        <span className="ml-auto">{catches.length}</span>
      </h3>

      {catches.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border/70 bg-muted/20 px-3 py-5 text-center text-sm text-muted-foreground">
          No fish caught during this trip.
        </p>
      ) : (
        <>
          <div className="space-y-3 max-h-62 overflow-auto">
            {visibleCatches.map((catchData) => (
              <SmallCatchCard key={catchData.id} catchData={catchData} />
            ))}
          </div>

          {hasMoreCatches && (
            <button
              type="button"
              onClick={() => setShowAllCatches((prev) => !prev)}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border/60 py-2.5 text-sm font-medium text-emerald-600 transition-colors hover:bg-muted/40 dark:text-emerald-400"
              aria-expanded={showAllCatches}
            >
              {showAllCatches ? (
                <>
                  Show fewer catches
                  <ChevronUp className="size-4" />
                </>
              ) : (
                <>
                  Show all {catches.length - 1} more catches
                  <ChevronDown className="size-4" />
                </>
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default FishingTripCatches;
