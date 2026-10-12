import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

const FishingTripSkeleton = () => {
  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="h-6 w-40 animate-pulse rounded-md bg-muted" />

        <CardDescription>
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />

        <div className="h-10 w-44 animate-pulse rounded-md bg-muted" />
      </CardContent>
    </Card>
  );
};

export default FishingTripSkeleton;
