import LureStatsHeaderSkeleton from "./_components/skeletons/lure-stats-header-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import DataTableSkeleton from "@/components/skeletons/data-table-skeleton";

type Props = {};

const LureStatisticsLoading = (props: Props) => {
  return (
    <div className="space-y-4">
      <LureStatsHeaderSkeleton />

      <Card>
        <CardContent>
          <DataTableSkeleton />
        </CardContent>
      </Card>
    </div>
  );
};

export default LureStatisticsLoading;
