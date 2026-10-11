import CaughtFishCard from "./caught-fish-card";
import { TCatch } from "@/types";

type Props = {
  catches: TCatch[];
};

const CaughtFishesList = async ({ catches }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {catches.map((item) => (
        <CaughtFishCard key={item.id} caughtFish={item} />
      ))}
    </div>
  );
};

export default CaughtFishesList;
