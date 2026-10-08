"use client";

import { GeoJSON, useMap } from "react-leaflet";
import type { FeatureCollection } from "geojson";

type Props = {
  lakes: FeatureCollection;
  onSelect: (
    lake: any,
    position: {
      x: number;
      y: number;
    },
  ) => void;
};

export const LakeLayer = ({ lakes, onSelect }: Props) => {
  const map = useMap();

  return (
    <GeoJSON
      data={lakes}
      onEachFeature={(feature, layer) => {
        const properties = feature.properties;

        layer.bindTooltip(
          `
          <strong>${properties.name ?? "Unknown lake"}</strong>
          <br />
          Area: ${properties.area ?? "Unknown"} ha
        `,
          {
            sticky: true,
          },
        );

        layer.on({
          mouseover: (event) => {
            event.target.setStyle({
              weight: 3,
              fillOpacity: 0.7,
            });
          },

          mouseout: (event) => {
            event.target.setStyle({
              weight: 1,
              fillOpacity: 0.5,
            });
          },

          click: (event) => {
            const point = map.latLngToContainerPoint(event.latlng);

            onSelect(properties, {
              x: point.x,
              y: point.y,
            });
          },
        });
      }}
    />
  );
};
