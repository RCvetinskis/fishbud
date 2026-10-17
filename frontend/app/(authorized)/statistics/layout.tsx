import { Period } from "@/stores/statistics-store";

import GlobalStatisticFilters from "./_components/global-statistic-filters";

type Props = {
  children: React.ReactNode;
};

export const isPeriod = (value: string | undefined): value is Period =>
  value === "7d" || value === "30d" || value === "90d" || value === "all";

const StatisticsLayout = async ({ children }: Props) => {
  return (
    <div className="space-y-4">
      <GlobalStatisticFilters />
      {children}
    </div>
  );
};

export default StatisticsLayout;
