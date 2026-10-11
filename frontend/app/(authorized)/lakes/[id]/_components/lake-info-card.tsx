import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TLake } from "@/types";
import Link from "next/link";

type Props = {
  lake: TLake;
};

const LakeInfoCard = ({ lake }: Props) => {
  const coordinatesUrl = `https://www.google.com/maps?q=${lake.latitude},${lake.longitude}`;

  const details = [
    { label: "Area", value: lake.area, unit: "ha" },
    {
      label: "Shoreline length",
      value: lake.shoreline_length,
      unit: "km",
    },
    { label: "Length", value: lake.length, unit: "km" },
    { label: "Width", value: lake.width, unit: "km" },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{lake.name}</CardTitle>
      </CardHeader>

      <CardContent>
        <dl className="space-y-3">
          {details.map(({ label, value, unit }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4"
            >
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd className="text-sm font-medium tabular-nums">
                {value != null ? `${value} ${unit}` : "—"}
              </dd>
            </div>
          ))}

          <div className="flex items-center justify-between gap-4">
            <dt className="text-sm text-muted-foreground shrink-0">
              Coordinates
            </dt>
            <dd className="min-w-0 text-sm font-medium tabular-nums">
              {lake.latitude != null && lake.longitude != null ? (
                <Link
                  href={coordinatesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block max-w-45 truncate text-right text-primary underline underline-offset-4 hover:opacity-80"
                >
                  {lake.latitude}, {lake.longitude}
                </Link>
              ) : (
                "—"
              )}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
};

export default LakeInfoCard;
