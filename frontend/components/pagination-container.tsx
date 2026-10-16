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
import { cn } from "@/lib/utils";

type Props = {
  currentPage: number;
  totalPages: number;

  siblingCount?: number;
};

const PaginationContainer = ({
  currentPage,
  totalPages,
  siblingCount = 1,
}: Props) => {
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

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageItems = (): (number | "ellipsis")[] => {
    const totalNumbers = siblingCount * 2 + 5; // first + last + current + 2 ellipses
    if (totalPages <= totalNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSibling = Math.max(currentPage - siblingCount, 2);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages - 1);

    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < totalPages - 1;

    const items: (number | "ellipsis")[] = [1];

    if (showLeftEllipsis) {
      items.push("ellipsis");
    } else {
      // fill in the numbers between 1 and leftSibling
      for (let p = 2; p < leftSibling; p++) items.push(p);
    }

    for (let p = leftSibling; p <= rightSibling; p++) items.push(p);

    if (showRightEllipsis) {
      items.push("ellipsis");
    } else {
      for (let p = rightSibling + 1; p < totalPages; p++) items.push(p);
    }

    items.push(totalPages);
    return items;
  };

  const pageItems = getPageItems();

  return (
    <Pagination className="py-2">
      <PaginationContent className="gap-1 sm:gap-2">
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

        {pageItems.map((item, index) => {
          if (item === "ellipsis") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          const page = item;
          const href = (() => {
            const params = new URLSearchParams(searchParams.toString());
            if (page === 1) params.delete("page");
            else params.set("page", String(page));
            const query = params.toString();
            return query ? `${pathname}?${query}` : pathname;
          })();

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href={href}
                isActive={page === currentPage}
                onClick={(event) => {
                  event.preventDefault();
                  goToPage(page);
                }}
                className={cn(
                  "min-w-9",
                  page === currentPage && "font-semibold",
                )}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
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
