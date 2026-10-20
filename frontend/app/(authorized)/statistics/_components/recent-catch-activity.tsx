"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DateStat = {
  date: string;
  count: number;
};

type Props = {
  filteredDates: DateStat[];
};

const WEEKS = 53;
const DAYS_PER_WEEK = 7;
const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const formatDateLabel = (date: Date) =>
  `${WEEKDAYS[date.getUTCDay()]} ${date.getUTCDate()} ${
    MONTHS[date.getUTCMonth()]
  } ${date.getUTCFullYear()}`;
const formatDate = (date: Date) =>
  [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");

const getIntensity = (count: number, max: number) => {
  if (count === 0) return "bg-muted hover:bg-muted-foreground/20";
  if (max <= 1) return "bg-emerald-500 hover:bg-emerald-600";

  const ratio = count / max;

  if (ratio <= 0.25)
    return "bg-emerald-200 dark:bg-emerald-950 hover:ring-2 hover:ring-emerald-500";

  if (ratio <= 0.5)
    return "bg-emerald-400 dark:bg-emerald-800 hover:ring-2 hover:ring-emerald-500";

  if (ratio <= 0.75)
    return "bg-emerald-500 dark:bg-emerald-600 hover:ring-2 hover:ring-emerald-500";

  return "bg-emerald-700 dark:bg-emerald-400 hover:ring-2 hover:ring-emerald-500";
};

const RecentCatchActivity = ({ filteredDates }: Props) => {
  const counts = new Map(filteredDates.map(({ date, count }) => [date, count]));

  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()),
  );

  const currentMonday = new Date(todayUTC);
  const weekday = (currentMonday.getUTCDay() + 6) % 7;
  currentMonday.setUTCDate(currentMonday.getUTCDate() - weekday);

  const start = new Date(currentMonday);
  start.setUTCDate(start.getUTCDate() - (WEEKS - 1) * DAYS_PER_WEEK);

  const days = Array.from({ length: WEEKS * DAYS_PER_WEEK }, (_, i) => {
    const date = new Date(start);
    date.setUTCDate(date.getUTCDate() + i);

    const key = formatDate(date);

    return {
      key,
      date,
      count: counts.get(key) ?? 0,
      future: date > todayUTC,
    };
  });

  const visibleDays = days.filter((day) => !day.future);
  const maxCount = Math.max(0, ...visibleDays.map((day) => day.count));
  const total = visibleDays.reduce((sum, day) => sum + day.count, 0);
  const activeDays = visibleDays.filter((day) => day.count > 0).length;

  const weeks = Array.from({ length: WEEKS }, (_, weekIndex) =>
    days.slice(weekIndex * DAYS_PER_WEEK, (weekIndex + 1) * DAYS_PER_WEEK),
  );

  const monthLabels = weeks.map((week, index) => {
    const month = week[0].date.getUTCMonth();
    const previousMonth =
      index > 0 ? weeks[index - 1][0].date.getUTCMonth() : -1;

    return month !== previousMonth
      ? week[0].date.toLocaleDateString("en-GB", {
          month: "short",
          timeZone: "UTC",
        })
      : "";
  });

  return (
    <Card className="min-w-0">
      <CardHeader className="space-y-1 pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg">Catch activity</CardTitle>
        <CardDescription>
          Daily catch totals over the last 12 months. Select a day to see its
          details.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-5">
        <div className="flex min-w-0 gap-2 sm:gap-3">
          {/* Weekday labels */}
          <div className="flex shrink-0 flex-col gap-[3px] pt-6 text-[10px] text-muted-foreground sm:gap-1 sm:pt-7 sm:text-xs">
            {["Mon", "", "Wed", "", "Fri", "", "Sun"].map((label, index) => (
              <div
                key={index}
                className="flex items-center"
                style={{ height: "clamp(10px, 1.4vw, 17px)" }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Scroll on mobile instead of shrinking squares */}
          <div className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain pb-2">
            <div
              className="grid"
              style={{
                width: "100%",
                minWidth: "580px",
                gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))`,
                columnGap: "clamp(2px, 0.35vw, 5px)",
              }}
            >
              {weeks.map((week, weekIndex) => (
                <div
                  key={weekIndex}
                  className="flex min-w-0 flex-col"
                  style={{
                    gap: "clamp(2px, 0.35vw, 5px)",
                  }}
                >
                  <div
                    className="h-6 overflow-visible whitespace-nowrap text-muted-foreground sm:h-7"
                    style={{ fontSize: "clamp(9px, 0.8vw, 12px)" }}
                  >
                    {monthLabels[weekIndex]}
                  </div>

                  {week.map((day) => {
                    const dateLabel = formatDateLabel(day.date);

                    const squareClass = [
                      "block aspect-square w-full rounded-[3px]",
                      "transition-all duration-150",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      getIntensity(day.count, maxCount),
                    ].join(" ");

                    if (day.future) {
                      return (
                        <div
                          key={day.key}
                          className="invisible aspect-square w-full"
                          aria-hidden="true"
                        />
                      );
                    }

                    return (
                      <Popover key={day.key}>
                        <PopoverTrigger
                          aria-label={`${day.count} ${
                            day.count === 1 ? "catch" : "catches"
                          } on ${dateLabel}. Click for details.`}
                          title={`${day.count} ${
                            day.count === 1 ? "catch" : "catches"
                          } · ${day.key}`}
                          className={squareClass}
                        />

                        <PopoverContent
                          side="top"
                          align="center"
                          className="w-52 space-y-2"
                        >
                          <p className="text-sm text-muted-foreground">
                            {dateLabel}
                          </p>

                          <div className="flex items-center gap-3">
                            <div
                              className={`size-10 shrink-0 rounded-md ${getIntensity(
                                day.count,
                                maxCount,
                              )}`}
                            />

                            <div>
                              <p className="text-2xl font-bold tabular-nums">
                                {day.count}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {day.count === 1 ? "catch" : "catches"}
                              </p>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary and legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-4">
          <div className="flex gap-5 sm:gap-8">
            <div>
              <p className="text-xs text-muted-foreground">Total catches</p>
              <p className="text-lg font-semibold tabular-nums sm:text-2xl">
                {total.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Active days</p>
              <p className="text-lg font-semibold tabular-nums sm:text-2xl">
                {activeDays.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-1.5 sm:items-end">
            <span className="text-[10px] text-muted-foreground sm:text-xs">
              Catch volume
            </span>

            <div className="flex items-center gap-1">
              {[
                "bg-muted",
                "bg-emerald-200 dark:bg-emerald-950",
                "bg-emerald-400 dark:bg-emerald-800",
                "bg-emerald-500 dark:bg-emerald-600",
                "bg-emerald-700 dark:bg-emerald-400",
              ].map((color, index) => (
                <div
                  key={index}
                  className={`size-3 rounded-[3px] sm:size-4 ${color}`}
                  aria-hidden="true"
                />
              ))}
            </div>

            <span className="text-[10px] text-muted-foreground sm:text-xs">
              Less → More
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentCatchActivity;
