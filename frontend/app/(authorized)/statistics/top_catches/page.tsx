import {
  getTopCatchesStatistics,
  type TTopCatch,
} from "@/services/statistics-service";
import TopCatches from "./_components/top-catches";
import TopCatchesSkeleton from "./_components/skeletons/top-catches-skeleton";
import StatisticsPageShell, {
  type StatisticsSearchParams,
} from "../_components/statistics-page-shell";

type Props = { searchParams: Promise<StatisticsSearchParams> };

const TopCatchesPage = ({ searchParams }: Props) => (
  <StatisticsPageShell<TTopCatch[]>
    searchParams={searchParams}
    paginated
    fetchData={({ period, scope, fishId, page }) =>
      getTopCatchesStatistics(period, scope, fishId, page)
    }
    render={(data, pagination) => (
      <TopCatches
        data={data}
        currentPage={pagination?.current_page ?? 1}
        perPage={pagination?.per_page}
      />
    )}
    skeleton={<TopCatchesSkeleton count={10} />}
  />
);

export default TopCatchesPage;
