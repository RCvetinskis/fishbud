"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { periods } from "@/lib/constants";
import { Period, useStatisticsStore } from "@/stores/statistics-store";
import { CalendarDays } from "lucide-react";
import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const isPeriod = (value: string | null): value is Period =>
  value === "7d" || value === "30d" || value === "90d" || value === "all";

const SelectPeriod = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const period = useStatisticsStore((state) => state.period);
  const setPeriod = useStatisticsStore((state) => state.setPeriod);

  useEffect(() => {
    const urlPeriod = searchParams.get("period");
    setPeriod(isPeriod(urlPeriod) ? urlPeriod : "7d");
  }, [searchParams, setPeriod]);
  const handlePeriodChange = (value: Period | null) => {
    if (!value) return;

    setPeriod(value);

    const params = new URLSearchParams(searchParams.toString());
    params.set("period", value);

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };
  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-lg font-semibold">Catch statistics</h2>
        <p className="text-sm text-muted-foreground">
          Explore catches by lake and weather conditions.
        </p>
      </div>

      <Select value={period} onValueChange={handlePeriodChange}>
        <SelectTrigger className="w-full sm:w-44">
          <CalendarDays className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          {periods.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectPeriod;
