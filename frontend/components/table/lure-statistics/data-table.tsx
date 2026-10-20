"use client";

import {
  useTable,
  type ColumnDef,
  type RowData,
  type SortingState,
} from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { features, type DataTableFeatures } from "../data-table-features";
import { TOP_STATS_LIMIT } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[];
  currentPage?: number;
}

export function DataTable<TData extends RowData>({
  columns,
  data,
}: DataTableProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    const column = searchParams.get("sort_params[column]");
    const direction = searchParams.get("sort_params[direction]");

    setSorting(
      column
        ? [
            {
              id: column,
              desc: direction !== "asc",
            },
          ]
        : [],
    );
  }, [searchParams]);

  const handleSortingChange = (
    updater: SortingState | ((old: SortingState) => SortingState),
  ) => {
    const nextSorting =
      typeof updater === "function" ? updater(sorting) : updater;

    setSorting(nextSorting);

    const params = new URLSearchParams(searchParams.toString());
    const sort = nextSorting[0];

    if (sort) {
      params.set("sort_params[column]", sort.id);
      params.set("sort_params[direction]", sort.desc ? "desc" : "asc");
    } else {
      params.delete("sort_params[column]");
      params.delete("sort_params[direction]");
    }

    // Return to page 1 when sorting changes.
    params.delete("page");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    });
  };

  const handleResetSorting = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("sort_params[column]");
    params.delete("sort_params[direction]");
    params.delete("page");

    setSorting([]);

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    });
  };
  const table = useTable({
    features,
    data,
    columns,
    manualSorting: true,
    onSortingChange: handleSortingChange,
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: TOP_STATS_LIMIT,
      },
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetSorting}
          disabled={sorting.length === 0 || isPending}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Clear sorting
        </Button>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
