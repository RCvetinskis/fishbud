"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
type DateStat = {
  date: string;
  count: number;
};

type Props = {
  filteredDates: DateStat[];
};

const RecentCatchActivity = ({ filteredDates }: Props) => {
  const recentDates = [...filteredDates]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent catch activity</CardTitle>
        <CardDescription>
          Daily catch totals in the selected period.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {recentDates.length > 0 ? (
          <div className="space-y-3">
            {recentDates.map((record) => (
              <div
                key={record.date}
                className="flex items-center justify-between gap-3 border-b pb-3 last:border-0 last:pb-0"
              >
                <p className="text-sm font-medium">
                  {new Date(`${record.date}T12:00:00`).toLocaleDateString(
                    "en-GB",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    },
                  )}
                </p>

                <span className="text-sm font-semibold">
                  {record.count} {record.count === 1 ? "catch" : "catches"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No catch activity in this period.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentCatchActivity;
