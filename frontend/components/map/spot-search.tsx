"use client";

import { api } from "@/handlers/api-handler";
import SearchCombobox, { type Suggestion } from "../search-combobox";

const fetchSpotSuggestions = async (
  query: string,
  signal: AbortSignal,
): Promise<Suggestion[]> => {
  const res = await api.get("/spots/suggest", {
    params: { q: query, limit: 5 },
    signal,
  });
  const data = res.data.data ?? res.data;
  return data.map((x: any) => ({ id: Number(x.id), name: String(x.name) }));
};

type Props = {
  onSearch: (value: string) => void;
  placeholder?: string;
};

const SpotSearch = ({ onSearch, placeholder = "Search spots..." }: Props) => (
  <SearchCombobox
    placeholder={placeholder}
    fetchSuggestions={fetchSpotSuggestions}
    onSelect={onSearch}
  />
);

export default SpotSearch;
