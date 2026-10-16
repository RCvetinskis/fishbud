import { getLakeFishingTrips } from "@/services/lake-service";
import FishingTripCard from "./fishing-trip-card";

import PaginationContainer from "@/components/pagination-container";
import FishingTripsFilter from "./filters/fishing-trips-filter";
import EmptyState from "@/components/empty-state";

type Props = {
  lakeId: number;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const FishingTripsList = async ({ lakeId, searchParams }: Props) => {
  const query = await searchParams;

  const fishingTripParams = {
    page: typeof query.page === "string" ? query.page : undefined,
    per_page: typeof query.per_page === "string" ? query.per_page : undefined,
    sort_by: typeof query.sort_by === "string" ? query.sort_by : undefined,
    date_from:
      typeof query.date_from === "string" ? query.date_from : undefined,
    date_to: typeof query.date_to === "string" ? query.date_to : undefined,
  };

  const data = await getLakeFishingTrips(lakeId, fishingTripParams);

  return (
    <div className="space-y-4">
      <FishingTripsFilter />

      {data.result.length === 0 ? (
        <EmptyState title="No fishing trips found" />
      ) : (
        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {data.result.map((trip) => (
            <FishingTripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}

      {data.meta && data.meta.total_pages > 1 && (
        <footer className="my-4">
          <PaginationContainer
            currentPage={data.meta.current_page}
            totalPages={data.meta.total_pages}
          />
        </footer>
      )}
    </div>
  );
};

export default FishingTripsList;
