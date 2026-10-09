"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { FeatureCollection } from "geojson";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { api } from "@/handlers/api-handler";
import { LakeLayer } from "./lake-layer";
import LakePopover from "./lake-popover";

type Position = [number, number];

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
    if (!position) return;

    map.setView(position, 13);
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
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const [selectedLake, setSelectedLake] = useState<any>(null);
  const [lakePopoverPosition, setLakePopoverPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition([coords.latitude, coords.longitude]);
      },
      (error) => {
        console.error("Failed to get location:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }, []);

  useEffect(() => {
    const fetchLakes = async () => {
      setLoading(true);

      try {
        const response = await api.get("lakes");
        setLakes(response.data);
      } finally {
        setLoading(false);
      }
    };

    fetchLakes();
  }, []);

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

        {lakes && (
          <LakeLayer
            lakes={lakes}
            onSelect={(lake, position) => {
              setSelectedLake(lake);
              setLakePopoverPosition(position);
            }}
          />
        )}
        {selectedLake && lakePopoverPosition && (
          <LakePopover
            selectedLake={selectedLake}
            setSelectedLake={setSelectedLake}
            lakePopoverPosition={lakePopoverPosition}
            setLakePopoverPosition={setLakePopoverPosition}
          />
        )}
        <UserLocation position={position} />
      </MapContainer>

      {loading && (
        <div className="absolute inset-0 z-1000 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
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
