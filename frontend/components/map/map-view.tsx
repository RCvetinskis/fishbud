"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type {
  Feature,
  FeatureCollection,
  Polygon,
  MultiPolygon,
} from "geojson";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LakeLayer } from "./lake-layer";
import LakePopover from "./lake-popover";
import SpotMarker from "./spot-marker";
import MapClickHandler from "./map-click-hander";
import LakeDataLoader from "./lake-data-loader";

import LakeSearchZoom from "./lake-search-zoom";
import MapHeader, { type SearchMode } from "./map-header";
import SpotDataLoader from "./spot-data-loader";
import SpotSearchZoom from "./spot-search-zoom";
import { TSpot } from "@/types";
import { useParams } from "next/navigation";
import LakeByIdLoader from "./lake-by-id-loadter";

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

  const centeredRef = useRef(false);
  useEffect(() => {
    if (!position || centeredRef.current) return;
    centeredRef.current = true;
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
  const [detailLake, setDetailLake] = useState<Feature | null>(null);
  const [searchMode, setSearchMode] = useState<SearchMode>("lakes");
  // Lake search
  const [search, setSearch] = useState("");
  const [searchNonce, setSearchNonce] = useState(0);
  const [lakesSearch, setLakesSearch] = useState("");

  const [lakes, setLakes] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  // spot search
  const [spotSearch, setSpotSearch] = useState(""); // spot search
  const [spotSearchNonce, setSpotSearchNonce] = useState(0);
  const [spotsSearch, setSpotsSearch] = useState("");
  const [spots, setSpots] = useState<TSpot[]>([]);
  const [spotsLoading, setSpotsLoading] = useState(false);

  const [initialLoad, setInitialLoad] = useState(true);
  const [position, setPosition] = useState<Position | null>(null);
  const [selectedLake, setSelectedLake] = useState<SelectedLake | null>(null);
  const [addingSpot, setAddingSpot] = useState(false);
  const [lakePopoverPosition, setLakePopoverPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const routeParams = useParams<{ id?: string }>();
  const detailLakeId = routeParams?.id;
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setPosition([coords.latitude, coords.longitude]),
      (error) => console.error("Failed to get location:", error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
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

  const handleLakesData = useCallback(
    (data: FeatureCollection, forSearch: string) => {
      setLakes(data);
      setLakesSearch(forSearch);
    },
    [],
  );
  const handleInitialLoad = useCallback(() => {
    setInitialLoad(false);
  }, []);

  const handleLakeSearchSubmit = useCallback((value: string) => {
    setSearch(value);
    setSearchNonce((n) => n + 1);
  }, []);

  const handleSpotSearchSubmit = useCallback((value: string) => {
    setSpotSearch(value);
    setSpotSearchNonce((n) => n + 1);
  }, []);

  const handleHeaderSearch = useCallback(
    (value: string) =>
      searchMode === "lakes"
        ? handleLakeSearchSubmit(value)
        : handleSpotSearchSubmit(value),
    [searchMode, handleLakeSearchSubmit, handleSpotSearchSubmit],
  );
  const displayLakes = useMemo<FeatureCollection | null>(() => {
    if (!detailLake) return lakes;
    if (!lakes) {
      return { type: "FeatureCollection", features: [detailLake] };
    }

    const detailId = String(
      detailLake.properties?.id ?? (detailLake as any).id,
    );
    const alreadyThere = lakes.features.some(
      (f) => String(f.properties?.id ?? f.id) === detailId,
    );

    if (alreadyThere) return lakes;
    return { ...lakes, features: [detailLake, ...lakes.features] };
  }, [lakes, detailLake]);

  const handleSpotsInitialLoad = useCallback(() => {}, []);
  const handleDetailData = useCallback((lake: Feature) => {
    setDetailLake(lake);
  }, []);
  const handleSpotCreated = useCallback((newSpot: TSpot) => {
    setSpots((current) => {
      if (current.some((s) => Number(s.id) === Number(newSpot.id))) {
        return current;
      }
      return [...current, newSpot];
    });
  }, []);
  const handleSpotsData = useCallback((data: TSpot[], forSearch: string) => {
    setSpots((current) => {
      // Keep any locally-created spots the server response doesn't know about yet.
      const serverIds = new Set(data.map((s) => Number(s.id)));
      const pendingLocal = current.filter((s) => !serverIds.has(Number(s.id)));
      return [...data, ...pendingLocal];
    });
    setSpotsSearch(forSearch);
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

        <MapClickHandler
          addingSpot={addingSpot}
          onDeselect={handleLakeDeselected}
        />
        {/* Always mounted — handles bbox + search + zoom tiers */}
        <LakeDataLoader
          search={search}
          onData={handleLakesData}
          onLoading={setLoading}
          onInitialLoad={handleInitialLoad}
        />

        {/* Only on /lakes/:id — adds one lake to the display set */}
        {detailLakeId && (
          <LakeByIdLoader
            lakeId={detailLakeId}
            onData={handleDetailData}
            onLoading={setLoading}
          />
        )}

        {/* Search zoom continues to use the raw search results, not the merged set */}
        <LakeSearchZoom
          search={search}
          searchNonce={searchNonce}
          lakes={lakes}
          lakesSearch={lakesSearch}
          loading={loading}
        />

        <SpotDataLoader
          search={spotSearch}
          onData={handleSpotsData}
          onLoading={setSpotsLoading}
          onInitialLoad={handleSpotsInitialLoad}
        />
        <SpotSearchZoom
          search={spotSearch}
          searchNonce={spotSearchNonce}
          spots={spots}
          spotsSearch={spotsSearch}
          loading={spotsLoading}
        />

        <SpotMarker
          lakeId={selectedLake?.id ?? null}
          lake={selectedLake}
          addingSpot={addingSpot}
          spots={spots}
          onSpotPlaced={handleSpotPlaced}
          onSpotCreated={handleSpotCreated}
        />

        {/* Render the merged collection so the detail lake is always present */}
        {displayLakes && (
          <LakeLayer lakes={displayLakes} onSelect={handleLakeSelect} />
        )}

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

        <UserLocation position={position} />
      </MapContainer>
      {!addingSpot && (
        <MapHeader
          mode={searchMode}
          onModeChange={(m) => {
            setSearchMode(m);

            setSearch("");
            setSpotSearch("");
          }}
          onSearch={handleHeaderSearch}
        />
      )}

      {loading && !initialLoad && (
        <div className="mt-2 flex items-center gap-2 rounded-md bg-background/90 px-3 py-2 text-xs text-muted-foreground shadow">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-muted border-t-primary" />
          Updating map...
        </div>
      )}
      {addingSpot && selectedLake && (
        <div className="absolute bottom-5 left-1/2 z-1100 -translate-x-1/2 rounded-lg border bg-background/95 px-4 py-3 text-center shadow-lg">
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

      {initialLoad && loading && (
        <div className="absolute inset-0 z-1100 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
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
