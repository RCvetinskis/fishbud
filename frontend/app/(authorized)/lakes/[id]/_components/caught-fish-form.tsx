"use client";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "@/components/ui/toast";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { caughtFishSchema } from "@/schemas/fish-schema";
import FishSelect from "@/components/fish-select";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/image-upload/image-upload";

type Props = {
  lake_id: string;
  onSuccess: () => void;
};
const CaughtFishForm = ({ lake_id, onSuccess }: Props) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof caughtFishSchema>>({
    resolver: zodResolver(caughtFishSchema),
    defaultValues: {
      fish_id: undefined,
      description: "",
      lure: "",
      weight: "",
      length: "",
      image: undefined,
    },
  });
  async function onSubmit(data: z.infer<typeof caughtFishSchema>) {
    try {
      const formData = new FormData();

      formData.append("catch[fish_id]", String(data.fish_id));
      formData.append("catch[lake_id]", String(lake_id));

      if (data.weight != null && data.weight !== "") {
        formData.append("catch[weight]", String(data.weight));
      }

      if (data.length != null && data.length !== "") {
        formData.append("catch[length]", String(data.length));
      }

      if (data.description) {
        formData.append("catch[description]", data.description);
      }

      if (data.lure) {
        formData.append("catch[lure]", data.lure);
      }

      if (data.image instanceof File) {
        formData.append("catch[image]", data.image);
      }

      const response = await axios.post("/api/catches", formData);

      onSuccess();

      toast.add({
        title: response.data.message,
        type: "success",
      });

      router.refresh();
    } catch (error: any) {
      const errorMessage = error.message || "Registry Failed";

      toast.add({
        title: errorMessage,
        type: "error",
      });
    }
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
            <Controller
              name="fish_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Fish</FieldLabel>
                  <FishSelect value={field.value} onChange={field.onChange} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="lure"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="lure">Lure / bait</FieldLabel>
                  <Input
                    {...field}
                    id="lure"
                    placeholder="e.g. Boilie, worm, spinner"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="weight"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="weight">Weight (kg)</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    id="weight"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 2.5"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="length"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="length">Length (cm)</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    id="length"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="e.g. 65"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="md:col-span-2">
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea
                      {...field}
                      id="description"
                      placeholder="e.g. Caught at 6 meters depth"
                      aria-invalid={fieldState.invalid}
                      className="min-h-24 resize-y"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="md:col-span-2">
              <Controller
                name="image"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="image">Photo</FieldLabel>
                    <ImageUpload
                      value={field.value ?? null}
                      onChange={field.onChange}
                      disabled={form.formState.isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="md:col-span-2">
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Saving catch..." : "Save catch"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CaughtFishForm;
