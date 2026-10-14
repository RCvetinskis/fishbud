"use client";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "@/components/ui/toast";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { lureSchema } from "@/schemas/fish-schema";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/axios-helper";
import SelectItems from "@/components/select-items";
import { useEffect, useState } from "react";
import { createLure, getLureTypes } from "@/services/lure-service";
import { TLure, TLureType } from "@/types";

type Props = {
  afterSubmit?: (lure: TLure) => void;
};
const LureForm = ({ afterSubmit }: Props) => {
  const [lureTypes, setLureTypes] = useState<TLureType[]>([]);
  const router = useRouter();
  const form = useForm<z.infer<typeof lureSchema>>({
    resolver: zodResolver(lureSchema),
    defaultValues: {
      name: "",
      description: "",
      lure_type: "",
    },
  });

  useEffect(() => {
    const fetchLures = async () => {
      const response = await getLureTypes();

      if (response.length > 0) {
        form.setValue("lure_type", response[0], {
          shouldValidate: true,
        });
        setLureTypes(response);
      }
    };
    fetchLures();
  }, []);
  async function onSubmit(data: z.infer<typeof lureSchema>) {
    try {
      const body = {
        lure: {
          ...data,
        },
      };
      const response = await createLure(body);

      if (response.data) {
        toast.add({
          title: response?.message,
          type: "success",
        });
        afterSubmit && afterSubmit(response.data);
        router.refresh();
      }
    } catch (error: any) {
      toast.add({
        title: getErrorMessage(error),
        type: "error",
      });
    }
  }

  const selectItems = lureTypes.map((lure) => ({
    label: lure.charAt(0).toUpperCase() + lure.slice(1),
    value: lure,
  }));

  return (
    <form id="lure-form" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                {...field}
                id="name"
                placeholder="e.g. Boilie, worm, spinner"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="lure_type"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="lure_type">Lure Type</FieldLabel>
              <SelectItems
                value={field.value}
                items={selectItems}
                onChange={field.onChange}
                placeholder="e.g Natural/Artificial"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="md:col-span-2">
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="description">
                  Description (optional)
                </FieldLabel>
                <Textarea
                  {...field}
                  id="description"
                  placeholder="e.g. Strawberry mixed with vanila"
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
          <Button
            type="submit"
            form="lure-form"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default LureForm;
