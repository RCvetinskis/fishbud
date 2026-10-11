"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import React from "react";

type Props = {
  currentPage: number;
  totalPages: number;
};

const PaginationContainer = ({ currentPage, totalPages }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    const params = new URLSearchParams(searchParams.toString());

    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const getVisiblePages = () => {
    const pages = new Set<number>([
      1,
      totalPages,
      currentPage,
      currentPage - 1,
      currentPage + 1,
    ]);

    return [...pages]
      .filter((page) => page >= 1 && page <= totalPages)
      .sort((a, b) => a - b);
  };

  const visiblePages = getVisiblePages();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="ghost"
            size="icon"
            aria-label="First page"
            disabled={currentPage === 1}
            onClick={() => goToPage(1)}
          >
            <ChevronsLeft className="size-4" />
          </Button>
        </PaginationItem>

        <PaginationItem>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Previous page"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
        </PaginationItem>

        {visiblePages.map((page, index) => {
          const previousPage = visiblePages[index - 1];
          const hasGap = previousPage && page - previousPage > 1;

          return (
            <React.Fragment key={page}>
              {hasGap && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationLink
                  href={`${pathname}?${new URLSearchParams({
                    ...Object.fromEntries(searchParams.entries()),
                    ...(page === 1 ? {} : { page: String(page) }),
                  }).toString()}`}
                  isActive={page === currentPage}
                  onClick={(event) => {
                    event.preventDefault();
                    goToPage(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            </React.Fragment>
          );
        })}

        <PaginationItem>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Next page"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </PaginationItem>

        <PaginationItem>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Last page"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(totalPages)}
          >
            <ChevronsRight className="size-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationContainer;
