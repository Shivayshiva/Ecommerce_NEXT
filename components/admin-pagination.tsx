"use client";

import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;
type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

type ParsedParams = {
  q: string;
  category: string;
  brand: string;
  status: string;
  stockStatus: string;
  sort: string;
  page: number;
  pageSize: PageSize;
};

function buildQuery(next: Partial<ParsedParams>, current: ParsedParams) {
  const merged = { ...current, ...next };

  const query = new URLSearchParams();
  if (merged.q) query.set("q", merged.q);
  if (merged.category !== "all") query.set("category", merged.category);
  if (merged.brand !== "all") query.set("brand", merged.brand);
  if (merged.status !== "all") query.set("status", merged.status);
  if (merged.stockStatus !== "all")
    query.set("stockStatus", merged.stockStatus);
  if (merged.sort !== "recently-updated") query.set("sort", merged.sort);

  if (merged.page !== 1) query.set("page", String(merged.page));
  if (merged.pageSize !== 25)
    query.set("pageSize", String(merged.pageSize));

  const search = query.toString();
  return search ? `?${search}` : "";
}

function ProductsPagination({
  totalPages,
  currentPage,
  params,
}: {
  totalPages: number;
  currentPage: number;
  params: ParsedParams;
}) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      pages.push(i);
    }
  }

  return (
    <Pagination className="w-full md:w-auto">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={buildQuery(
              { page: Math.max(1, currentPage - 1) },
              params
            )}
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={buildQuery({ page }, params)}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href={buildQuery(
              { page: Math.min(totalPages, currentPage + 1) },
              params
            )}
            aria-disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function PageSizeSelect({ defaultValue, params }: { defaultValue: PageSize; params: ParsedParams }) {
  const router = useRouter();
  
  return (
    <Select
      defaultValue={String(defaultValue)}
      onValueChange={(value) => {
        const newParams = buildQuery({ pageSize: Number(value) as PageSize, page: 1 }, params);
        router.push(`/products${newParams}`);
      }}
    >
      <SelectTrigger size="sm">
        <SelectValue placeholder="Page size" />
      </SelectTrigger>
      <SelectContent>
        {PAGE_SIZE_OPTIONS.map((size) => (
          <SelectItem key={size} value={String(size)}>
            {size} / page
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function AdminPagination({
  total,
  startIndex,
  params,
  totalPages,
  currentPage,
}: {
  total: number;
  startIndex: number;
  params: ParsedParams;
  totalPages: number;
  currentPage: number;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-border pt-4 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
      <span>
        Showing{" "}
        <span className="font-medium text-foreground">
          {total === 0 ? 0 : startIndex + 1}-
          {Math.min(startIndex + params.pageSize, total)}
        </span>{" "}
        of <span className="font-medium text-foreground">{total}</span>{" "}
        products
      </span>
      <div className="flex items-center gap-2">
        <PageSizeSelect defaultValue={params.pageSize} params={params} />
        <ProductsPagination
          totalPages={totalPages}
          currentPage={currentPage}
          params={params}
        />
      </div>
    </div>
  );
}