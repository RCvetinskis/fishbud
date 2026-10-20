import CatchCardSkeleton from "@/app/(authorized)/lakes/[id]/_components/skeletons/catch-card-skeleton";
import StatsHeaderSkeleton from "./_components/_skeletons/stats-header-skeleton";
import StatsInsightSkeleton from "./_components/_skeletons/stats-insight-skeleton";

type Props = {};

const LureStatisticDetailedLoading = (props: Props) => {
  return (
    <div className="space-y-4">
      <StatsHeaderSkeleton />

      <StatsInsightSkeleton />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <CatchCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default LureStatisticDetailedLoading;
