import { Card } from "@/components/ui/card";
import Link from "next/link";

type Props = {
  scope: "all" | "mine";
};

const ToggleStatistics = ({ scope }: Props) => {
  return (
    <Card className="flex flex-row w-fit gap-1 rounded-lg bg-muted p-1">
      <Link
        href="?scope=all"
        className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          scope === "all"
            ? "bg-background shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Everyone
      </Link>

      <Link
        href="?scope=mine"
        className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          scope === "mine"
            ? "bg-background shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        My catches
      </Link>
    </Card>
  );
};

export default ToggleStatistics;
