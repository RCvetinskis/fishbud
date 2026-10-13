import { Skeleton } from "@/components/ui/skeleton";

const SelectPeriodSkeleton = () => {
  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </div>

      <Skeleton className="h-10 w-full sm:w-44" />
    </div>
  );
};

export default SelectPeriodSkeleton;
