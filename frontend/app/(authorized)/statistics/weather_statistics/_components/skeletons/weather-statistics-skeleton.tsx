import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const WeatherStatisticsSkeleton = () => {
  return (
    <Card className="space-y-4 p-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Skeleton className="size-5 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>

          <Skeleton className="h-7 w-56 max-w-full" />
          <Skeleton className="mt-1 h-4 w-72 max-w-full" />
        </div>

        <Skeleton className="h-7 w-36 rounded-full" />
      </div>

      {/* Weather statistic cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, cardIndex) => (
          <Card key={cardIndex} className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-9 rounded-lg" />
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 10 }).map((_, rowIndex) => (
                  <div key={rowIndex} className="space-y-1">
                    {/* Rank, weather range and catch count */}
                    <div className="flex items-center justify-between gap-2">
                      <Skeleton className="h-4 w-28 max-w-[75%]" />
                      <Skeleton className="h-3 w-5 shrink-0" />
                    </div>

                    {/* Catch frequency progress bar */}
                    <Skeleton
                      className="h-1.5 w-full rounded-full"
                      style={{
                        opacity: 1 - rowIndex * 0.06,
                      }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom insight panel */}
      <Card className="border-emerald-500/20 bg-emerald-500/[0.03]">
        <CardContent className="flex items-start gap-3 p-4">
          <Skeleton className="size-9 shrink-0 rounded-lg" />

          <div className="flex-1 space-y-2 pt-1">
            <Skeleton className="h-4 w-40 max-w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </CardContent>
      </Card>
    </Card>
  );
};

export default WeatherStatisticsSkeleton;
