import {
  getTopCatchesStatistics,
  getTopFishingTripsStatistics,
} from "@/services/statistics-service";
import TopCatches from "./_components/top-catches";
import TopFishingTrips from "./_components/top-fishing-trips";
type Props = {};

const TopCatchesPage = async (props: Props) => {
  const topCatches = await getTopCatchesStatistics();
  const topFishingTrips = await getTopFishingTripsStatistics();

  return (
    <div className="space-y-4  gap-2 grid grid-cols-1 lg:grid-cols-2">
      <TopCatches data={topCatches} />
      <TopFishingTrips data={topFishingTrips} />
    </div>
  );
};

export default TopCatchesPage;
