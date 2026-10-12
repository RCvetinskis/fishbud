"use client";

import { Fish } from "lucide-react";

type Props = {
  title?: string;
  description?: string;
  onReset?: () => void;
};

const EmptyState = ({
  title = "No catches found",
  description = "There are no data matching your filters. Try changing your filters or check back later.",
  onReset,
}: Props) => {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 px-6 py-12 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
        <Fish className="size-8 text-primary" strokeWidth={1.5} />
      </div>

      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>

      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;
