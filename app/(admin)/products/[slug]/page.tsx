"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { GlobalButton } from "@/components/ui/global-button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type ProductStatus = "active" | "draft" | "inactive";

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

type Product = ApiProduct & {
  id: string;
};

export default function AdminProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/product/${params.slug}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();
        const found: ApiProduct | null = data.product ?? null;

        if (!found || found.slug !== params.slug) {
          setError("Product not found");
          setProduct(null);
          return;
        }

        setProduct({
          ...found,
          id: found._id,
        });
      } catch (err) {
        console.error("Error fetching product detail:", err);
        setError("Could not load product. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (params?.slug) {
      fetchProduct();
    }
  }, [params?.slug]);

  const metrics = useMemo(() => {
    if (!product) return null;

    const profitAmount = product.price - product.costPrice;
    const profitMarginPercent =
      product.costPrice > 0 ? (profitAmount / product.costPrice) * 100 : 0;

    const stockHealth =
      product.stock === 0
        ? "Out of stock"
        : product.stock <= (product.lowStockThreshold ?? 0)
        ? "Low"
        : "Healthy";

    return {
      profitAmount,
      profitMarginPercent,
      stockHealth,
    };
  }, [product]);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl space-y-4 py-8">
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        <div className="h-72 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto max-w-2xl space-y-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-foreground">
          Product detail
        </h1>
        <p className="text-sm text-muted-foreground">
          {error ?? "Product not found."}
        </p>
        <GlobalButton
          className="mt-4"
          variant="outline"
          onClick={() => router.push("/(admin)/products")}
        >
          Back to products
        </GlobalButton>
      </div>
    );
  }

  const images = product.images ?? [];
  const safeSelectedIndex =
    selectedImageIndex >= 0 && selectedImageIndex < images.length
      ? selectedImageIndex
      : 0;
  const mainImage = images[safeSelectedIndex];

  return (
    <div className="container mx-auto max-w-6xl space-y-6 ">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>Admin</span>
            <span>/</span>
            <Link
              href="/(admin)/products"
              className="hover:text-foreground underline-offset-4 hover:underline"
            >
              Products
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
          <h1 className="text-2xl font-semibold leading-tight text-foreground">
            {product.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>SKU: {product.sku}</span>
            <Separator orientation="vertical" className="mx-1 h-3" />
            <span>Slug: {product.slug}</span>
            <Separator orientation="vertical" className="mx-1 h-3" />
            <span>Brand: {product.brand}</span>
            <Separator orientation="vertical" className="mx-1 h-3" />
            <span>
              {product.category}
              {product.subcategory ? ` • ${product.subcategory}` : ""}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={product.status} />
          {product.featured && (
            <Badge variant="outline" className="text-xs">
              Featured
            </Badge>
          )}
          {product.bestseller && (
            <Badge variant="outline" className="text-xs">
              Bestseller
            </Badge>
          )}
          {product.isNew && (
            <Badge variant="outline" className="text-xs">
              New
            </Badge>
          )}
          {product.sponsored && (
            <Badge variant="outline" className="text-xs">
              Sponsored
            </Badge>
          )}
          <Separator orientation="vertical" className="mx-1 hidden h-5 sm:block" />
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/products/${product._id}/edit`}>
              <GlobalButton variant="outline" size="sm">
                Edit
              </GlobalButton>
            </Link>
            <Link href={`/product/${product.slug}`}>
              <GlobalButton variant="outline" size="sm">
                View customer page
              </GlobalButton>
            </Link>
            <GlobalButton variant="outline" size="sm">
              Duplicate
            </GlobalButton>
            <GlobalButton variant="destructive" size="sm">
              Delete
            </GlobalButton>
          </div>
        </div>
      </div>

      {/* Top snapshot */}
      <div className="grid grid-cols-[1.2fr,2.8fr] gap-x-2">
        {/* Images / media */}
        <Card className="overflow-hidden max-w-md">
          <CardHeader>
            <CardTitle className="text-sm">Product media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 360px, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  No image
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={cn(
                      "relative h-14 w-16 shrink-0 overflow-hidden rounded-md border bg-muted transition",
                      safeSelectedIndex === idx
                        ? "border-primary ring-1 ring-primary"
                        : "border-border hover:border-primary/60"
                    )}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Price, stock & health snapshot */}
        <Card>
          <CardHeader>
            <CardTitle className="text-md">
              Price, stock & health snapshot
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 md:grid-cols-2">
            {/* Pricing highlight card */}
            <div className="space-y-3 rounded-lg border border-primary/60 bg-muted/60 p-3 shadow-sm">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                Pricing overview
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline justify-between rounded-md bg-background/80 px-3 py-2">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      Selling price
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Main price customers pay
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-foreground">
                    ₹ {product.price.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-md bg-background/80 px-3 py-2 text-xs">
                  <div className="flex flex-col">
                    <span className="font-medium text-muted-foreground">
                      MRP
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Listed maximum retail price
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-medium text-foreground">
                      ₹ {product.mrp.toFixed(2)}
                    </span>
                    <span className="mt-0.5 rounded-full bg-emerald-950/50 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                      {product.discountPercent}% OFF
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-md bg-background/80 px-3 py-2 text-xs">
                  <div className="flex flex-col">
                    <span className="font-medium text-muted-foreground">
                      Cost price
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Your purchase cost per unit
                    </span>
                  </div>
                  <span className="font-semibold text-foreground">
                    ₹ {product.costPrice.toFixed(2)}
                  </span>
                </div>

                {metrics && (
                  <div className="flex items-center justify-between rounded-md bg-emerald-950/40 px-3 py-2 text-xs">
                    <div className="flex flex-col">
                      <span className="font-medium text-emerald-200">
                        Profit margin
                      </span>
                      <span className="text-[11px] text-emerald-100/80">
                        Per unit margin based on current price
                      </span>
                    </div>
                    <span className="text-right text-xs font-semibold text-emerald-300">
                      ₹ {metrics.profitAmount.toFixed(2)} (
                      {metrics.profitMarginPercent.toFixed(1)}%)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Inventory highlight card */}
            <div className="space-y-3 rounded-lg border border-primary/60 bg-muted/60 p-3 shadow-sm">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                Inventory overview
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md bg-background/80 px-3 py-2">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      Current stock
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Available sellable units
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xl font-semibold text-foreground">
                      {product.stock} units
                    </span>
                    <StockBadge product={product} />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-md bg-background/80 px-3 py-2 text-xs">
                  <div className="flex flex-col">
                    <span className="font-medium text-muted-foreground">
                      Low stock threshold
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Alert level for replenishment
                    </span>
                  </div>
                  <span className="rounded-full bg-amber-950/40 px-3 py-1 text-xs font-semibold text-amber-200">
                    {product.lowStockThreshold}
                  </span>
                </div>

                {metrics && (
                  <div className="flex items-center justify-between rounded-md bg-background/80 px-3 py-2 text-xs">
                    <div className="flex flex-col">
                      <span className="font-medium text-muted-foreground">
                        Stock health
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Overall inventory risk level
                      </span>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        metrics.stockHealth === "Healthy" &&
                          "bg-emerald-950/40 text-emerald-300",
                        metrics.stockHealth === "Low" &&
                          "bg-amber-950/40 text-amber-300",
                        metrics.stockHealth === "Out of stock" &&
                          "bg-rose-950/40 text-rose-300"
                      )}
                    >
                      {metrics.stockHealth}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between rounded-md bg-background/80 px-3 py-2 text-xs">
                  <div className="flex flex-col">
                    <span className="font-medium text-muted-foreground">
                      Backorder
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Allow sales when stock is zero
                    </span>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      product.backorder
                        ? "bg-emerald-950/40 text-emerald-300"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {product.backorder ? "Allowed" : "Not allowed"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for deeper insights */}
      <Tabs defaultValue="content" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="content">Content details</TabsTrigger>
          <TabsTrigger value="insights">Sales & performance</TabsTrigger>
          <TabsTrigger value="reviews">Ratings & reviews</TabsTrigger>
          <TabsTrigger value="seo">SEO & discoverability</TabsTrigger>
          <TabsTrigger value="compliance">Compliance & policy</TabsTrigger>
          <TabsTrigger value="audit">Audit & activity log</TabsTrigger>
          <TabsTrigger value="ai">AI & smart insights</TabsTrigger>
        </TabsList>

        {/* 3. PRODUCT CONTENT DETAILS */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Product content details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 text-sm">
                <div>
                  <div className="text-xs font-medium text-muted-foreground">
                    Product title
                  </div>
                  <div className="font-medium text-foreground">
                    {product.name}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground">
                    Slug
                  </div>
                  <div className="text-xs font-mono text-foreground">
                    {product.slug}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground">
                    Category
                  </div>
                  <div className="text-xs text-foreground">
                    {product.category}
                    {product.subcategory ? ` • ${product.subcategory}` : ""}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="rounded-md border border-dashed border-border bg-muted/40 p-3">
                  <div className="mb-1 text-xs font-medium text-foreground">
                    Description
                  </div>
                  <p>
                    Detailed product description is not captured in the current
                    schema. You can extend the product model to store HTML
                    description, bullet points and technical specifications.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5 & 6. SALES & PERFORMANCE / CUSTOMER BEHAVIOUR */}
        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Sales & customer behaviour insights
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <InsightStat label="Total orders" value="—" helper="Connect orders data source" />
              <InsightStat label="Units sold" value="—" helper="Connect orders data source" />
              <InsightStat label="Total revenue" value="—" helper="Connect orders data source" />
              <InsightStat label="Product views" value="—" helper="Track analytics events" />
              <InsightStat label="Add-to-cart count" value="—" helper="Track analytics events" />
              <InsightStat label="Wishlist count" value="—" helper="Track wishlist events" />
              <InsightStat label="Bounce rate" value="—" helper="Integrate with analytics tool" />
              <InsightStat label="Return count" value="—" helper="Connect returns module" />
              <InsightStat label="Cancellation rate" value="—" helper="Connect orders data source" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 7. RATINGS & REVIEWS */}
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Ratings & reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-end gap-6">
                <div>
                  <div className="text-xs text-muted-foreground">
                    Average rating
                  </div>
                  <div className="text-3xl font-semibold text-foreground">
                    {product.rating.toFixed(1)}
                    <span className="ml-1 text-sm text-muted-foreground">
                      /5
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {product.ratingCount} reviews
                  </div>
                </div>
                <div className="rounded-md border border-dashed border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                  Review sentiment, flagged reviews and admin replies are not
                  yet wired. Hook this card to your reviews collection / API to
                  display distribution and manage moderation.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 9. SEO & DISCOVERABILITY */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                SEO & discoverability
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="rounded-md border border-dashed border-border bg-muted/40 p-3">
                  <div className="mb-1 text-xs font-medium text-foreground">
                    Meta title / description
                  </div>
                  <p>
                    SEO fields are not stored yet. Extend the product schema
                    with `metaTitle`, `metaDescription`, `metaKeywords` and
                    render them here with an OpenGraph preview.
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="rounded-md border border-dashed border-border bg-muted/40 p-3">
                  <div className="mb-1 text-xs font-medium text-foreground">
                    SEO health score
                  </div>
                  <p>
                    Once SEO data is available you can compute a health score
                    based on title length, alt text coverage, and keyword
                    usage.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 10. COMPLIANCE & POLICY */}
        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Compliance & policy
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="rounded-md border border-dashed border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                <div className="mb-1 text-xs font-medium text-foreground">
                  Regulatory information
                </div>
                <p>
                  Compliance attributes like GST/HSN, FSSAI, BIS, safety
                  warnings and age restriction are not yet modelled. Add them to
                  your product schema and surface validation status here.
                </p>
              </div>
              <div className="rounded-md border border-dashed border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                <div className="mb-1 text-xs font-medium text-foreground">
                  Compliance status
                </div>
                <p>
                  You can compute a compliance score or show missing compliance
                  alerts once the data model is in place.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 12. AUDIT & ACTIVITY LOG */}
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Audit & activity log
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-muted-foreground">
              <div className="flex flex-wrap gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-wide">
                    Created at
                  </div>
                  <div className="font-medium text-foreground">
                    {new Date(product.createdAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wide">
                    Last updated
                  </div>
                  <div className="font-medium text-foreground">
                    {new Date(product.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="rounded-md border border-dashed border-border bg-muted/40 p-3">
                Detailed change history, approvers and status timeline are not
                yet tracked. Connect this section to your audit log / events
                collection to visualise the full lifecycle of this product.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 13. AI & SMART INSIGHTS */}
        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">AI & smart insights</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 text-xs text-muted-foreground">
              <div className="rounded-md border border-dashed border-border bg-muted/40 p-3">
                <div className="mb-1 text-xs font-medium text-foreground">
                  Price optimisation suggestions
                </div>
                <p>
                  Use historical sales, views and competitor pricing to suggest
                  optimal price ranges for this product.
                </p>
              </div>
              <div className="rounded-md border border-dashed border-border bg-muted/40 p-3">
                <div className="mb-1 text-xs font-medium text-foreground">
                  Stock reorder prediction
                </div>
                <p>
                  Combine stock velocity with lead time to predict when this
                  product should be reordered.
                </p>
              </div>
              <div className="rounded-md border border-dashed border-border bg-muted/40 p-3">
                <div className="mb-1 text-xs font-medium text-foreground">
                  Content improvement & keywords
                </div>
                <p>
                  Once descriptions are stored, this card can propose better
                  copy, missing attributes and high-intent keywords.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatusBadge({ status }: { status: ProductStatus }) {
  if (status === "active") {
    return (
      <Badge className="border-emerald-500/40 bg-emerald-500/15 text-emerald-300">
        <span className="mr-1.5 inline-block size-2 rounded-full bg-emerald-400" />
        Active
      </Badge>
    );
  }
  if (status === "draft") {
    return (
      <Badge className="border-amber-500/40 bg-amber-500/15 text-amber-200">
        <span className="mr-1.5 inline-block size-2 rounded-full bg-amber-300" />
        Draft
      </Badge>
    );
  }
  return (
    <Badge className="border-rose-500/40 bg-rose-500/15 text-rose-200">
      <span className="mr-1.5 inline-block size-2 rounded-full bg-rose-300" />
      Inactive
    </Badge>
  );
}

function StockBadge({ product }: { product: Pick<Product, "stock" | "lowStockThreshold"> }) {
  if (product.stock === 0) {
    return (
      <Badge variant="destructive" className="bg-rose-600/80 text-[11px]">
        Out of stock
      </Badge>
    );
  }
  if (product.stock > 0 && product.stock <= (product.lowStockThreshold ?? 0)) {
    return (
      <Badge
        variant="outline"
        className="border-amber-500/60 bg-amber-500/10 text-[11px] text-amber-100"
      >
        Low stock
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="border-emerald-500/40 bg-emerald-500/10 text-[11px] text-emerald-100"
    >
      In stock
    </Badge>
  );
}

function InsightStat({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <div className="space-y-1 rounded-lg border border-dashed border-border bg-muted/30 p-3 text-xs">
      <div className="text-[11px] font-medium text-muted-foreground">
        {label}
      </div>
      <div className="text-lg font-semibold text-foreground">{value}</div>
      {helper && (
        <div className="text-[11px] text-muted-foreground/80">{helper}</div>
      )}
    </div>
  );
}


