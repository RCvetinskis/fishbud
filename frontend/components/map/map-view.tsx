"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type {
  Feature,
  FeatureCollection,
  Polygon,
  MultiPolygon,
} from "geojson";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import { api } from "@/handlers/api-handler";
import { LakeLayer } from "./lake-layer";
import LakePopover from "./lake-popover";
import SpotMarker from "./spot-marker";
import MapClickHandler from "./map-click-hander";

type Position = [number, number];

export type SelectedLake = Feature<Polygon | MultiPolygon> & {
  id: number;
  name?: string;
  area?: number | string | null;
  [key: string]: any;
};

const userLocationIcon = L.divIcon({
  className: "",
  html: `
    <div class="relative flex h-6 w-6 items-center justify-center">
      <div class="absolute h-6 w-6 rounded-full bg-blue-500/30 animate-ping"></div>
      <div class="relative h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-md"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const UserLocation = ({ position }: { position: Position | null }) => {
  const map = useMap();

  useEffect(() => {
    if (position) map.setView(position, 13);
  }, [map, position]);

  if (!position) return null;

  return (
    <Marker position={position} icon={userLocationIcon}>
      <Popup>You are here</Popup>
    </Marker>
  );
};

const MapView = () => {
  const [lakes, setLakes] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState<Position | null>(null);
  const [selectedLake, setSelectedLake] = useState<SelectedLake | null>(null);
  const [addingSpot, setAddingSpot] = useState(false);
  const [lakePopoverPosition, setLakePopoverPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setPosition([coords.latitude, coords.longitude]),
      (error) => console.error("Failed to get location:", error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }, []);

  useEffect(() => {
    const fetchLakes = async () => {
      try {
        const response = await api.get("lakes");
        setLakes(response.data);
      } catch (error) {
        console.error("Failed to load lakes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLakes();
  }, []);

  const handleLakeSelect = (
    lake: SelectedLake,
    popoverPosition: { x: number; y: number },
  ) => {
    setSelectedLake(lake);
    setLakePopoverPosition(popoverPosition);
    setAddingSpot(false);
  };
  const handleLakeDeselected = () => {
    setSelectedLake(null);
    setLakePopoverPosition(null);
    setAddingSpot(false);
  };
  const handleSpotPlaced = () => {
    setAddingSpot(false);
  };

  return (
    <div className="relative z-0 h-full w-full">
      <MapContainer
        center={[55.1694, 23.8813]}
        zoom={7}
        className="h-full w-full"
        preferCanvas
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler
          addingSpot={addingSpot}
          onDeselect={handleLakeDeselected}
        />
        {lakes && <LakeLayer lakes={lakes} onSelect={handleLakeSelect} />}

        {selectedLake && lakePopoverPosition && (
          <LakePopover
            selectedLake={selectedLake}
            setSelectedLake={setSelectedLake}
            lakePopoverPosition={lakePopoverPosition}
            setLakePopoverPosition={setLakePopoverPosition}
            addingSpot={addingSpot}
            onAddSpot={() => setAddingSpot(true)}
            onCancelAddSpot={() => setAddingSpot(false)}
          />
        )}

        <SpotMarker
          lakeId={selectedLake?.id ?? null}
          lake={selectedLake}
          addingSpot={addingSpot}
          onSpotPlaced={handleSpotPlaced}
        />

        <UserLocation position={position} />
      </MapContainer>

      {addingSpot && selectedLake && (
        <div className="absolute bottom-5 left-1/2 z-[1000] -translate-x-1/2 rounded-lg border bg-background/95 px-4 py-3 text-center shadow-lg">
          <p className="text-sm font-medium">Choose a spot on the map</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Select a point inside or within 500 m of {selectedLake.name}.
          </p>
          <button
            className="mt-2 text-xs underline"
            onClick={() => setAddingSpot(false)}
          >
            Cancel
          </button>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 z-[1100] flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-background/90 px-8 py-6 shadow-xl">
            <div className="relative flex h-12 w-12 items-center justify-center">
              <div className="absolute h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
              <div className="h-3 w-3 rounded-full bg-primary" />
            </div>
            <div className="text-center">
              <p className="font-medium">Loading lakes</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Preparing the map...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
