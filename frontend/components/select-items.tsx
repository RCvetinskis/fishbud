"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TSelectItem } from "@/types";

type Props = {
  items: TSelectItem[];
  value?: string;
  defaultValue?: string;
  onChange: (value: string | null) => void;
  placeholder: string;
};

const SelectItems = ({
  items,
  defaultValue,
  value,
  onChange,
  placeholder,
}: Props) => {
  return (
    <Select value={value} onValueChange={onChange} items={items}>
      <SelectTrigger className="w-45">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectItems;
