import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TopStatsSkeleton = () => {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-32 max-w-full" />
              <Skeleton className="h-3 w-20" />
            </div>

            <Skeleton className="ml-3 size-5 shrink-0" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TopStatsSkeleton;
