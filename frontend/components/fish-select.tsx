"use client";
import { api } from "@/handlers/api-handler";
import Image from "next/image";
import { useEffect, useState } from "react";
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

type Props = {};

const FishSelect = (props: Props) => {
  const [fishes, setFishes] = useState<TFish[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchFishes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/fish");
      setFishes(res.data.data);
    } catch (error) {
      setFishes([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFishes();
  }, []);

  return (
    <div>
      <Combobox items={fishes}>
        <ComboboxInput disabled={loading} placeholder="Select a fish" />
        <ComboboxContent>
          {loading ? (
            <LoadingSpinner />
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
    </div>
  );
};

export default FishSelect;
