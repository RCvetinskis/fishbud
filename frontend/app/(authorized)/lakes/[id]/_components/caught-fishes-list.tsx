import PaginationContainer from "@/components/pagination-container";
import CaughtFishCard from "./caught-fish-card";
import { getLakeCatches } from "@/services/lake-service";
import EmptyState from "@/components/empty-state";
import CatchesFilter from "./filters/catches-filter";
import CaughtFishDrawer from "./caught-fish-drawer";
import { Card } from "@/components/ui/card";

type Props = {
  lakeId: string;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const CaughtFishesList = async ({ lakeId, searchParams }: Props) => {
  const query = await searchParams;
  const catchesParams = {
    date_from:
      typeof query.date_from === "string" ? query.date_from : undefined,
    date_to: typeof query.date_to === "string" ? query.date_to : undefined,
    sort_by: typeof query.sort_by === "string" ? query.sort_by : undefined,
    page: typeof query.page === "string" ? query.page : undefined,
    fish_id: typeof query.fish_id === "string" ? query.fish_id : undefined,
  };
  const data = await getLakeCatches(lakeId, catchesParams);

  return (
    <div className="space-y-4">
      <Card>
        <CatchesFilter />
        <CaughtFishDrawer lake_id={lakeId} />
      </Card>
      {data.result.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.result.map((item) => (
            <CaughtFishCard key={item.id} caughtFish={item} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      <footer className="my-4">
        <PaginationContainer
          currentPage={data.meta?.current_page ?? 1}
          totalPages={data.meta?.total_pages ?? 1}
        />
      </footer>
    </div>
  );
};

export default CaughtFishesList;
