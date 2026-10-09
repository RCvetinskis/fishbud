import MapWrapper from "@/components/map/map-wrapper";
import { getLakeById } from "@/services/lake-service";
import LakeInfoCard from "./_components/lake-info-card";
import CaughtFishesList from "./_components/caught-fishes-list";
import CaughtFishDrawer from "./_components/caught-fish-drawer";

type Props = {
  params: Promise<{
    id: string;
  }>;
};
const LakePage = async ({ params }: Props) => {
  const { id } = await params;
  const lake = await getLakeById(id);
  if (!lake) return <h1>Lake not found</h1>;

  return (
    <div>
      <div className="flex w-full flex-wrap-reverse gap-2 md:flex-nowrap md:items-stretch">
        <div className="w-full md:w-1/3 md:self-stretch">
          <LakeInfoCard lake={lake} />
        </div>

        <div className="mx-auto h-100 w-full md:h-auto md:min-h-[500px] md:w-2/3">
          <MapWrapper />
        </div>
      </div>

      <div>
        <div className="flex justify-end p-2 shadow rounded my-2">
          <CaughtFishDrawer lake_id={id} />
        </div>

        <div>
          <CaughtFishesList lake_id={id} />
        </div>
      </div>
    </div>
  );
};

export default LakePage;
