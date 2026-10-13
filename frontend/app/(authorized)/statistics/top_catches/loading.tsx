import TopCatchesSkeleton from "./_components/skeletons/top-catches-skeleton";
import TopFishingTripsSkeleton from "./_components/skeletons/top-fishing-trips-skeleton";

type Props = {};

const TopCatchesLoading = (props: Props) => {
  return (
    <div className="space-y-4  gap-2 grid grid-cols-1 lg:grid-cols-2">
      <TopCatchesSkeleton />
      <TopFishingTripsSkeleton />
    </div>
  );
};

export default TopCatchesLoading;
