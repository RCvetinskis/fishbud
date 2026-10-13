import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CatchesByLakeSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Catches by lake</CardTitle>
        <CardDescription>
          Which lakes have the most recorded catches?
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex h-[280px] gap-3 pt-4">
          <div className="flex flex-col justify-between pb-8">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-3 w-6" />
            ))}
          </div>

          <div className="flex flex-1 items-end justify-around gap-3 border-b border-l pb-0">
            {[65, 90, 45, 75, 55, 35].map((height, index) => (
              <Skeleton
                key={index}
                className="w-full max-w-12 rounded-t-sm"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CatchesByLakeSkeleton;
