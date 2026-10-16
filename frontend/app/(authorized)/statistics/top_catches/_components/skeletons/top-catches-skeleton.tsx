import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy } from "lucide-react";

type Props = {
  count?: number;
};

const TopCatchesSkeleton = ({ count = 5 }: Props) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10">
            <Trophy className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <CardTitle>Biggest catches</CardTitle>
            <CardDescription>
              The community&apos;s biggest catches in the selected period.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col overflow-hidden rounded-xl border bg-card"
            >
              {/* Image header */}
              <div className="relative aspect-[4/3] w-full bg-muted">
                <Skeleton className="h-full w-full rounded-none" />

                {/* Rank badge */}
                <Skeleton className="absolute left-3 top-3 h-9 w-9 rounded-full" />

                {/* Length badge */}
                <Skeleton className="absolute right-3 top-3 h-6 w-20 rounded-md" />

                {/* Fish name overlay */}
                <Skeleton className="absolute bottom-2 left-3 right-3 h-5 rounded-md" />
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-col gap-3 p-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-28" />
                </div>

                {/* Footer stats */}
                <div className="mt-auto flex items-center justify-between border-t pt-3">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-14" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopCatchesSkeleton;
