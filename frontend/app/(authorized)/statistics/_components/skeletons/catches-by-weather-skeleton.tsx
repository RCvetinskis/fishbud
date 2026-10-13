import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CatchesByWeatherSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Catches by weather</CardTitle>
        <CardDescription>
          Top 10 weather conditions by catch count.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4 py-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="h-3 w-[190px] max-w-[45%] shrink-0" />
              <Skeleton
                className="h-5 rounded-sm"
                style={{
                  width: `${85 - index * 9}%`,
                }}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CatchesByWeatherSkeleton;
