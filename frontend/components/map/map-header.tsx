"use client";

import { Button } from "@/components/ui/button";
import LakeSearch from "./lake-search";
import SpotSearch from "./spot-search";

export type SearchMode = "lakes" | "spots";

type Props = {
  mode: SearchMode;
  onModeChange: (mode: SearchMode) => void;
  onSearch: (value: string) => void;
};

const MapHeader = ({ mode, onModeChange, onSearch }: Props) => (
  <div className="absolute left-15  top-4 z-1000 space-y-2 sm:right-auto sm:w-md">
    <div className="flex w-fit gap-1 rounded-lg border bg-background/95 p-1 shadow-md backdrop-blur">
      <Button
        type="button"
        size="sm"
        variant={mode === "lakes" ? "default" : "ghost"}
        onClick={() => onModeChange("lakes")}
      >
        Lakes
      </Button>
      <Button
        type="button"
        size="sm"
        variant={mode === "spots" ? "default" : "ghost"}
        onClick={() => onModeChange("spots")}
      >
        Spots
      </Button>
    </div>

    {mode === "lakes" ? (
      <LakeSearch onSearch={onSearch} />
    ) : (
      <SpotSearch onSearch={onSearch} />
    )}
  </div>
);

export default MapHeader;
