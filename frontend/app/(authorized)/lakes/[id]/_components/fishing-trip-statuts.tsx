"use client";

import { useEffect, useState } from "react";

import { Play, Square, Loader2, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/toast";
import axios from "axios";
import CaughtFishDrawer from "./caught-fish-drawer";
import { getErrorMessage } from "@/lib/axios-helper";
import Link from "next/link";

type FishingTrip = {
  id: number;
  lake_id: number;
  started_at: string;
  ended_at: string | null;
  status: "in_progress" | "completed";
};

type Props = {
  lakeId: string;
};

const FishingTripStatuts = ({ lakeId }: Props) => {
  const [trip, setTrip] = useState<FishingTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchActiveTrip = async () => {
      try {
        const response = await axios.get("/api/fishing_trips/active");
        setTrip(response.data.data);
      } catch (e: any) {
        toast.add({
          title: "Failed to load your fishing trip",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchActiveTrip();
  }, [lakeId]);

  const startTrip = async () => {
    setSaving(true);

    try {
      const response = await axios.post("/api/fishing_trips", {
        lake_id: lakeId,
      });

      setTrip(response.data.data);
      toast.add({
        title: "Fishing trip started. Good luck!",
        type: "success",
      });
    } catch (error: unknown) {
      toast.add({
        title: getErrorMessage(error),
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const finishTrip = async () => {
    if (!trip) return;

    setSaving(true);

    try {
      await axios.patch(`/api/fishing_trips/${trip.id}`, {
        status: "completed",
      });

      setTrip(null);
      setDialogOpen(false);
      toast.add({
        title: "Fishing trip completed!",
        type: "success",
      });
    } catch (error: any) {
      toast.add({
        title: error.response.data.error,
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center gap-2 py-6">
          <Loader2 className="size-4 animate-spin" />
          <span className="text-sm text-muted-foreground">
            Loading fishing trip...
          </span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="size-5" />
          Fishing trip
        </CardTitle>
        <CardDescription>
          Track your visit to this lake, durning catch recommended to record
          your fish to update statistics. Finish trip when you done fishing.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {trip && String(trip.lake_id) === String(lakeId) ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="font-medium">Trip in progress</p>
                <p className="text-sm text-muted-foreground">
                  Started {new Date(trip.started_at).toLocaleString()}
                </p>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                In progress
              </span>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">Record a catch</h3>
              <CaughtFishDrawer lake_id={lakeId} fishing_trip_id={trip.id} />
            </div>
            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <AlertDialogTrigger
                render={
                  <Button
                    variant="destructive"
                    disabled={saving}
                    className="w-full sm:w-auto"
                  >
                    <Square className="mr-2 size-4" />
                    Finish fishing trip
                  </Button>
                }
              />

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Finish your fishing trip?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will mark your trip as completed. You can finish it
                    even if you did not catch any fish.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={saving}>
                    Keep fishing
                  </AlertDialogCancel>

                  <AlertDialogAction
                    onClick={(event) => {
                      event.preventDefault();
                      void finishTrip();
                    }}
                    disabled={saving}
                  >
                    {saving ? "Finishing..." : "Complete trip"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : trip ? (
          <>
            <p className="font-medium">
              You already have an active fishing trip
            </p>

            <p className="text-sm text-muted-foreground">
              Finish your current trip before starting another one at this lake.
            </p>

            <Button className="w-full sm:w-auto">
              <Link href={`/lakes/${trip.lake_id}`}>
                Go to your active fishing trip
              </Link>
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              No active fishing trip. Start one to record your visit, even if
              you don't catch any fish.
            </p>

            <Button
              onClick={startTrip}
              disabled={saving}
              className="w-full sm:w-auto"
            >
              {saving ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Play className="mr-2 size-4" />
              )}
              Start fishing trip
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FishingTripStatuts;
