import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type Props = {
  count?: number;
};

const TopFishingTripsSkeleton = ({ count = 5 }: Props) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <CardTitle>Top fishing trips</CardTitle>
        </div>

        <CardDescription>
          <p>Trips ranked by catches and total weight.</p>
          <p>
            Information below represents when trip started and when its ended.
          </p>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: count }).map((_, index) => (
            <div key={index}>
              <div className="flex items-center gap-3 rounded-lg border p-3">
                {/* Ranking */}
                <Skeleton className="h-9 w-9 shrink-0 rounded-full" />

                {/* Trip information */}
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-5 w-40 max-w-full" />

                      <div className="flex flex-wrap items-center gap-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>

                    {/* Catch count badge */}
                    <Skeleton className="h-6 w-20 rounded-md" />
                  </div>

                  {/* Catch count and total weight */}
                  <div className="flex flex-wrap items-center gap-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>

              {index < count - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopFishingTripsSkeleton;
