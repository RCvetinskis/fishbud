import { Card } from "@/components/ui/card";
import { Fish, Weight, Ruler, Trophy } from "lucide-react";

type Props = {
  totalCatches?: number;
  mostCatches?: {
    date: string;
    count: number;
  } | null;
  heaviestFish?: {
    date: string;
    weight: number;
  } | null;
  longestFish?: {
    date: string;
    length: number;
  } | null;
  mostCommonFish?: {
    fish_id: number;
    fish_name: string;
    catches_count: number;
  } | null;
};

const formatDate = (date?: string) => {
  if (!date) return "No data yet";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const LakeStatistics = ({
  totalCatches,
  mostCatches,
  heaviestFish,
  longestFish,
  mostCommonFish,
}: Props) => {
  const statistics = [
    {
      title: "Total lake catches",
      description: totalCatches
        ? `${totalCatches} fish caught`
        : "No catches recorded",
      icon: Fish,
    },

    {
      title: "Most catches",
      description: mostCatches
        ? `${mostCatches.count} fish caught`
        : "No catches recorded",
      date: formatDate(mostCatches?.date),
      icon: Fish,
    },
    {
      title: "Heaviest fish",
      description: heaviestFish
        ? `${heaviestFish.weight} kg`
        : "No weight recorded",
      date: formatDate(heaviestFish?.date),
      icon: Weight,
    },
    {
      title: "Longest fish",
      description: longestFish
        ? `${longestFish.length} cm`
        : "No length recorded",
      date: formatDate(longestFish?.date),
      icon: Ruler,
    },
    {
      title: "Most common fish",
      description: mostCommonFish
        ? mostCommonFish.fish_name
        : "No catches recorded",
      date: mostCommonFish
        ? `${mostCommonFish.catches_count} catches`
        : "No data yet",
      icon: Fish,
    },
  ];

  return (
    <Card className="space-y-3 p-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Trophy className="size-5 text-primary" />
        Lake Statistics
      </h2>

      <div className="grid gap-3 sm:grid-cols-2  xl:grid-cols-4">
        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="flex items-start gap-3 rounded-xl border bg-card p-4"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="size-5 text-primary" />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="mt-1 font-semibold">{stat.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.date}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default LakeStatistics;
