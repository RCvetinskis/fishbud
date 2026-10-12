"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CalendarIcon, RotateCcw, ArrowDownWideNarrow } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SORT_OPTIONS = [
  "newest",
  "oldest",
  "most_catches",
  "fewest_catches",
  "heaviest",
  "lightest",
] as const;

export type FishingTripSort = (typeof SORT_OPTIONS)[number];

const FishingTripsFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const dateFrom = searchParams.get("date_from");
  const dateTo = searchParams.get("date_to");
  const sortBy = searchParams.get("sort_by");

  const selectedSort: FishingTripSort = SORT_OPTIONS.includes(
    sortBy as FishingTripSort,
  )
    ? (sortBy as FishingTripSort)
    : "newest";

  const dateRange: DateRange | undefined =
    dateFrom || dateTo
      ? {
          from: dateFrom ? parseISO(dateFrom) : undefined,
          to: dateTo ? parseISO(dateTo) : undefined,
        }
      : undefined;

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    params.delete("page");

    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    updateParams({
      date_from: range?.from ? format(range.from, "yyyy-MM-dd") : null,
      date_to: range?.to ? format(range.to, "yyyy-MM-dd") : null,
    });
  };

  const resetFilters = () => {
    updateParams({
      date_from: null,
      date_to: null,
      sort_by: null,
    });
  };

  const dateLabel = () => {
    if (!dateRange?.from) return "Filter by date";

    if (!dateRange.to) {
      return `${format(dateRange.from, "MMM d, yyyy")} – Select end`;
    }

    return `${format(dateRange.from, "MMM d, yyyy")} – ${format(
      dateRange.to,
      "MMM d, yyyy",
    )}`;
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <ArrowDownWideNarrow className="size-4" />
        <span>Filter fishing trips</span>
      </div>

      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                className="w-full justify-start gap-2 sm:w-auto"
              />
            }
          >
            <CalendarIcon className="size-4" />
            <span className="truncate">{dateLabel()}</span>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
              defaultMonth={dateRange?.from}
              autoFocus
            />

            {dateRange && (
              <div className="border-t p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => handleDateRangeChange(undefined)}
                >
                  Clear dates
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        <Select
          value={selectedSort}
          onValueChange={(value) => {
            if (!value) return;

            updateParams({
              sort_by: value === "newest" ? null : value,
            });
          }}
        >
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Sort fishing trips" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="most_catches">Most catches</SelectItem>
            <SelectItem value="fewest_catches">Fewest catches</SelectItem>
            <SelectItem value="heaviest">Heaviest total weight</SelectItem>
            <SelectItem value="lightest">Lightest total weight</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={resetFilters}
        className="shrink-0 gap-2"
      >
        <RotateCcw className="size-3.5" />
        Reset
      </Button>
    </div>
  );
};

export default FishingTripsFilter;
