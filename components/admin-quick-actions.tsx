"use client";

import Link from "next/link";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { GlobalButton } from "@/components/ui/global-button";
import { cn } from "@/lib/utils";

export default function QuickActions({ product }: { product: any }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <GlobalButton variant="outline" size="sm" title="Actions" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="text-xs">{product.name}</DropdownMenuLabel>
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
