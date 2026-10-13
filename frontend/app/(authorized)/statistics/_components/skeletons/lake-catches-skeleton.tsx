import { Card } from "@/components/ui/card";

import SelectPeriodSkeleton from "./select-period-skeleton";
import TopStatsSkeleton from "./top-stats-skeleton";
import CatchesByLakeSkeleton from "./catches-by-lake-skeleton";
import CatchesByWeatherSkeleton from "./catches-by-weather-skeleton";
import RecentCatchActivitySkeleton from "./recent-catch-activity-skeleton";

const LakeCatchesStatisticsSkeleton = () => {
  return (
    <Card className="space-y-4 p-4">
      <SelectPeriodSkeleton />

      <TopStatsSkeleton />

      <div className="grid gap-4 xl:grid-cols-2">
        <CatchesByLakeSkeleton />
        <CatchesByWeatherSkeleton />
      </div>

      <RecentCatchActivitySkeleton />
    </Card>
  );
};

export default LakeCatchesStatisticsSkeleton;
