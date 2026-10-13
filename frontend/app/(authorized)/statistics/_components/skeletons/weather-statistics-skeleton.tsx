import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const WeatherStatisticsSkeleton = () => {
  return (
    <Card className="space-y-4 p-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="size-5 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>

          <Skeleton className="h-7 w-56 max-w-full" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>

        <Skeleton className="h-7 w-36 rounded-full" />
      </div>

      {/* Weather statistic cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-9 rounded-lg" />
            </CardHeader>

            <CardContent className="space-y-2">
              <Skeleton className="h-8 w-32 max-w-full" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom insight panel */}
      <Card className="border-emerald-500/20">
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
