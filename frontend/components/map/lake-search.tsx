"use client";

import { api } from "@/handlers/api-handler";
import SearchCombobox, { type Suggestion } from "../search-combobox";

const fetchLakeSuggestions = async (
  query: string,
  signal: AbortSignal,
): Promise<Suggestion[]> => {
  const res = await api.get("/lakes/suggest", {
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

const LakeSearch = ({ onSearch, placeholder = "Search lakes..." }: Props) => (
  <SearchCombobox
    placeholder={placeholder}
    fetchSuggestions={fetchLakeSuggestions}
    onSelect={onSearch}
  />
);

export default LakeSearch;
