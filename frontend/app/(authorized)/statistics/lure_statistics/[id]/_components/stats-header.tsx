import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TLureStatsInsight } from "@/services/statistics-service";
import { TrendingUp } from "lucide-react";

import { formatWeekNumber } from "react-day-picker";

type Props = {
  data: TLureStatsInsight;
};

const StatsHeader = ({ data }: Props) => {
  return (
    <Card>
      <CardHeader>
        <p className="font-medium text-muted-foreground">Fishing statistics</p>

        <CardTitle className="text-2xl">{data.name}</CardTitle>

        {data.description && (
          <CardDescription className="text-xs">
            {data.description}
          </CardDescription>
        )}
      </CardHeader>

      <div className="flex justify-end">
        <Badge variant="secondary" className="w-fit gap-1.5 px-3 py-1.5">
          <TrendingUp className="size-4" />
          {formatWeekNumber(data.total_catches)} catches
        </Badge>
      </div>
    </Card>
  );
};

export default StatsHeader;
