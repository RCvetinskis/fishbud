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
    },
  });
  async function onSubmit(data: z.infer<typeof caughtFishSchema>) {
    try {
      const response = await axios.post("/api/catches", {
        catch: {
          fish_id: data.fish_id,
          lake_id,
          description: data.description,
          lure: data.lure,
        },
      });
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
    <Card className="">
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-3">
            <FieldGroup>
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
                    <FieldLabel htmlFor="lure">Lure</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="lure"
                      type="text"
                      placeholder="Boil"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="description"
                      placeholder="Caught at 6 meters depth"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </FieldGroup>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CaughtFishForm;
