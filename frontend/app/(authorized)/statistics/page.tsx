import {
  getLakeCatchStatistics,
  getWeatherStatistics,
} from "@/services/statistics-service";
import LakeCatchesStatistics from "./_components/lake-catches-statistics";
import WeatherStatistics from "./_components/weather-statistics";
import type { Period } from "@/stores/statistics-store";
import ToggleStatistics from "./_components/toggle-statistics";
import { Card, CardContent } from "@/components/ui/card";
import WeatherStatisticsSkeleton from "./_components/skeletons/weather-statistics-skeleton";

type Props = {
  searchParams: Promise<{
    scope?: string;
    period?: string;
  }>;
};

const isPeriod = (value: string | undefined): value is Period =>
  value === "7d" || value === "30d" || value === "90d" || value === "all";

const StatisticsPage = async ({ searchParams }: Props) => {
  const { scope, period: requestedPeriod } = await searchParams;

  const period: Period = isPeriod(requestedPeriod) ? requestedPeriod : "7d";
  const scopeValue = scope === "mine" ? "mine" : "all";
  const lakeCatchStatistics = await getLakeCatchStatistics(period, scopeValue);
  const weatherStatistics = await getWeatherStatistics(scopeValue);

  return (
    <div className="space-y-4">
      <ToggleStatistics scope={scopeValue} />
      {!weatherStatistics ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Unable to load weather statistics.
          </CardContent>
        </Card>
      ) : (
        <WeatherStatistics weatherStatistics={weatherStatistics} />
      )}

      {!lakeCatchStatistics ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Unable to load weather statistics.
          </CardContent>
        </Card>
      ) : (
        <LakeCatchesStatistics data={lakeCatchStatistics} />
      )}
    </div>
  );
};

export default StatisticsPage;
