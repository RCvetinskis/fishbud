import WeatherStatistics from "./_components/weather-statistics";
import WeatherStatisticsSkeleton from "./_components/skeletons/weather-statistics-skeleton";
import StatisticsPageShell, {
  type StatisticsSearchParams,
} from "../_components/statistics-page-shell";
import { TWeatherStatistics } from "@/types";
import { getWeatherStatistics } from "@/services/statistics-service";

type Props = { searchParams: Promise<StatisticsSearchParams> };

const WeatherStatisticsPage = ({ searchParams }: Props) => (
  <StatisticsPageShell<TWeatherStatistics>
    searchParams={searchParams}
    fetchData={({ period, scope, fishId }) =>
      getWeatherStatistics(period, scope, fishId)
    }
    render={(data) => <WeatherStatistics weatherStatistics={data} />}
    skeleton={<WeatherStatisticsSkeleton />}
    emptyTitle="Weather statistics not found."
  />
);

export default WeatherStatisticsPage;
