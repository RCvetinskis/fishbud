import { headers } from "next/headers";
import { Period } from "@/stores/statistics-store";

import ToggleStatistics from "./_components/toggle-statistics";
import { Card, CardContent } from "@/components/ui/card";
import SelectPeriod from "./_components/select-period";
import FishSelect from "@/components/fish-select";

type Props = {
  children: React.ReactNode;
};

export const isPeriod = (value: string | undefined): value is Period =>
  value === "7d" || value === "30d" || value === "90d" || value === "all";

const StatisticsLayout = async ({ children }: Props) => {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";

  const hideFishSelect = pathname.includes("top_fishing_trips");
  // TODO:lure statistics
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-wrap gap-2 justify-between items-center">
          <ToggleStatistics />
          {!hideFishSelect && <FishSelect syncToUrl />}
          <SelectPeriod />
        </CardContent>
      </Card>
      {children}
    </div>
  );
};

export default StatisticsLayout;
