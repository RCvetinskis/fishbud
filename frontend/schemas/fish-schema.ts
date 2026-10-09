import { z } from "zod";

export const caughtFishSchema = z.object({
  fish_id: z
    .number({
      error: "Please select a fish",
    })
    .min(1, "Selected fish ID is invalid"),

  description: z.string().optional(),
  lure: z.string().optional(),
});
