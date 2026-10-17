"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { DataTableFeatures } from "../data-table-features";
import { TLureStatistic } from "@/services/statistics-service";

const columnHelper = createColumnHelper<DataTableFeatures, TLureStatistic>();
export const columns = columnHelper.columns([
  columnHelper.accessor("lure", {
    header: "Lure",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("catches_count", {
    header: "Catches count",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("fish_name", {
    header: "Fish name",
    cell: (info) => info.getValue(),
  }),
]);
