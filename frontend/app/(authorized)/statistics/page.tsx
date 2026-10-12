import { getLakeCatchStatistics } from "@/services/statistics-service";
import LakeCatchesStatistics from "./_components/lake-catches-statistics";
import WeatherStatistics from "./_components/weather-statistics";
import type { Period } from "@/stores/statistics-store";

type Props = {
  searchParams: Promise<{
    scope?: string;
    period?: string;
  }>;
};
// TODO: SCOPE BY ALl/MINE
// TODO: Display top fishing trips, period of start end and catches durning trips
// TODO: maybe create method to allow to select how many total fishes caught per trip?
const isPeriod = (value: string | undefined): value is Period =>
  value === "7d" || value === "30d" || value === "90d" || value === "all";

const StatisticsPage = async ({ searchParams }: Props) => {
  const { scope, period: requestedPeriod } = await searchParams;

  const period: Period = isPeriod(requestedPeriod) ? requestedPeriod : "7d";

  const result = await getLakeCatchStatistics(period);

  return (
    <div className="space-y-4">
      <WeatherStatistics scope={scope === "mine" ? "mine" : "all"} />
      {result && <LakeCatchesStatistics data={result.data} />}
    </div>
  );
};

export default StatisticsPage;
