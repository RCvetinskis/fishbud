"use client";

import Link from "next/link";
import { X, MapPin, Plus } from "lucide-react";

import { Button } from "../ui/button";
import type { SelectedLake } from "./map-view";

type LakePopoverPosition = {
  x: number;
  y: number;
};

type Props = {
  selectedLake: SelectedLake | null;
  setSelectedLake: (lake: SelectedLake | null) => void;
  lakePopoverPosition: LakePopoverPosition | null;
  setLakePopoverPosition: (position: LakePopoverPosition | null) => void;
  addingSpot: boolean;
  onAddSpot: () => void;
  onCancelAddSpot: () => void;
};

const LakePopover = ({
  selectedLake,
  setSelectedLake,
  lakePopoverPosition,
  setLakePopoverPosition,
  addingSpot,
  onAddSpot,
  onCancelAddSpot,
}: Props) => {
  if (!selectedLake || !lakePopoverPosition) return null;

  const closePopover = () => {
    setSelectedLake(null);
    setLakePopoverPosition(null);
    onCancelAddSpot();
  };

  return (
    <div
      className="
    lake-popover z-1200
    fixed bottom-6 left-1/2 w-72  -translate-x-1/2 translate-y-0
    sm:absolute sm:bottom-auto sm:left-[var(--pop-x)] sm:top-[var(--pop-y)]
    sm:w-72 sm:-translate-y-full
  "
      style={{
        left: lakePopoverPosition.x,
        top: lakePopoverPosition.y - 10,
      }}
    >
      <div className="rounded-xl border bg-background p-3 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/lakes/${selectedLake.id}`}>
              <h3 className="rounded py-1 text-sm font-semibold transition-all hover:underline">
                {selectedLake.name ?? "Unknown lake"}
              </h3>
            </Link>
            <p className="text-xs text-muted-foreground">
              {selectedLake.type ?? "Lake"}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={closePopover}
            aria-label="Close lake details"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-3 space-y-2 text-xs">
          {selectedLake.area != null && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Area</span>
              <span>{selectedLake.area} ha</span>
            </div>
          )}

          {selectedLake.depth != null && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Depth</span>
              <span>{selectedLake.depth} m</span>
            </div>
          )}
        </div>

        <div className="mt-4">
          {addingSpot ? (
            <Button
              className="w-full"
              variant="outline"
              onClick={onCancelAddSpot}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel adding spot
            </Button>
          ) : (
            <Button className="w-full" onClick={onAddSpot}>
              <Plus className="mr-2 h-4 w-4" />
              Add spot
            </Button>
          )}
        </div>

        {addingSpot && (
          <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            Click the map to choose a location within 500 m of the shoreline.
          </p>
        )}
      </div>
    </div>
  );
};

export default LakePopover;
