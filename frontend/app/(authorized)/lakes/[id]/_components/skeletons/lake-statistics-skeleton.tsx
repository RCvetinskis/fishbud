import { Card } from "@/components/ui/card";

const LakeStatisticsSkeleton = () => {
  return (
    <Card className="space-y-4 p-4">
      <div className="flex items-center gap-2">
        <div className="size-5 animate-pulse rounded bg-muted" />
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex items-start gap-3 rounded-xl border p-4"
          >
            <div className="size-11 shrink-0 animate-pulse rounded-lg bg-muted" />

            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-24 max-w-full animate-pulse rounded bg-muted" />
              <div className="h-5 w-32 max-w-full animate-pulse rounded bg-muted" />
              <div className="h-3 w-24 max-w-full animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default LakeStatisticsSkeleton;
