"use client";

import Image from "next/image";
import Link from "next/link";
import { StarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import React from "react";

interface Product {
    stock: number;
    lowStockThreshold: number;
    image: string;
    name: string;
    slug: string;
    brand: string;
    category: string;
    subcategory?: string;
    price: number;
    mrp: number;
    discountPercent: number;
    rating: number;
    ratingCount: number;
    views: number;
    orders: number;
    createdAt: string;
    status: "active" | "draft" | "inactive";
    sponsored?: boolean;
    isNew?: boolean;
}

function statusBadge(status: "active" | "draft" | "inactive") {
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

function stockBadge(product: any) {
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

export function AdminProductCard({ product, actions }: { product: any; actions?: React.ReactNode }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border-2 border-gray-280 border-border bg-card shadow-lg transition-all hover:-translate-y-2 hover:shadow-lg">
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
            <Badge className="bg-foreground/90 text-background text-[10px] px-2">AD</Badge>
          )}
          {product.isNew && (
            <Badge className="bg-accent text-accent-foreground text-[10px] px-2">NEW</Badge>
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
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{product.brand}</p>
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
          <span className="font-semibold text-foreground">₹ {product.price.toFixed(2)}</span>
          <span className="text-xs text-muted-foreground line-through">₹ {product.mrp.toFixed(2)}</span>
          <span className="text-[11px] font-medium text-emerald-400">({product.discountPercent}% OFF)</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[11px] text-emerald-300">
            <span className="font-semibold">{product.rating.toFixed(1)}</span>
            <StarIcon className="h-3 w-3 fill-current" />
            <span className="text-[10px] text-muted-foreground">({product.ratingCount})</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            {stockBadge(product)}
            <span>{product.stock} in stock</span>
          </div>
        </div>

        <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Views: <span className="font-medium">{product.views}</span></span>
          <span>Orders: <span className="font-medium">{product.orders}</span></span>
        </div>

        <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Created: {new Date(product.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">{statusBadge(product.status)}</div>
          {actions}
        </div>
      </div>
    </div>
  );
}

export default AdminProductCard;
