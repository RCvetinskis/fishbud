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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <CardTitle>Biggest catches</CardTitle>
        </div>

        <CardDescription>
          The community's biggest catches in the selected period.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              {/* Ranking */}
              <Skeleton className="h-9 w-9 shrink-0 rounded-full" />

              {/* Fish image */}
              <Skeleton className="h-24 w-24 shrink-0 rounded-lg" />

              {/* Catch information */}
              <div className="min-w-0 flex-1 space-y-3">
                <Skeleton className="h-5 w-32 max-w-full" />

                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>

              {/* Length and weight */}
              <div className="flex shrink-0 flex-col items-end gap-3">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-14" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopCatchesSkeleton;
