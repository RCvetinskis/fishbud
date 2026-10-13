"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import type { Feature, FeatureCollection } from "geojson";
import L from "leaflet";

type Props = {
  search: string;
  searchNonce: number;
  lakes: FeatureCollection | null;
  lakesSearch: string;
  loading: boolean;
};
const LakeSearchZoom = ({
  search,
  searchNonce,
  lakes,
  lakesSearch,
  loading,
}: Props) => {
  const map = useMap();
  const lastNonce = useRef(-1);

  useEffect(() => {
    const query = search.trim().toLowerCase();

    // Empty search: reset so a future identical search will re-zoom.
    if (!query) {
      lastNonce.current = -1;
      return;
    }

    if (loading) return;

    // Wait until the currently loaded features were fetched for this search.
    if (lakesSearch.trim().toLowerCase() !== query) return;

    // Already handled this submit.
    if (lastNonce.current === searchNonce) return;

    // Mark handled now so later moveend-driven data churn doesn't retrigger.
    lastNonce.current = searchNonce;

    if (!lakes?.features.length) return;

    const getName = (feature: Feature) =>
      String(feature.properties?.name ?? "")
        .trim()
        .toLowerCase();

    const match =
      lakes.features.find((f) => getName(f) === query) ??
      lakes.features.find((f) => getName(f).includes(query));

    if (!match) return;

    const bounds = L.geoJSON(match).getBounds();
    if (!bounds.isValid()) return;

    map.flyToBounds(bounds, {
      padding: [40, 40],
      maxZoom: 15, // 14 was capping zoom on small lakes
      duration: 1,
    });
  }, [map, search, searchNonce, lakes, lakesSearch, loading]);

  return null;
};

export default LakeSearchZoom;
