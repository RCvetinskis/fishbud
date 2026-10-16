// app/statistics/lake-catches/page.tsx
import {
  getLakeCatchStatistics,
  type CatchesStatistics,
} from "@/services/statistics-service";
import LakeCatchesStatistics from "./_components/lake-catches-statistics";
import LakeCatchesStatisticsSkeleton from "./_components/skeletons/lake-catches-skeleton";
import StatisticsPageShell, {
  StatisticsSearchParams,
} from "./_components/statistics-page-shell";

type Props = { searchParams: Promise<StatisticsSearchParams> };

const LakeCatchesPage = ({ searchParams }: Props) => (
  <StatisticsPageShell<CatchesStatistics>
    searchParams={searchParams}
    fetchData={({ period, scope, fishId }) =>
      getLakeCatchStatistics(period, scope, fishId)
    }
    render={(data) => <LakeCatchesStatistics data={data} />}
    skeleton={<LakeCatchesStatisticsSkeleton />}
  />
);

export default LakeCatchesPage;
