"use client";

import SimpleCombobox from "@/components/simple-combobox";
import { getLures } from "@/services/lure-service";
import { TLure } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

type Props = {};

const LureSelect = (props: Props) => {
  const [lures, setLures] = useState<TLure[]>([]);
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const fetchLures = async () => {
      try {
        setLoading(true);
        const luresData = await getLures();
        setLures(luresData);
      } finally {
        setLoading(false);
      }
    };
    fetchLures();
  }, []);

  const handleChange = (lureId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (lureId == null) {
      params.delete("lure_id");
      setValue(null);
    } else {
      params.set("lure_id", String(lureId));
      setValue(lureId);
    }
    params.delete("page");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };
  const selectItems = lures.map((lure) => ({
    label: lure.name.charAt(0).toUpperCase() + lure.name.slice(1),
    value: lure.id,
  }));
  return (
    <SimpleCombobox
      items={selectItems}
      value={value}
      onChange={handleChange}
      placeholder="Select Lure"
      loading={loading || isPending}
      showClear
    />
  );
};

export default LureSelect;
