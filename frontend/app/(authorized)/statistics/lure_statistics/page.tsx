import { getLureStatistics } from "@/services/statistics-service";
import StatisticsPageShell, {
  StatisticsSearchParams,
} from "../_components/statistics-page-shell";
import LureStatistics from "./_components/lure-statistics";
import { columns } from "@/components/table/columns/lure-columns";

type Props = { searchParams: Promise<StatisticsSearchParams> };

const LureStatisticsPage = ({ searchParams }: Props) => {
  return (
    <StatisticsPageShell
      searchParams={searchParams}
      useFishFilter
      paginated
      fetchData={({ period, scope, fishId, page }) =>
        getLureStatistics(period, scope, fishId, page)
      }
      render={(data, pagination, summary) => (
        <LureStatistics data={data} columns={columns} summary={summary} />
      )}
      skeleton={<div>Loading...</div>}
    />
  );
};

export default LureStatisticsPage;
