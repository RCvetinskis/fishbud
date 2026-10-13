"use client";

import { GeoJSON, useMap } from "react-leaflet";
import type { Feature, FeatureCollection } from "geojson";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";

import type { SelectedLake } from "./map-view";

type Props = {
  lakes: FeatureCollection;
  onSelect: (
    lake: SelectedLake,
    position: {
      x: number;
      y: number;
    },
  ) => void;
};

const getLakeStyle = (feature: Feature, lakeId?: string) => {
  const id = feature.properties?.id ?? feature.id;
  const isSelected = lakeId != null && String(id) === lakeId;

  return {
    color: isSelected ? "#15803d" : "#2563eb",
    weight: isSelected ? 3 : 1,
    fillColor: isSelected ? "#22c55e" : "#60a5fa",
    fillOpacity: isSelected ? 0.7 : 0.4,
  };
};

export const LakeLayer = ({ lakes, onSelect }: Props) => {
  const map = useMap();
  const params = useParams<{ id?: string }>();
  const lakeId = params?.id;

  const fittedLakeIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!lakeId) return;
    if (fittedLakeIdRef.current === lakeId) return; // already fit for this lake

    const lake = lakes.features.find(
      (feature) => String(feature.properties?.id ?? feature.id) === lakeId,
    );
    if (!lake) return;

    const bounds = L.geoJSON(lake).getBounds();
    if (!bounds.isValid()) return;

    fittedLakeIdRef.current = lakeId; // mark BEFORE fitBounds to avoid re-entry
    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 16,
      animate: false,
    });
  }, [lakes, lakeId, map]);
  const dataKey = useMemo(
    () => lakes.features.map((f) => String(f.properties?.id ?? f.id)).join(","),
    [lakes],
  );

  return (
    <GeoJSON
      key={dataKey}
      data={lakes}
      style={(feature) =>
        feature ? getLakeStyle(feature as Feature, lakeId) : {}
      }
      onEachFeature={(feature, layer) => {
        const properties = feature.properties ?? {};

        layer.bindTooltip(
          `<strong>${properties.name ?? "Unknown lake"}</strong><br />Area: ${properties.area ?? "Unknown"} ha`,
          { sticky: true },
        );

        layer.on({
          mouseover: (event) => {
            event.target.setStyle({
              weight: 3,
              fillOpacity: 0.7,
            });
          },

          mouseout: (event) => {
            event.target.setStyle(getLakeStyle(feature as Feature, lakeId));
          },

          click: (event) => {
            const point = map.latLngToContainerPoint(event.latlng);

            const selectedLake = {
              ...feature,
              id: Number(properties.id ?? feature.id),
              name: properties.name ?? properties.pavadinimas,
              area: properties.area ?? properties.pav_plotas ?? null,
            } as SelectedLake;

            onSelect(selectedLake, {
              x: point.x,
              y: point.y,
            });
          },
        });
      }}
    />
  );
};
