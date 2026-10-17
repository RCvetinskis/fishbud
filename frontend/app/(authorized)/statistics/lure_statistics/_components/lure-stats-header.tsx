import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TLureStatisticsSummary } from "@/services/statistics-service";
import { Fish, Trophy, Waves } from "lucide-react";

type Props = {
  summary: TLureStatisticsSummary | null;
};

const LureStatsHeader = ({ summary }: Props) => {
  if (!summary) {
    return null;
  }

  const { recorded_catches, unique_lures, unique_fish } = summary;

  const stats = [
    {
      title: "Recorded catches",
      value: recorded_catches.toLocaleString(),
      description: "Across the loaded combinations",
      icon: Fish,
    },
    {
      title: "Lures used",
      value: unique_lures.toLocaleString(),
      description: "Distinct lure names",
      icon: Waves,
    },
    {
      title: "Fish species",
      value: unique_fish.toLocaleString(),
      description: "Species in the loaded combinations",
      icon: Trophy,
    },
  ];

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Lure statistics
        </CardTitle>
        <CardDescription>
          Discover which lures catch which fish.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map(({ title, value, description, icon: Icon }) => (
            <Card key={title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>

              <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LureStatsHeader;
