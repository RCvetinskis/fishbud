import LakeInfoCardSkeleton from "./_components/lake_info_card_skeleton";

const LakeLoading = () => {
  return (
    <div className="flex w-full flex-wrap-reverse gap-2 md:flex-nowrap md:items-stretch">
      <div className="w-full md:w-1/3">
        <LakeInfoCardSkeleton />
      </div>

      <div className="h-100 w-full md:h-auto md:min-h-[500px] md:w-2/3">
        <div className="h-full w-full animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
};

export default LakeLoading;
