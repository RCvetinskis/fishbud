import { Card, CardContent } from "@/components/ui/card";

type Props = {
  hasImage?: boolean;
  hasMeasurements?: boolean;
  hasDescription?: boolean;
  hasLure?: boolean;
};

const CatchCardSkeleton = ({
  hasImage = false,
  hasMeasurements = true,
  hasDescription = true,
  hasLure = true,
}: Props) => {
  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-xl border-border/60 p-0 shadow-sm">
      {/* Photo or decorative header */}
      <div
        className={`relative h-28 animate-pulse overflow-hidden sm:h-32 ${
          hasImage ? "bg-muted" : "bg-emerald-950/80"
        }`}
      >
        {!hasImage && (
          <>
            <div className="absolute -right-8 -top-12 size-36 rounded-full border border-white/10" />
            <div className="absolute -right-2 -top-6 size-24 rounded-full border border-white/10" />
          </>
        )}

        <div className="absolute left-3 top-3 h-5 w-20 rounded-full bg-white/20" />

        <div className="absolute inset-x-3.5 bottom-3.5 space-y-2">
          <div className="h-5 w-2/3 rounded bg-white/25" />
          <div className="h-3 w-1/2 rounded bg-white/15" />
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 p-3.5">
        {/* Catch measurements */}
        {hasMeasurements && (
          <div className="grid grid-cols-2 gap-2">
            {[0, 1].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-border/60 bg-muted/40 p-2.5"
              >
                <div className="h-3 w-14 animate-pulse rounded bg-muted" />
                <div className="mt-3 h-6 w-20 max-w-full animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        {hasDescription && (
          <div className="space-y-2 py-1">
            <div className="h-3 w-full animate-pulse rounded bg-muted" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
          </div>
        )}

        {/* Bait / lure */}
        {hasLure && (
          <div className="flex items-center gap-2.5 rounded-lg bg-emerald-500/6 px-3 py-2.5">
            <div className="size-8 shrink-0 animate-pulse rounded-md bg-muted" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              <div className="h-3 w-28 max-w-full animate-pulse rounded bg-muted" />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center gap-2 border-t border-border/60 pt-3">
          <div className="size-3.5 shrink-0 animate-pulse rounded bg-muted" />
          <div className="h-3 w-32 max-w-full animate-pulse rounded bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
};

export default CatchCardSkeleton;
