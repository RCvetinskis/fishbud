import { getLakeCatches } from "@/services/lake-service";
import CaughtFishCard from "./caught-fish-card";

type Props = {
  lake_id: string;
};

const CaughtFishesList = async ({ lake_id }: Props) => {
  const data = await getLakeCatches(lake_id);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
      {data.result.map((item) => (
        <CaughtFishCard key={item.id} caughtFish={item} />
      ))}
    </div>
  );
};

export default CaughtFishesList;
