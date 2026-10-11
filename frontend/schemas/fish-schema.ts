import { z } from "zod";

export const caughtFishSchema = z.object({
  fish_id: z
    .number({
      error: "Please select a fish",
    })
    .min(1, "Selected fish ID is invalid"),

  description: z.string().optional(),
  lure: z.string().optional(),

  weight: z
    .string()
    .optional()
    .refine(
      (value: any) =>
        !value || (Number.isFinite(Number(value)) && Number(value) > 0),
      "Weight must be a positive number",
    ),

  length: z
    .string()
    .optional()
    .refine(
      (value: any) =>
        !value || (Number.isFinite(Number(value)) && Number(value) > 0),
      "Length must be a positive number",
    ),

  image: z.file().optional(),
});
