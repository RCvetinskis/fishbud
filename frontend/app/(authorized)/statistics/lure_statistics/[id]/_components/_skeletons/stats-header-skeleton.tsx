import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const StatsHeaderSkeleton = () => {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>

      <div className="flex justify-end px-6 pb-4">
        <Skeleton className="h-8 w-36 rounded-full" />
      </div>
    </Card>
  );
};

export default StatsHeaderSkeleton;
