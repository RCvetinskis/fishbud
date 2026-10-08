"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "../ui/skeleton";

const Map = dynamic(() => import("../map/map-view"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full" />,
});

export default function MapWrapper() {
  return (
    <div className="w-full h-full">
      <Map />;
    </div>
  );
}
