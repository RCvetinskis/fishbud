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

const TopFishingTripsSkeleton = ({ count = 5 }: Props) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10">
            <Trophy className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <CardTitle>Top fishing trips</CardTitle>
            <CardDescription>
              Trips ranked by catches and total weight. Timestamps show when
              each trip started and ended.
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
              {/* Header strip */}
              <div className="flex items-center justify-between gap-2 border-b bg-muted/40 px-3 py-2.5">
                <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-md" />
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col gap-3 p-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-4 w-32" />
                </div>

                {/* Footer stats */}
                <div className="mt-auto flex items-center justify-between border-t pt-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopFishingTripsSkeleton;
