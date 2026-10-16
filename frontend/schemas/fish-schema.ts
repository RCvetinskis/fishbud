import { z } from "zod";

export const caughtFishSchema = z.object({
  fish_id: z
    .number({
      error: "Please select a fish",
    })
    .min(1, "Selected fish ID is invalid"),

  description: z
    .string()
    .max(255, "Description must be at most 255 characters")
    .optional(),
  lure_id: z.string().optional(),

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
  caught_at: z.string().optional(),
});

export const lureSchema = z.object({
  name: z
    .string()
    .min(2, "Name is required")
    .max(50, "Name must be at most 50 characters"),
  lure_type: z
    .string()
    .min(1, "Lure Type is required")
    .max(50, "Lure Type must be at most 50 characters"),
  description: z
    .string()
    .max(255, "Description must be at most 255 characters")
    .optional(),
});
