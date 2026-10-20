"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { TSelectItem } from "@/types";

type Props = {
  items: TSelectItem[];
  value: string | number | null;
  loading?: boolean;
  onChange: (value: string | null) => void;
  children?: React.ReactNode;
  placeholder?: string;
  className?: string;
  showClear?: boolean;
};

const SimpleCombobox = ({
  items,
  value,
  loading = false,
  onChange,
  children,
  className,
  placeholder = "Select an item",
  showClear = false,
}: Props) => {
  const selectedItem =
    items.find((item) => String(item.value) === value) ?? null;

  return (
    <Combobox
      items={items}
      value={selectedItem}
      itemToStringValue={(item: TSelectItem | null) => item?.label ?? ""}
      onValueChange={(item: TSelectItem | null) => {
        onChange(item ? String(item.value) : null);
      }}
    >
      <ComboboxInput
        disabled={loading}
        showClear={showClear}
        className={cn("w-full sm:w-44", className)}
        placeholder={placeholder}
      />

      <ComboboxContent>
        {children}

        <ComboboxEmpty>No items found.</ComboboxEmpty>

        <ComboboxList>
          {(item: TSelectItem) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default SimpleCombobox;
