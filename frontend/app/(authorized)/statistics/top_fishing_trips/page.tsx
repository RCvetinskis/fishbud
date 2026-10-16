import {
  getTopFishingTripsStatistics,
  type TTopFishingTripStatistic,
} from "@/services/statistics-service";
import TopFishingTrips from "./_components/top-fishing-trips";
import TopFishingTripsSkeleton from "./_components/skeletons/top-fishing-trips-skeleton";
import StatisticsPageShell, {
  type StatisticsSearchParams,
} from "../_components/statistics-page-shell";

type Props = { searchParams: Promise<StatisticsSearchParams> };

const TopFishingTripsPage = ({ searchParams }: Props) => (
  <StatisticsPageShell<TTopFishingTripStatistic[]>
    searchParams={searchParams}
    useFishFilter={false}
    paginated
    fetchData={({ period, scope, page }) =>
      getTopFishingTripsStatistics(period, scope, page)
    }
    render={(data) => <TopFishingTrips data={data} />}
    skeleton={<TopFishingTripsSkeleton count={6} />}
  />
);

export default TopFishingTripsPage;
