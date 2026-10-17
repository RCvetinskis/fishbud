import { Card } from "@/components/ui/card";

import type { CatchesStatistics } from "@/services/statistics-service";

import SelectPeriod from "./select-period";
import TopStats from "./top-stats";
import CatchesByLake from "./catches_by_lake";
import CatchesByWeather from "./catches_by_weather";
import RecentCatchActivity from "./recent-catch-activity";

type Props = {
  data: CatchesStatistics;
};

const LakeCatchesStatistics = ({ data }: Props) => {
  return (
    <Card className="space-y-4 p-4">
      <div>
        <h2 className="text-lg font-semibold">Catch statistics</h2>
        <p className="text-sm text-muted-foreground">
          Explore catches by lake and weather conditions.
        </p>
      </div>

      <TopStats
        topFish={data.top_fish}
        topLake={data.top_lake}
        totalCatches={data.total_catches}
        topAngler={data.top_angler}
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <CatchesByLake data={data.catches_by_lake} />
        <CatchesByWeather data={data.catches_by_weather} />
      </div>

      <RecentCatchActivity filteredDates={data.catches_by_date} />
    </Card>
  );
};

export default LakeCatchesStatistics;
