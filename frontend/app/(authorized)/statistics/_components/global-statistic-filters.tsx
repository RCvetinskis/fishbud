"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import FishSelect from "@/components/fish-select";
import SelectPeriod from "./select-period";
import ToggleStatistics from "./toggle-statistics";

const GlobalStatisticFilters = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-9 w-28" />
        </CardContent>
      </Card>
    );
  }

  const hideFishSelect = pathname.includes("top_fishing_trips");

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-2">
        <ToggleStatistics />
        {!hideFishSelect && <FishSelect syncToUrl />}
        <SelectPeriod />
      </CardContent>
    </Card>
  );
};

export default GlobalStatisticFilters;
