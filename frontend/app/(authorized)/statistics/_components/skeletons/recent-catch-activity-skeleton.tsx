import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const RecentCatchActivitySkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent catch activity</CardTitle>
        <CardDescription>
          Daily catch totals in the selected period.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 border-b pb-3 last:border-0 last:pb-0"
            >
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentCatchActivitySkeleton;
