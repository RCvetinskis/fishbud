import MapWrapper from "@/components/map/map-wrapper";
import {
  getLakeById,
  getLakeCatches,
  getLakeStatistics,
} from "@/services/lake-service";
import LakeInfoCard from "./_components/lake-info-card";
import CaughtFishesList from "./_components/caught-fishes-list";
import CaughtFishDrawer from "./_components/caught-fish-drawer";
import CatchesFilter from "./_components/catches-filter";
import PaginationContainer from "@/components/pagination-container";
import EmptyState from "@/components/empty-state";
import LakeStatistics from "./_components/lake_statistics";
import { Card } from "@/components/ui/card";

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
const LakePage = async ({ params, searchParams }: Props) => {
  const { id } = await params;
  const [lake, statistics] = await Promise.all([
    getLakeById(id),
    getLakeStatistics(id),
  ]);

  console.log("STATISTICS:", statistics);
  if (!lake) return <h1>Lake not found</h1>;

  const query = await searchParams;
  const catchesParams = {
    date_from:
      typeof query.date_from === "string" ? query.date_from : undefined,
    date_to: typeof query.date_to === "string" ? query.date_to : undefined,
    sort_by: typeof query.sort_by === "string" ? query.sort_by : undefined,
    page: typeof query.page === "string" ? query.page : undefined,
    fish_id: typeof query.fish_id === "string" ? query.fish_id : undefined,
  };
  const data = await getLakeCatches(id, catchesParams);
  return (
    <div className="space-y-4">
      <div className="flex w-full flex-wrap-reverse gap-2 md:flex-nowrap md:items-stretch">
        <div className="w-full md:w-1/3 md:self-stretch">
          <LakeInfoCard lake={lake} />
        </div>

        <div className="mx-auto h-100 w-full md:h-auto md:min-h-125 md:w-2/3">
          <MapWrapper />
        </div>
      </div>

      <div>
        <LakeStatistics
          mostCatches={
            statistics?.most_catches
              ? {
                  date: statistics.most_catches.catch_date,
                  count: statistics.most_catches.catches_count,
                }
              : null
          }
          heaviestFish={
            statistics?.heaviest_fish
              ? {
                  date: statistics.heaviest_fish.catch_date,
                  weight: statistics.heaviest_fish.heaviest_weight,
                }
              : null
          }
          longestFish={
            statistics?.longest_fish
              ? {
                  date: statistics.longest_fish.catch_date,
                  length: statistics.longest_fish.longest_length,
                }
              : null
          }
          mostCommonFish={
            statistics?.most_common_fish
              ? {
                  fish_id: statistics.most_common_fish.fish_id,
                  fish_name: statistics.most_common_fish.fish_name,
                  catches_count: statistics.most_common_fish.catches_count,
                }
              : null
          }
        />
      </div>

      <Card>
        <CatchesFilter />
        <CaughtFishDrawer lake_id={id} />
      </Card>
      {data.result.length > 0 ? (
        <div>
          <div>
            <CaughtFishesList catches={data.result} />
          </div>
          <footer className="my-4">
            <PaginationContainer
              currentPage={data.meta?.current_page ?? 1}
              totalPages={data.meta?.total_pages ?? 1}
            />
          </footer>
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default LakePage;
