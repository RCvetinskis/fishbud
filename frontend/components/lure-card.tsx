"use client";

import { TLure } from "@/types";
import { Fish, ChevronDown, ChevronUp } from "lucide-react";
import ShowMoreText from "./show-more-text";

type Props = {
  lure: TLure;
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

          <p className="text-xs font-semibold wrap-break-word">{lure.name}</p>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-muted-foreground">Lure Type</p>
          <p className="text-xs font-semibold capitalize wrap-break-word">
            {lure.lure_type}
          </p>
        </div>
      </div>

      {lure.description && <ShowMoreText text={lure.description} />}
    </div>
  );
};

export default LureCard;
