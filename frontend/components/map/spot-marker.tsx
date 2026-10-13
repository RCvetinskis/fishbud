"use client";

import { useEffect, useState } from "react";
import { Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import {
  point,
  booleanPointInPolygon,
  polygonToLine,
  pointToLineDistance,
  feature,
} from "@turf/turf";
import type { Feature, Polygon, MultiPolygon } from "geojson";
import type { SelectedLake } from "./map-view";
import { api } from "@/handlers/api-handler";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/axios-helper";
import axios from "axios";
import { TSpot } from "@/types";

const METER_RADIUS = 500;

type Position = [number, number];

type SpotMarkerProps = {
  addingSpot: boolean;
  lakeId: number | null;
  lake: SelectedLake | null;
  spots: TSpot[];
  onSpotPlaced: (position: Position) => void;
  onSpotCreated: (spot: TSpot) => void;
};

type MapPlacementHandlerProps = {
  addingSpot: boolean;
  lake: Feature<Polygon | MultiPolygon> | null;
  onSpotPlaced: (position: Position) => void;
};

const spotIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #166534;
      color: white;
      border: 2px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.35);
      font-size: 22px;
    ">⛺</div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

const isWithinLakeRadius = (
  position: Position,
  lake: Feature<Polygon | MultiPolygon>,
): boolean => {
  if (!lake.geometry?.coordinates?.length) return false;

  try {
    const clickedPoint = point([position[1], position[0]]);

    if (booleanPointInPolygon(clickedPoint, lake)) {
      return true;
    }

    const boundary = polygonToLine(lake);

    const getDistances = (line: Feature<any>): number[] => {
      const geometry = line.geometry;

      if (geometry.type === "LineString") {
        return [
          pointToLineDistance(clickedPoint, line as any, {
            units: "meters",
          }),
        ];
      }

      if (geometry.type === "MultiLineString") {
        return geometry.coordinates.map((coordinates: number[][]) =>
          pointToLineDistance(
            clickedPoint,
            feature({
              type: "LineString",
              coordinates,
            }) as any,
            { units: "meters" },
          ),
        );
      }

      return [];
    };

    const distances =
      boundary.type === "FeatureCollection"
        ? boundary.features.flatMap(getDistances)
        : getDistances(boundary as Feature<any>);

    if (distances.length === 0) return false;

    return Math.min(...distances) <= METER_RADIUS;
  } catch (error) {
    console.error("Failed to validate lake boundary:", error);
    return false;
  }
};

const MapPlacementHandler = ({
  addingSpot,
  lake,
  onSpotPlaced,
}: MapPlacementHandlerProps) => {
  useMapEvents({
    click(event) {
      if (!addingSpot || !lake) return;

      const position: Position = [event.latlng.lat, event.latlng.lng];

      if (!isWithinLakeRadius(position, lake)) return;

      onSpotPlaced(position);
    },
  });

  return null;
};

const SpotMarker = ({
  addingSpot,
  lakeId,
  lake,
  spots,
  onSpotPlaced,
  onSpotCreated,
}: SpotMarkerProps) => {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null,
  );
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlaceSpot = (position: Position) => {
    setSelectedPosition(position);
    setName("");
    setDescription("");
    setError(null);
  };

  const handleSave = async () => {
    if (!selectedPosition || !lakeId || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/spots", {
        spot: {
          lake_id: lakeId,
          name: name.trim(),
          description: description.trim(),
          latitude: selectedPosition[0],
          longitude: selectedPosition[1],
        },
      });

      const createdSpot =
        response.data.data ?? response.data.spot ?? response.data;

      const newSpot: TSpot = {
        id: Number(createdSpot.id),
        lake_id: Number(createdSpot.lake_id ?? lakeId),
        name: createdSpot.name,
        description: createdSpot.description ?? "",
        latitude: Number(createdSpot.latitude),
        longitude: Number(createdSpot.longitude),
      };

      if (!Number.isFinite(newSpot.id)) {
        throw new Error("The API response did not include a valid spot ID.");
      }
      onSpotCreated(newSpot);
      setSelectedPosition(null);
      onSpotPlaced(selectedPosition);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MapPlacementHandler
        addingSpot={addingSpot}
        lake={lake}
        onSpotPlaced={handlePlaceSpot}
      />

      {spots.map((spot) => (
        <Marker
          key={spot.id}
          position={[spot.latitude, spot.longitude]}
          icon={spotIcon}
        >
          <Popup className="spot-popup">
            <div className="min-w-44 space-y-2">
              <h3 className="font-semibold">{spot.name}</h3>

              <p>{spot.description || "No description provided."}</p>

              <a
                href={`https://www.google.com/maps?q=${spot.latitude},${spot.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs underline underline-offset-4 hover:opacity-80"
              >
                {spot.latitude.toFixed(5)}, {spot.longitude.toFixed(5)}
              </a>
            </div>
          </Popup>
        </Marker>
      ))}

      <Dialog
        open={selectedPosition !== null}
        onOpenChange={(open) => {
          if (!open && !loading) setSelectedPosition(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a spot</DialogTitle>
          </DialogHeader>

          {selectedPosition && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="spot-name">Name</Label>
                <Input
                  id="spot-name"
                  placeholder="Optional — name generated automatically"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="spot-description">Description</Label>
                <Textarea
                  id="spot-description"
                  placeholder="Describe this place..."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>

              <div className="rounded-md bg-muted p-3 text-sm">
                <p>Latitude: {selectedPosition[0].toFixed(6)}</p>
                <p>Longitude: {selectedPosition[1].toFixed(6)}</p>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedPosition(null)}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button onClick={handleSave} disabled={!lakeId || loading}>
              {loading ? "Saving..." : "Save spot"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SpotMarker;
