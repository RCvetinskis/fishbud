"use client";

import { useEffect, useRef } from "react";
import type { Feature } from "geojson";
import { api } from "@/handlers/api-handler";

type Props = {
  lakeId: string;
  onData: (lake: Feature) => void;
  onLoading: (loading: boolean) => void;
};

const LakeByIdLoader = ({ lakeId, onData, onLoading }: Props) => {
  const controller = useRef<AbortController | null>(null);

  useEffect(() => {
    controller.current?.abort();
    const abortController = new AbortController();
    controller.current = abortController;

    const load = async () => {
      onLoading(true);
      try {
        const res = await api.get(`/lakes/${lakeId}`, {
          signal: abortController.signal,
        });
        const lake = res.data.data ?? res.data;
        const geometry = lake.geometry ?? lake.geojson;

        if (abortController.signal.aborted) return;

        if (!geometry) {
          console.error("[LakeByIdLoader] API returned no geometry", lake);
          return;
        }

        onData({
          type: "Feature",
          properties: {
            id: lake.id,
            name: lake.name,
            area: lake.area,
          },
          geometry,
        });
      } catch (err) {
        if (!abortController.signal.aborted) {
          console.error("Failed to load lake by id:", err);
        }
      } finally {
        if (!abortController.signal.aborted) onLoading(false);
      }
    };

    void load();

    return () => abortController.abort();
  }, [lakeId, onData, onLoading]);

  return null;
};

export default LakeByIdLoader;
