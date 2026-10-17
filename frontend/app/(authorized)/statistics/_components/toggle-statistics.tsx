"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLinkStatus } from "next/link";
import { Loader2 } from "lucide-react";

function LinkLabel({ active, label }: { active: boolean; label: string }) {
  const { pending } = useLinkStatus();

  return (
    <span className="flex items-center gap-1.5">
      {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      <span className={active ? "text-foreground" : "text-muted-foreground"}>
        {label}
      </span>
    </span>
  );
}

const ToggleStatistics = () => {
  const searchParams = useSearchParams();
  const scope = searchParams.get("scope");
  const scopeValue = scope === "mine" ? "mine" : "all";

  const period = searchParams.get("period");
  const buildHref = (nextScope: "all" | "mine") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("scope", nextScope);
    params.delete("page");
    if (period) params.set("period", period);
    return `?${params.toString()}`;
  };

  const base =
    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors inline-flex items-center";
  const activeCls = "bg-background shadow-sm";
  const inactiveCls = "text-muted-foreground hover:text-foreground";

  return (
    <Card className="flex w-fit flex-row gap-1 rounded-lg bg-muted p-1">
      <Link
        href={buildHref("all")}
        className={`${base} ${scopeValue === "all" ? activeCls : inactiveCls}`}
        scroll={false}
        replace
      >
        <LinkLabel active={scopeValue === "all"} label="Everyone" />
      </Link>

      <Link
        href={buildHref("mine")}
        className={`${base} ${scopeValue === "mine" ? activeCls : inactiveCls}`}
        scroll={false}
        replace
      >
        <LinkLabel active={scopeValue === "mine"} label="My catches" />
      </Link>
    </Card>
  );
};

export default ToggleStatistics;
