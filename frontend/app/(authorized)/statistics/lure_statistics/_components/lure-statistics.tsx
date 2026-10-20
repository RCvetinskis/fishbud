import {
  TLureStatistic,
  TLureStatisticsSummary,
} from "@/services/statistics-service";
import LureStatsHeader from "./lure-stats-header";
import { DataTable } from "@/components/table/lure-statistics/data-table";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  data: TLureStatistic[];
  columns: any[];
  summary: TLureStatisticsSummary | null;
};

const LureStatistics = ({ data, columns, summary }: Props) => {
  return (
    <div className="space-y-4">
      <LureStatsHeader summary={summary} />

      <Card>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default LureStatistics;
