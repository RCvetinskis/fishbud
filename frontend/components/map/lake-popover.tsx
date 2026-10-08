import React from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";

type LakePopoverPosition = {
  x: number;
  y: number;
};

type Props = {
  selectedLake: any | null;
  setSelectedLake: (selectedLake: any | null) => void;

  lakePopoverPosition: LakePopoverPosition | null;
  setLakePopoverPosition: (
    lakePopoverPosition: LakePopoverPosition | null,
  ) => void;
};
const LakePopover = ({
  selectedLake,
  setSelectedLake,
  lakePopoverPosition,
  setLakePopoverPosition,
}: Props) => {
  return (
    <>
      {selectedLake && lakePopoverPosition && (
        <div
          className="absolute z-1000 w-72 -translate-x-1/2 -translate-y-full"
          style={{
            left: lakePopoverPosition.x,
            top: lakePopoverPosition.y - 10,
          }}
        >
          <div className="rounded-xl border bg-background p-4 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold">
                  {selectedLake.name ?? "Unknown lake"}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {selectedLake.type ?? "Lake"}
                </p>
              </div>

              <Button
                variant={"ghost"}
                onClick={() => {
                  setSelectedLake(null);
                  setLakePopoverPosition(null);
                }}
              >
                <X />
              </Button>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              {selectedLake.area && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Area</span>
                  <span>{selectedLake.area} ha</span>
                </div>
              )}

              {selectedLake.depth && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Depth</span>
                  <span>{selectedLake.depth} m</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LakePopover;
