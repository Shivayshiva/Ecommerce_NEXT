"use client";

import Link from "next/link";
import { Suspense, useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { GlobalButton } from "@/components/ui/global-button";
import { GlobalTitle } from "@/components/ui/global-title";
import { Input } from "@/components/ui/input";
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
import AdminPagination from "@/components/admin-pagination";
import QuickActions from "@/components/admin-quick-actions";
import BulkActionsBar from "@/components/admin-bulk-actions-bar";
import { Card, CardContent } from "@/components/ui/card";
import AdminProductCard from "@/components/admin-product-card";

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
    createdAt: apiProduct?.createdAt ? new Date(apiProduct?.createdAt)?.toISOString() : new Date().toISOString(),
    updatedAt: apiProduct?.updatedAt ? new Date(apiProduct?.updatedAt)?.toISOString() : new Date().toISOString(),
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

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const params = parseSearchParams(Object.fromEntries(searchParams.entries()));

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
        console.log("API_Response_Response",apiProducts);

        const mapped = apiProducts?.map(mapApiProductToProduct);

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

  const brands = Array.from(new Set(allProducts.map((p: Product) => p.brand))).sort() as string[];
  const categories = Array.from(new Set(allProducts.map((p: Product) => p.category))).sort() as string[];

  return (
    <div className="space-y-6">
      <GlobalTitle
        title="Products catalogue"
        description="View, filter, and manage all onboarded products."
      >
        <>
          <GlobalButton title="Export CSV" variant="outline" size="sm" />
          <GlobalButton title="Import CSV" variant="outline" size="sm" />
          <Link href="/products/add/category">
            <GlobalButton title="+ Add product" size="sm" />
          </Link>
        </>
      </GlobalTitle>

      <Card>
        <CardContent className="space-y-4 pt-4">
          <FiltersBar
            categories={categories}
            brands={brands}
            params={params}
          />
          <BulkActionsBar />
          <ProductsGrid products={paginated} />

          <AdminPagination
            total={total}
            startIndex={startIndex}
            params={params}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function ProductsSortSelect({ defaultValue, params }: { defaultValue: string; params: ParsedParams }) {
  const router = useRouter();
  
  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(value) => {
        const newParams = buildQuery({ sort: value, page: 1 }, params);
        router.push(`/products${newParams}`);
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
          router.push(`/products${newParams}`);
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
          router.push(`/products${newParams}`);
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
          router.push(`/products${newParams}`);
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
          router.push(`/products${newParams}`);
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
          <GlobalButton
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
            title="More filters"
          />
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
          <GlobalButton
            variant="ghost"
            size="sm"
            className="ml-auto text-xs text-muted-foreground"
            title="Columns"
          />
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

  console.log("Product_Product_Product", products);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
      {products.map((product) => (
        <AdminProductCard key={product.id} product={product} actions={<QuickActions product={product} />} />
      ))}
    </div>
  );
}

// const [isLoading, setIsLoading] = useState(false);
// const [error, setError] = useState<string | null>(null);


