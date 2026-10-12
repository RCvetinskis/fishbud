import CaughtFishCardSkeleton from "./_components/skeletons/caught-fish-card-skeleton";
import FishingTripSkeleton from "./_components/skeletons/fishing-trip-skeleton";
import LakeStatisticsSkeleton from "./_components/skeletons/lake-statistics-skeleton";
import LakeInfoCardSkeleton from "./_components/skeletons/lake_info_card_skeleton";

const LakeLoading = () => {
  return (
    <div className="space-y-4">
      <div className="flex w-full flex-wrap-reverse gap-2 md:flex-nowrap md:items-stretch">
        <div className="w-full md:w-1/3">
          <LakeInfoCardSkeleton />
        </div>

        <div className="h-[400px] w-full md:h-auto md:min-h-[500px] md:w-2/3">
          <div className="h-full w-full animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
      <FishingTripSkeleton />
      <LakeStatisticsSkeleton />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <CaughtFishCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default LakeLoading;
