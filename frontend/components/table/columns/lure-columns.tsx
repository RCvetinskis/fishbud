"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TLureStatistic } from "@/services/statistics-service";
import { DataTableFeatures } from "../data-table-features";
import Link from "next/link";

const columnHelper = createColumnHelper<DataTableFeatures, TLureStatistic>();

export const columns = columnHelper.columns([
  columnHelper.accessor("lure", {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Lure
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <Link
          href={`/statistics/lure_statistics/${encodeURIComponent(row.original.lure_id)}`}
        >
          {row.original.lure}
        </Link>
      );
    },
  }),

  columnHelper.accessor("catches_count", {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Catches Count
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  }),

  columnHelper.accessor("fish_name", {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Fish Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  }),
]);
