import { getLureStatistics } from "@/services/statistics-service";
import StatisticsPageShell, {
  StatisticsSearchParams,
} from "../_components/statistics-page-shell";
import LureStatistics from "./_components/lure-statistics";
import { columns } from "@/components/table/columns/lure-columns";
import LureStatisticsLoading from "./loading";

type Props = { searchParams: Promise<StatisticsSearchParams> };

const LureStatisticsPage = ({ searchParams }: Props) => {
  return (
    <StatisticsPageShell
      searchParams={searchParams}
      useFishFilter
      paginated
      fetchData={({ period, scope, fishId, lureId, page, sortParams }) =>
        getLureStatistics(period, scope, fishId, lureId, page, sortParams)
      }
      render={(data, pagination, summary) => (
        <LureStatistics data={data} columns={columns} summary={summary} />
      )}
      skeleton={<LureStatisticsLoading />}
    />
  );
};

export default LureStatisticsPage;
