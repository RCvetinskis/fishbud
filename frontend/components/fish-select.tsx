"use client";

import { api } from "@/handlers/api-handler";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TFish } from "@/types";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./ui/combobox";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import LoadingSpinner from "./loading-spinner";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  value?: number;
  onChange?: (value: number | undefined) => void;

  syncToUrl?: boolean;

  paramName?: string;
};

const FishSelect = ({
  value,
  onChange,
  className,
  syncToUrl = false,
  paramName = "fish_id",
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [fishes, setFishes] = useState<TFish[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFishes = async () => {
      setLoading(true);
      try {
        const res = await api.get("/fish");
        setFishes(res.data.data);
      } catch {
        setFishes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFishes();
  }, []);

  const urlFishId = syncToUrl ? searchParams.get(paramName) : null;
  const effectiveValue = syncToUrl && urlFishId ? Number(urlFishId) : value;

  const selectedFish = fishes.find((fish) => fish.id === effectiveValue);

  const handleChange = (fishId: number | undefined) => {
    onChange?.(fishId);

    if (!syncToUrl) return;

    const params = new URLSearchParams(searchParams.toString());
    if (fishId == null) {
      params.delete(paramName);
    } else {
      params.set(paramName, String(fishId));
    }
    params.delete("page"); // 👈 reset pagination

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <Combobox
      items={fishes}
      value={selectedFish?.name ?? ""}
      onValueChange={(name) => {
        const fish = fishes.find((item) => item.name === name);
        handleChange(fish?.id);
      }}
    >
      <ComboboxInput
        className={cn("w-full sm:w-44", className)}
        showClear
        disabled={loading || isPending}
        placeholder="Select a fish"
      />

      <ComboboxContent className="relative">
        {loading ? (
          <LoadingSpinner className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
        ) : (
          <>
            <ComboboxEmpty>No fish found.</ComboboxEmpty>

            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item.id} value={item.name}>
                  <Tooltip>
                    <TooltipTrigger className="w-full" delay={300}>
                      <div className="w-full cursor-pointer">{item.name}</div>
                    </TooltipTrigger>

                    {item.image_url && (
                      <TooltipContent className="bg-secondary">
                        <Image
                          alt={item.name}
                          width={300}
                          height={300}
                          src={item.image_url}
                        />
                      </TooltipContent>
                    )}
                  </Tooltip>
                </ComboboxItem>
              )}
            </ComboboxList>
          </>
        )}
      </ComboboxContent>
    </Combobox>
  );
};

export default FishSelect;
