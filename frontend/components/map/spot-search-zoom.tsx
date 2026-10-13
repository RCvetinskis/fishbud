"use client";

import { TSpot } from "@/types";
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

type Props = {
  search: string;
  searchNonce: number;
  spots: TSpot[];
  spotsSearch: string;
  loading: boolean;
};

const SpotSearchZoom = ({
  search,
  searchNonce,
  spots,
  spotsSearch,
  loading,
}: Props) => {
  const map = useMap();
  const lastNonce = useRef(-1);

  useEffect(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      lastNonce.current = -1;
      return;
    }

    if (loading) return;
    if (spotsSearch.trim().toLowerCase() !== query) return;
    if (lastNonce.current === searchNonce) return;

    lastNonce.current = searchNonce;

    const getName = (s: TSpot) => s.name.trim().toLowerCase();

    const match =
      spots.find((s) => getName(s) === query) ??
      spots.find((s) => getName(s).includes(query));

    if (!match) return;

    map.flyTo([match.latitude, match.longitude], 16, { duration: 1 });
  }, [map, search, searchNonce, spots, spotsSearch, loading]);

  return null;
};

export default SpotSearchZoom;
