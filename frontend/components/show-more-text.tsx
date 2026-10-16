"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  text: string;
  displayChars?: number;
};

const ShowMoreText = ({ text, displayChars = 100 }: Props) => {
  const [expanded, setExpanded] = useState(false);

  const formattedText = text
    .replace(/\\r\\n|\\n|\\r/g, "\n")
    .replace(/\r\n|\r/g, "\n");

  const shouldShowMore = formattedText.length > displayChars;

  const displayedText = expanded
    ? formattedText
    : formattedText.slice(0, displayChars);

  return (
    <div>
      <p className="text-xs leading-relaxed whitespace-pre-line wrap-break-word">
        {displayedText}
        {!expanded && shouldShowMore && "..."}
      </p>

      {shouldShowMore && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
          aria-expanded={expanded}
        >
          {expanded ? (
            <>
              Show less <ChevronUp className="size-3.5" />
            </>
          ) : (
            <>
              Show more <ChevronDown className="size-3.5" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ShowMoreText;
