import { getLureStatisticById } from "@/services/statistics-service";
import StatsInsight from "./_components/stats-insight";
import StatsHeader from "./_components/stats-header";
import CatchList from "@/components/catches/catch-list";

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
const LureStatisticDetailedPage = async ({ params, searchParams }: Props) => {
  const { id } = await params;
  const data = await getLureStatisticById(id);

  if (!data) return <div>not found</div>;

  return (
    <div className="space-y-4">
      <StatsHeader data={data} />
      <StatsInsight data={data} />

      <CatchList lureId={id} searchParams={searchParams} />
    </div>
  );
};

export default LureStatisticDetailedPage;
