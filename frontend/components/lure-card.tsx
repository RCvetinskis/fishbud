"use client";

import { TCatchLure } from "@/types";
import { Fish } from "lucide-react";
import Link from "next/link";

type Props = {
  lure: TCatchLure;
};

const LureCard = ({ lure }: Props) => {
  return (
    <div className="rounded-lg bg-emerald-500/6 px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <Fish className="size-3.5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-muted-foreground">Lure / bait</p>

          <Link
            href={`/statistics/lure_statistics/${lure.id}`}
            className="text-xs font-semibold wrap-break-word"
          >
            {lure.name}
          </Link>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-muted-foreground">Lure Type</p>
          <p className="text-xs font-semibold capitalize wrap-break-word">
            {lure.lure_type}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LureCard;
