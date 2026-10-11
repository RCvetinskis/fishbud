import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const LakeInfoCardSkeleton = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-6 w-3/5" />
      </CardHeader>

      <CardContent>
        <dl className="space-y-3">
          {["Area", "Shoreline length", "Length", "Width", "Coordinates"].map(
            (label) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4"
              >
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="min-w-0">
                  <Skeleton className="h-4 w-20" />
                </dd>
              </div>
            ),
          )}
        </dl>
      </CardContent>
    </Card>
  );
};

export default LakeInfoCardSkeleton;
