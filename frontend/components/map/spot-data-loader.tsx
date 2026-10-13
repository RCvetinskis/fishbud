"use client";

import { useCallback, useEffect, useRef } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { api } from "@/handlers/api-handler";
import type { TSpot } from "@/types";

type Props = {
  search: string;
  onData: (data: TSpot[], forSearch: string) => void;
  onLoading: (loading: boolean) => void;
  onInitialLoad: () => void;
};

const SpotDataLoader = ({
  search,
  onData,
  onLoading,
  onInitialLoad,
}: Props) => {
  const map = useMap();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controller = useRef<AbortController | null>(null);
  const hasLoaded = useRef(false);

  // Keep the latest callbacks in refs so they never become effect deps.
  const onDataRef = useRef(onData);
  const onLoadingRef = useRef(onLoading);
  const onInitialLoadRef = useRef(onInitialLoad);

  useEffect(() => {
    onDataRef.current = onData;
    onLoadingRef.current = onLoading;
    onInitialLoadRef.current = onInitialLoad;
  });

  const fetchSpots = useCallback(async () => {
    controller.current?.abort();
    const abortController = new AbortController();
    controller.current = abortController;

    const bounds = map.getBounds();
    const searchValue = search.trim();
    const isSearch = searchValue.length > 0;

    onLoadingRef.current(true);

    try {
      const response = await api.get("/spots", {
        params: {
          zoom: isSearch ? 14 : map.getZoom(),
          search: searchValue || undefined,
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

      const raw = response.data.data ?? response.data.spots ?? response.data;
      const spots: TSpot[] = raw.map((spot: any) => ({
        ...spot,
        id: Number(spot.id),
        lake_id: Number(spot.lake_id),
        latitude: Number(spot.latitude),
        longitude: Number(spot.longitude),
      }));

      if (!abortController.signal.aborted) {
        onDataRef.current(spots, searchValue);
      }
    } catch (error) {
      if (!abortController.signal.aborted) {
        console.error("Failed to load spots:", error);
      }
    } finally {
      if (!abortController.signal.aborted) {
        onLoadingRef.current(false);
        if (!hasLoaded.current) {
          hasLoaded.current = true;
          onInitialLoadRef.current();
        }
      }
    }
  }, [map, search]);

  const scheduleFetch = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void fetchSpots(), 300);
  }, [fetchSpots]);

  useMapEvents({ moveend: scheduleFetch });

  useEffect(() => {
    scheduleFetch();
    return () => {
      if (timer.current) clearTimeout(timer.current);
      controller.current?.abort();
    };
  }, [scheduleFetch]);

  return null;
};

export default SpotDataLoader;
