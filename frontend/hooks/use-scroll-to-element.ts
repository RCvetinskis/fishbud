"use client";

import { useEffect, useRef } from "react";

type Options = {
  id: string | null | undefined;
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  maxRetries?: number;

  skipOnBackForward?: boolean;
};

export function useScrollToElement({
  id,
  behavior = "smooth",
  block = "start",
  maxRetries = 20,
  skipOnBackForward = false,
}: Options) {
  const hasScrolledRef = useRef<string | null>(null);

  useEffect(() => {
    if (!id) return;

    if (skipOnBackForward) {
      const nav = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      if (nav?.type === "back_forward") return;
    }

    if (hasScrolledRef.current === id) return;
    hasScrolledRef.current = id;

    let frame = 0;
    let rafId: number | null = null;

    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior, block });
        return;
      }
      if (frame++ < maxRetries) {
        rafId = requestAnimationFrame(tryScroll);
      }
    };

    tryScroll();

    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [id, behavior, block, maxRetries, skipOnBackForward]);
}
