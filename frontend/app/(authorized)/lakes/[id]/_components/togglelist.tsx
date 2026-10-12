"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Fish, Waves } from "lucide-react";

const ToggleList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeView = searchParams.get("view") ?? "catches";
  const changeView = (view: "catches" | "fishing_trips") => {
    router.push(`${pathname}?view=${view}`, { scroll: false });
  };
  return (
    <div className="inline-flex rounded-lg border p-1">
      <Button
        type="button"
        variant={activeView === "catches" ? "default" : "ghost"}
        size="sm"
        onClick={() => changeView("catches")}
        aria-pressed={activeView === "catches"}
      >
        <Fish className="mr-2 size-4" />
        Catches
      </Button>

      <Button
        type="button"
        variant={activeView === "fishing_trips" ? "default" : "ghost"}
        size="sm"
        onClick={() => changeView("fishing_trips")}
        aria-pressed={activeView === "fishing_trips"}
      >
        <Waves className="mr-2 size-4" />
        Fishing trips
      </Button>
    </div>
  );
};

export default ToggleList;
