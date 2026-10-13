"use client";

import { useCallback, useEffect, useRef } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import type { FeatureCollection } from "geojson";
import { api } from "@/handlers/api-handler";

type Props = {
  search: string;
  onData: (data: FeatureCollection, forSearch: string) => void;
  onLoading: (loading: boolean) => void;
  onInitialLoad: () => void;
};
const LakeDataLoader = ({
  search,
  onData,
  onLoading,
  onInitialLoad,
}: Props) => {
  const map = useMap();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controller = useRef<AbortController | null>(null);
  const hasLoaded = useRef(false);
  const fetchLakes = useCallback(async () => {
    controller.current?.abort();
    const abortController = new AbortController();
    controller.current = abortController;

    const bounds = map.getBounds();
    const searchValue = search.trim();
    const isSearch = searchValue.length > 0;

    onLoading(true);

    try {
      const response = await api.get<FeatureCollection>("/lakes", {
        params: {
          // When searching globally, use a high zoom so tolerance = 0
          zoom: isSearch ? 14 : map.getZoom(),
          search: searchValue || undefined,
          // Only send bounds for the normal browsing case
          ...(isSearch
            ? {}
            : {
                south: bounds.getSouth(),
                west: bounds.getWest(),
                north: bounds.getNorth(),
                east: bounds.getEast(),
              }),
        },
        signal: abortController.signal,
      });

      if (!abortController.signal.aborted) {
        onData(response.data, searchValue);
      }
    } catch (error) {
      if (!abortController.signal.aborted) {
        console.error("Failed to load lakes:", error);
      }
    } finally {
      if (!abortController.signal.aborted) {
        onLoading(false);
        if (!hasLoaded.current) {
          hasLoaded.current = true;
          onInitialLoad();
        }
      }
    }
  }, [map, search, onData, onLoading, onInitialLoad]);
  const scheduleFetch = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      void fetchLakes();
    }, 300);
  }, [fetchLakes]);

  useMapEvents({
    moveend: scheduleFetch,
  });

  useEffect(() => {
    scheduleFetch();

    return () => {
      if (timer.current) clearTimeout(timer.current);
      controller.current?.abort();
    };
  }, [scheduleFetch]);

  return null;
};

export default LakeDataLoader;
