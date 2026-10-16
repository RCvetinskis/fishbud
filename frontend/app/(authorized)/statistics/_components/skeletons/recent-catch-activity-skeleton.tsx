import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const WEEKS = 53;
const DAYS_PER_WEEK = 7;

const RecentCatchActivitySkeleton = () => {
  return (
    <Card className="min-w-0">
      <CardHeader className="space-y-1 pb-3 sm:pb-4">
        <Skeleton className="h-5 w-36" />
        <CardDescription>
          Daily catch totals over the last 12 months. Select a day to see its
          details.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-5">
        {/* Heatmap */}
        <div className="flex min-w-0 gap-2 sm:gap-3">
          {/* Weekday labels */}
          <div className="flex shrink-0 flex-col gap-[3px] pt-6 sm:gap-1 sm:pt-7">
            {Array.from({ length: DAYS_PER_WEEK }).map((_, index) => (
              <div
                key={index}
                className="flex items-center"
                style={{ height: "clamp(10px, 1.4vw, 17px)" }}
              >
                {index % 2 === 0 && (
                  <Skeleton
                    className="h-2.5"
                    style={{
                      width: index === 0 || index === 6 ? "22px" : "20px",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Scrollable heatmap grid */}
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
              {Array.from({ length: WEEKS }).map((_, weekIndex) => (
                <div
                  key={weekIndex}
                  className="flex min-w-0 flex-col"
                  style={{
                    gap: "clamp(2px, 0.35vw, 5px)",
                  }}
                >
                  {/* Month label */}
                  <div className="h-6 sm:h-7">
                    {weekIndex % 4 === 0 && (
                      <Skeleton className="h-3 w-7 sm:w-8" />
                    )}
                  </div>

                  {/* Daily squares */}
                  {Array.from({ length: DAYS_PER_WEEK }).map((_, dayIndex) => (
                    <Skeleton
                      key={dayIndex}
                      className="aspect-square w-full rounded-[3px]"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary and legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-4">
          <div className="flex gap-5 sm:gap-8">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-16 sm:h-8 sm:w-20" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-12 sm:h-8 sm:w-16" />
            </div>
          </div>

          <div className="flex flex-col items-start gap-1.5 sm:items-end">
            <Skeleton className="h-3 w-20" />

            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="size-3 rounded-[3px] sm:size-4"
                />
              ))}
            </div>

            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentCatchActivitySkeleton;
