"use client";

import { useMapEvents } from "react-leaflet";

type Props = {
  addingSpot: boolean;
  onDeselect: () => void;
};

const MapClickHandler = ({ addingSpot, onDeselect }: Props) => {
  useMapEvents({
    click(event) {
      if (addingSpot) return;

      const target = event.originalEvent.target as HTMLElement;

      if (
        target.closest(".leaflet-interactive") ||
        target.closest(".leaflet-marker-icon") ||
        target.closest(".leaflet-popup") ||
        target.closest(".leaflet-control") ||
        target.closest(".lake-popover")
      ) {
        return;
      }

      onDeselect();
    },
  });

  return null;
};

export default MapClickHandler;
