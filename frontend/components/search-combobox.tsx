"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export type Suggestion = { id: number; name: string };

type Props = {
  placeholder: string;
  fetchSuggestions: (
    query: string,
    signal: AbortSignal,
  ) => Promise<Suggestion[]>;
  onSelect: (name: string) => void;
  disabled?: boolean;
  className?: string;
};

const DEBOUNCE_MS = 350;

const SearchCombobox = ({
  placeholder,
  fetchSuggestions,
  onSelect,
  disabled,
  className,
}: Props) => {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [listOpen, setListOpen] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Fetch suggestions with debounce + abort.
  useEffect(() => {
    const q = query.trim();

    if (debounceRef.current) clearTimeout(debounceRef.current);
    controllerRef.current?.abort();

    if (!q) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        const results = await fetchSuggestions(q, controller.signal);
        if (!controller.signal.aborted) {
          setItems(results);
          setLoading(false);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Suggestion fetch failed:", err);
          setItems([]);
          setLoading(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchSuggestions]);

  // Click outside collapses the list.
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setListOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Escape collapses.
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") setListOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Select keeps the query visible; only closes the list and notifies the parent.
  const handleSelect = (name: string) => {
    setListOpen(false);
    onSelect(name);
  };

  // Explicit clear: wipe query, results, close list, and tell parent it was cleared.
  const handleClear = () => {
    controllerRef.current?.abort();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setQuery("");
    setItems([]);
    setLoading(false);
    setListOpen(false);
    onSelect("");
  };

  const showList = listOpen && query.trim().length > 0;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full rounded-lg border bg-background shadow-md",
        disabled && "pointer-events-none opacity-60",
        className,
      )}
    >
      <Command shouldFilter={false} className="bg-transparent">
        <CommandInput
          placeholder={placeholder}
          value={query}
          onValueChange={(value) => {
            setQuery(value);
            setListOpen(true);
          }}
          onFocus={() => setListOpen(true)}
          className="pr-9"
        />

        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={handleClear}
            className="absolute right-2 top-1/2 z-[1] flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {showList && (
          <div className="absolute left-0 right-0 top-full z-[1001] mt-1 rounded-lg border bg-popover shadow-lg">
            <CommandList>
              {loading && (
                <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching...
                </div>
              )}

              {!loading && items.length === 0 && (
                <CommandEmpty>No matches found.</CommandEmpty>
              )}

              {!loading && items.length > 0 && (
                <CommandGroup>
                  {items.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={String(item.id)}
                      onSelect={() => handleSelect(item.name)}
                    >
                      <Check className="mr-2 h-4 w-4 opacity-0" />
                      {item.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </div>
        )}
      </Command>
    </div>
  );
};

export default SearchCombobox;
