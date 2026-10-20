import MapWrapper from "@/components/map/map-wrapper";
import { getLakeById, getLakeStatistics } from "@/services/lake-service";
import LakeInfoCard from "./_components/lake-info-card";
import CatchList from "../../../../components/catches/catch-list";
import LakeStatistics from "./_components/lake_statistics";
import { Card } from "@/components/ui/card";
import FishingTripStatuts from "./_components/fishing-trip-statuts";
import ToggleList from "./_components/togglelist";
import FishingTripsList from "./_components/fishing-trips-list";

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

  if (!lake) return <h1>Lake not found</h1>;

  const query = await searchParams;

  const view =
    typeof query.view === "string" && query.view === "fishing_trips"
      ? "fishing_trips"
      : "catches";

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
      <FishingTripStatuts lakeId={id} />

      <LakeStatistics
        totalCatches={statistics?.total_catches}
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

      <Card>
        <ToggleList />
      </Card>

      {view === "catches" ? (
        <>
          <CatchList lakeId={id} searchParams={searchParams} />
        </>
      ) : (
        <FishingTripsList lakeId={lake.id} searchParams={searchParams} />
      )}
    </div>
  );
};

export default LakePage;
