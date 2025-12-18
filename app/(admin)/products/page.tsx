"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState, useTransition } from "react";
import { StarIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type ProductStatus = "active" | "draft" | "inactive";

type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: string;
  subcategory?: string;
  image: string;
  price: number;
  mrp: number;
  costPrice: number;
  discountPercent: number;
  rating: number;
  ratingCount: number;
  stock: number;
  lowStockThreshold: number;
  backorder: boolean;
  status: ProductStatus;
  featured: boolean;
  bestseller: boolean;
  isNew: boolean;
  sponsored: boolean;
  views: number;
  addToCart: number;
  orders: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};

type ApiProduct = {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: string;
  subcategory?: string;
  images: string[];
  price: number;
  mrp: number;
  costPrice: number;
  discountPercent: number;
  rating: number;
  ratingCount: number;
  stock: number;
  lowStockThreshold: number;
  backorder: boolean;
  status: ProductStatus;
  featured: boolean;
  bestseller: boolean;
  isNew: boolean;
  sponsored: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
};

const DEFAULT_PAGE_SIZE = 25;
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;
type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="text-sm text-muted-foreground">Loading products…</div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}

function parseSearchParams(searchParams: Record<string, string | string[] | undefined>) {
  const q = (searchParams.q as string) ?? "";
  const category = (searchParams.category as string) ?? "all";
  const brand = (searchParams.brand as string) ?? "all";
  const status = (searchParams.status as string) ?? "all";
  const stockStatus = (searchParams.stockStatus as string) ?? "all";
  const sort = (searchParams.sort as string) ?? "recently-updated";

  const page = Math.max(1, Number(searchParams.page ?? "1") || 1);
  const pageSizeRaw = Number(searchParams.pageSize ?? DEFAULT_PAGE_SIZE);
  const pageSize: PageSize =
    (PAGE_SIZE_OPTIONS.find((opt) => opt === pageSizeRaw) ??
      DEFAULT_PAGE_SIZE) as PageSize;

  return {
    q,
    category,
    brand,
    status,
    stockStatus,
    sort,
    page,
    pageSize,
  };
}

function mapApiProductToProduct(apiProduct: ApiProduct): Product {
  return {
    id: apiProduct._id,
    name: apiProduct.name,
    slug: apiProduct.slug,
    sku: apiProduct.sku,
    brand: apiProduct.brand,
    category: apiProduct.category,
    subcategory: apiProduct.subcategory,
    image: apiProduct.images?.[0] ?? "/placeholder.png",
    price: apiProduct.price,
    mrp: apiProduct.mrp,
    costPrice: apiProduct.costPrice,
    discountPercent: apiProduct.discountPercent,
    rating: apiProduct.rating ?? 0,
    ratingCount: apiProduct.ratingCount ?? 0,
    stock: apiProduct.stock ?? 0,
    lowStockThreshold: apiProduct.lowStockThreshold ?? 0,
    backorder: apiProduct.backorder ?? false,
    status: apiProduct.status,
    featured: apiProduct.featured ?? false,
    bestseller: apiProduct.bestseller ?? false,
    isNew: apiProduct.isNew ?? false,
    sponsored: apiProduct.sponsored ?? false,
    views: 0,
    addToCart: 0,
    orders: 0,
    createdAt: new Date(apiProduct.createdAt).toISOString(),
    updatedAt: new Date(apiProduct.updatedAt).toISOString(),
    createdBy: "System",
    updatedBy: "System",
  };
}

function filterAndSortProducts(allProducts: Product[], params: ReturnType<typeof parseSearchParams>) {
  let items = [...allProducts];

  if (params.q) {
    const q = params.q.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }

  if (params.category !== "all") {
    items = items.filter((p) => p.category === params.category);
  }

  if (params.brand !== "all") {
    items = items.filter((p) => p.brand === params.brand);
  }

  if (params.status !== "all") {
    items = items.filter((p) => p.status === params.status);
  }

  if (params.stockStatus !== "all") {
    if (params.stockStatus === "low") {
      items = items.filter(
        (p) => p.stock > 0 && p.stock <= p.lowStockThreshold
      );
    } else if (params.stockStatus === "out") {
      items = items.filter((p) => p.stock === 0);
    } else if (params.stockStatus === "in") {
      items = items.filter((p) => p.stock > p.lowStockThreshold);
    }
  }

  items.sort((a, b) => {
    switch (params.sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "stock-asc":
        return a.stock - b.stock;
      case "stock-desc":
        return b.stock - a.stock;
      case "best-selling":
        return b.orders - a.orders;
      case "most-viewed":
        return b.views - a.views;
      case "highest-discount":
        return b.discountPercent - a.discountPercent;
      case "recently-added":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "recently-updated":
      default:
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    }
  });

  return items;
}

type ParsedParams = ReturnType<typeof parseSearchParams>;

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
  if (merged.pageSize !== DEFAULT_PAGE_SIZE)
    query.set("pageSize", String(merged.pageSize));

  const search = query.toString();
  return search ? `?${search}` : "";
}

function SearchInput({ defaultValue, params }: { defaultValue: string; params: ParsedParams }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const q = (formData.get("q") as string) || "";
        startTransition(() => {
          const newParams = buildQuery({ q, page: 1 }, params);
          router.push(`/(admin)/products${newParams}`);
        });
      }}
      className="inline-flex"
    >
      <Input
        placeholder="Search by name, SKU, brand…"
        defaultValue={defaultValue}
        className="h-9 w-48 md:w-64"
        name="q"
        key={defaultValue}
        disabled={isPending}
      />
    </form>
  );
}

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const params = parseSearchParams(Object.fromEntries(searchParams.entries()));

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/product");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        const apiProducts: ApiProduct[] = data.products ?? [];
        const mapped = apiProducts.map(mapApiProductToProduct);
        setAllProducts(mapped);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Could not load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filtered = filterAndSortProducts(allProducts, params);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / params.pageSize));
  const currentPage = Math.min(params.page, totalPages);
  const startIndex = (currentPage - 1) * params.pageSize;
  const paginated = filtered.slice(startIndex, startIndex + params.pageSize);

  const brands = Array.from(new Set(allProducts.map((p: Product) => p.brand))).sort();
  const categories = Array.from(new Set(allProducts.map((p: Product) => p.category))).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Products catalogue
          </h2>
          <p className="text-sm text-muted-foreground">
            View, filter, and manage all onboarded products.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            Export CSV
          </Button>
          <Button variant="outline" size="sm">
            Import CSV
          </Button>
          <Link href="/products/create">
            <Button size="sm">+ Add product</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader className="gap-4 border-b border-border">
          <CardTitle className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {total} products
              </span>
              <span className="text-xs text-muted-foreground">
                Server-side style pagination • No infinite scroll
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SearchInput defaultValue={params.q} params={params} />
              <ProductsSortSelect defaultValue={params.sort} params={params} />
              <PageSizeSelect defaultValue={params.pageSize} params={params} />
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {isLoading && (
            <div className="text-sm text-muted-foreground">
              Loading products from database...
            </div>
          )}

          {error && (
            <div className="text-sm text-destructive">
              {error}
            </div>
          )}

          <FiltersBar
            categories={categories}
            brands={brands}
            params={params}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-medium">Bulk actions</span>
              <span className="text-muted-foreground">
                Select products below to enable
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm">
                Activate
              </Button>
              <Button variant="outline" size="sm">
                Deactivate
              </Button>
              <Button variant="outline" size="sm">
                Apply discount
              </Button>
              <Button variant="outline" size="sm">
                Update stock
              </Button>
              <Button variant="outline" size="sm">
                Change category
              </Button>
              <Button variant="outline" size="sm">
                Mark featured
              </Button>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </div>
          </div>

          <ProductsGrid products={paginated} />

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
            <ProductsPagination
              totalPages={totalPages}
              currentPage={currentPage}
              params={params}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
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
        router.push(`/(admin)/products${newParams}`);
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

function ProductsSortSelect({ defaultValue, params }: { defaultValue: string; params: ParsedParams }) {
  const router = useRouter();
  
  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(value) => {
        const newParams = buildQuery({ sort: value, page: 1 }, params);
        router.push(`/(admin)/products${newParams}`);
      }}
    >
      <SelectTrigger size="sm" className="w-44">
        <SelectValue placeholder="Sort" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="recently-updated">Recently updated</SelectItem>
        <SelectItem value="recently-added">Recently added</SelectItem>
        <SelectItem value="price-asc">Price ↑</SelectItem>
        <SelectItem value="price-desc">Price ↓</SelectItem>
        <SelectItem value="stock-asc">Stock ↑</SelectItem>
        <SelectItem value="stock-desc">Stock ↓</SelectItem>
        <SelectItem value="best-selling">Best selling</SelectItem>
        <SelectItem value="most-viewed">Most viewed</SelectItem>
        <SelectItem value="highest-discount">Highest discount</SelectItem>
      </SelectContent>
    </Select>
  );
}

function FiltersBar({
  categories,
  brands,
  params,
}: {
  categories: string[];
  brands: string[];
  params: ParsedParams;
}) {
  const router = useRouter();
  
  return (
    <div className="sticky top-4 z-10 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card/90 px-3 py-2 backdrop-blur shadow-sm">
      <span className="text-xs font-medium text-muted-foreground">
        Filters
      </span>
      <Select
        defaultValue={params.category}
        onValueChange={(value) => {
          const newParams = buildQuery({ category: value, page: 1 }, params);
          router.push(`/(admin)/products${newParams}`);
        }}
      >
        <SelectTrigger size="sm" className="w-40">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={params.brand}
        onValueChange={(value) => {
          const newParams = buildQuery({ brand: value, page: 1 }, params);
          router.push(`/(admin)/products${newParams}`);
        }}
      >
        <SelectTrigger size="sm" className="w-40">
          <SelectValue placeholder="Brand" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All brands</SelectItem>
          {brands.map((b) => (
            <SelectItem key={b} value={b}>
              {b}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={params.status}
        onValueChange={(value) => {
          const newParams = buildQuery({ status: value, page: 1 }, params);
          router.push(`/(admin)/products${newParams}`);
        }}
      >
        <SelectTrigger size="sm" className="w-36">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue={params.stockStatus}
        onValueChange={(value) => {
          const newParams = buildQuery({ stockStatus: value, page: 1 }, params);
          router.push(`/(admin)/products${newParams}`);
        }}
      >
        <SelectTrigger size="sm" className="w-40">
          <SelectValue placeholder="Stock" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All stock</SelectItem>
          <SelectItem value="in">In stock</SelectItem>
          <SelectItem value="low">Low stock</SelectItem>
          <SelectItem value="out">Out of stock</SelectItem>
        </SelectContent>
      </Select>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
          >
            More filters
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          <DropdownMenuLabel>Advanced filters</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex flex-col items-start gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              Discount
            </span>
            <span className="text-[11px] text-muted-foreground">
              0–100% (configure in future)
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              Rating
            </span>
            <span className="text-[11px] text-muted-foreground">
              Filter by average rating
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              Created / Updated
            </span>
            <span className="text-[11px] text-muted-foreground">
              Add date range pickers later
            </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Saved filter: <span className="ml-1 font-medium">Low stock</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-xs text-muted-foreground"
          >
            Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>Column visibility</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Pricing</DropdownMenuItem>
          <DropdownMenuItem>Inventory</DropdownMenuItem>
          <DropdownMenuItem>Status & flags</DropdownMenuItem>
          <DropdownMenuItem>Performance</DropdownMenuItem>
          <DropdownMenuItem>Audit trail</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function statusBadge(status: ProductStatus) {
  if (status === "active") {
    return (
      <Badge variant="secondary" className="border-emerald-500/40 bg-emerald-500/15 text-emerald-300">
        <span className="mr-1.5 inline-block size-2 rounded-full bg-emerald-400" />
        Active
      </Badge>
    );
  }
  if (status === "draft") {
    return (
      <Badge variant="secondary" className="border-amber-500/40 bg-amber-500/15 text-amber-200">
        <span className="mr-1.5 inline-block size-2 rounded-full bg-amber-300" />
        Draft
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="border-rose-500/40 bg-rose-500/15 text-rose-200">
      <span className="mr-1.5 inline-block size-2 rounded-full bg-rose-300" />
      Inactive
    </Badge>
  );
}

function stockBadge(product: Product) {
  if (product.stock === 0) {
    return (
      <Badge variant="destructive" className="bg-rose-600/80 text-xs">
        Out of stock
      </Badge>
    );
  }
  if (product.stock > 0 && product.stock <= product.lowStockThreshold) {
    return (
      <Badge
        variant="outline"
        className="border-amber-500/60 bg-amber-500/10 text-xs text-amber-100"
      >
        Low stock
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="border-emerald-500/40 bg-emerald-500/10 text-xs text-emerald-100"
    >
      In stock
    </Badge>
  );
}

// Reserved for future use when flag chips are needed in the grid view.
// function flagBadges(product: Product) {
//   const flags: string[] = [];
//   if (product.featured) flags.push("⭐ Featured");
//   if (product.bestseller) flags.push("🔥 Bestseller");
//   if (product.isNew) flags.push("🆕 New");
//   if (product.sponsored) flags.push("Sponsored");
// 
//   if (!flags.length) return null;
// 
//   return (
//     <div className="flex flex-wrap gap-1 text-[11px] text-muted-foreground">
//       {flags.map((f) => (
//         <Badge
//           key={f}
//           variant="outline"
//           className="border-border/60 bg-muted/70"
//         >
//           {f}
//         </Badge>
//       ))}
//     </div>
//   );
// }

function ProductsGrid({ products }: { products: Product[] }) {
  const hasProducts = products.length > 0;

  if (!hasProducts) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-6 py-10 text-center">
        <p className="text-sm font-medium text-foreground">
          No products found for the current filters.
        </p>
        <p className="text-xs text-muted-foreground">
          Try changing filters or search keywords.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="relative aspect-3/4 w-full overflow-hidden bg-muted">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1280px) 260px, (min-width: 1024px) 220px, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute left-2 top-2 flex flex-col gap-1">
              {product.sponsored && (
                <Badge className="bg-foreground/90 text-background text-[10px] px-2">
                  AD
                </Badge>
              )}
              {product.isNew && (
                <Badge className="bg-accent text-accent-foreground text-[10px] px-2">
                  NEW
                </Badge>
              )}
              {product.discountPercent > 0 && (
                <Badge className="bg-destructive text-destructive-foreground text-[10px] px-2">
                  {product.discountPercent}% OFF
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2 p-3">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {product.brand}
              </p>
              <Link
                href={`/products/${product.slug}`}
                className="line-clamp-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary"
              >
                {product.name}
              </Link>
              <p className="line-clamp-1 text-xs text-muted-foreground">
                {product.category}
                {product.subcategory ? ` • ${product.subcategory}` : ""}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-foreground">
                ₹ {product.price.toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground line-through">
                ₹ {product.mrp.toFixed(2)}
              </span>
              <span className="text-[11px] font-medium text-emerald-400">
                ({product.discountPercent}% OFF)
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[11px] text-emerald-300">
                <span className="font-semibold">
                  {product.rating.toFixed(1)}
                </span>
                <StarIcon className="h-3 w-3 fill-current" />
                <span className="text-[10px] text-muted-foreground">
                  ({product.ratingCount})
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                {stockBadge(product)}
                <span>{product.stock} in stock</span>
              </div>
            </div>

            <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>
                Views: <span className="font-medium">{product.views}</span>
              </span>
              <span>
                Orders: <span className="font-medium">{product.orders}</span>
              </span>
            </div>

            <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>
                Created:{" "}
                {new Date(product.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {statusBadge(product.status)}
              </div>
              <QuickActions product={product} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function QuickActions({ product }: { product: Product }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="text-xs">
          {product.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/products/${product.id}/edit`}>✏️ Edit</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/product/${product.slug}`}>👁 Preview</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>📋 Duplicate</DropdownMenuItem>
        <DropdownMenuItem>📊 View analytics</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-rose-400" asChild>
          <button
            type="button"
            className={cn(
              "w-full cursor-pointer text-left text-rose-400",
              "hover:text-rose-300"
            )}
          >
            🗑 Delete
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


