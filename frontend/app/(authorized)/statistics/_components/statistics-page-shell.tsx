import { Suspense } from "react";
import EmptyState from "@/components/empty-state";
import PaginationContainer from "@/components/pagination-container";
import { isPeriod } from "../layout";
import type { Period } from "@/stores/statistics-store";
import { TPaginatedResponse } from "@/types";

export type StatisticsSearchParams = {
  scope?: string;
  period?: string;
  fish_id?: string;
  page?: string;
};

export type TPaginationMeta = {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
};

export type StatisticsFilters = {
  period: Period;
  scope: "mine" | "all";
  fishId: string | undefined;
  page: number;
};

type Props<T> = {
  searchParams: Promise<StatisticsSearchParams>;

  useFishFilter?: boolean;

  paginated?: boolean;

  fetchData: (
    filters: StatisticsFilters,
  ) => Promise<T | TPaginatedResponse<T> | null>;

  render: (data: T, pagination: TPaginationMeta | null) => React.ReactNode;

  skeleton: React.ReactNode;

  emptyTitle?: string;
};

function isPaginatedResponse<T>(
  value: unknown,
): value is TPaginatedResponse<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    "meta" in value
  );
}

const StatisticsPageShell = async <T,>({
  searchParams,
  useFishFilter = true,
  paginated = false,
  fetchData,
  render,
  skeleton,
  emptyTitle = "No stats available",
}: Props<T>) => {
  const {
    scope,
    period: requestedPeriod,
    fish_id,
    page: requestedPage,
  } = await searchParams;

  const period: Period = isPeriod(requestedPeriod) ? requestedPeriod : "7d";
  const scopeValue: "mine" | "all" = scope === "mine" ? "mine" : "all";
  const fishId = useFishFilter ? fish_id?.trim() || undefined : undefined;
  const page = Math.max(1, Number(requestedPage) || 1);

  const filters: StatisticsFilters = {
    period,
    scope: scopeValue,
    fishId,
    page,
  };

  const filtersKey = useFishFilter
    ? `${period}-${scopeValue}-${fishId ?? "all"}-${page}`
    : `${period}-${scopeValue}-${page}`;

  async function Content() {
    const result = await fetchData(filters);

    if (result == null) {
      return <EmptyState title={emptyTitle} />;
    }

    let items: T;
    let pagination: TPaginationMeta | null = null;

    if (paginated && isPaginatedResponse<T>(result)) {
      items = result.data;
      pagination = result.meta;
    } else {
      items = result as T;
    }

    return (
      <div className="space-y-4">
        {render(items, pagination)}

        {pagination && pagination.total_pages > 1 && (
          <PaginationContainer
            currentPage={pagination.current_page}
            totalPages={pagination.total_pages}
          />
        )}
      </div>
    );
  }

  return (
    <Suspense fallback={skeleton}>
      <Content key={filtersKey} />
    </Suspense>
  );
};

export default StatisticsPageShell;
