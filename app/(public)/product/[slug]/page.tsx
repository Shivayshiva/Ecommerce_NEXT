"use client"

import { useMemo } from "react"
import { notFound, useParams } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  CheckCircle2,
  ChevronRight,
  Heart,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react"

import { products } from "@/lib/data"
import { useCartStore, useWishlistStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCarousel } from "@/components/product-carousel"

export default function ProductPage() {
  const params = useParams()
  const productId = useMemo(
    () => Number((params as { product?: string })?.product),
    [params],
  )

  const product = useMemo(
    () => products.find((p) => p.id === productId),
    [productId],
  )

  const { addItem } = useCartStore()
  const { toggleWishlist, isInWishlist } = useWishlistStore()

  if (!product) {
    notFound()
  }

  const inWishlist = isInWishlist(product.id)
  const discount = Math.round((1 - product.price / product.originalPrice) * 100)

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-10 pt-6 md:px-6 lg:flex-row lg:pt-10">
        {/* Left column – gallery */}
        <div className="flex w-full flex-1 flex-col gap-4 lg:max-w-[460px]">
          <Card className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative h-full w-full"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>

              {discount > 0 && (
                <Badge className="absolute left-4 top-4 rounded-full bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground shadow-md">
                  {discount}% OFF
                </Badge>
              )}

              {product.isNew && (
                <Badge
                  variant="secondary"
                  className="absolute left-4 top-14 rounded-full bg-accent px-3 py-1 text-xs font-semibold"
                >
                  New Arrival
                </Badge>
              )}

              <Button
                size="icon"
                variant="outline"
                className="absolute right-4 top-4 h-10 w-10 rounded-full border-border/80 bg-background/80 backdrop-blur shadow-lg"
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart
                  className={`h-5 w-5 transition-colors ${
                    inWishlist
                      ? "fill-destructive text-destructive"
                      : "text-muted-foreground"
                  }`}
                />
              </Button>
            </div>
          </Card>

          <Card className="hidden items-center justify-between gap-4 rounded-2xl border border-dashed border-border/70 bg-muted/40 px-4 py-3 text-xs text-muted-foreground sm:flex">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              <span>
                Free delivery on orders over{" "}
                <span className="font-semibold text-foreground">$499</span>
              </span>
            </div>
            <Separator orientation="vertical" className="h-5" />
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Secure payments & 10-day replacement</span>
            </div>
          </Card>
        </div>

        {/* Right column – details */}
        <div className="flex w-full flex-[1.4] flex-col gap-4">
          {/* Breadcrumb */}
          <Breadcrumb className="hidden text-xs text-muted-foreground/90 md:block">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-3 w-3" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="/#products">Products</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-3 w-3" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="max-w-[280px] truncate">
                  {product.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Title & rating */}
          <div className="space-y-3 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="rounded-full border-primary/40 bg-primary/5 text-[11px] font-semibold uppercase tracking-wide text-primary"
              >
                {product.brand}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Official Store
              </span>
            </div>
            <h1 className="text-xl font-semibold leading-snug text-foreground md:text-2xl">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-emerald-600 dark:text-emerald-400">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="text-xs font-semibold text-foreground">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  ({product.reviews.toLocaleString()} ratings)
                </span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                <span>10K+ bought in last month</span>
              </div>
            </div>
          </div>

          {/* Pricing & actions */}
          <Card className="space-y-4 rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm backdrop-blur">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  {discount > 0 && (
                    <Badge className="rounded-full bg-emerald-500/15 px-2 py-0 text-[11px] font-semibold text-emerald-500">
                      -{discount}% today
                    </Badge>
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-foreground">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Inclusive of all taxes
                  </span>
                </div>
                <p className="text-xs text-emerald-500">
                  You save $
                  {(product.originalPrice - product.price).toFixed(2)} on this
                  order
                </p>
              </div>

              <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
                <span className="rounded-full bg-muted/80 px-3 py-1 text-[11px] font-medium uppercase tracking-wide">
                  In stock
                </span>
                {product.stock < 10 && (
                  <span className="text-[11px] font-medium text-destructive">
                    Hurry, only {product.stock} left!
                  </span>
                )}
              </div>
            </div>

            <Separator />

            <div className="flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="flex-1 gap-2 rounded-full bg-primary px-6 py-5 text-sm font-semibold shadow-lg shadow-primary/30 hover:bg-primary/90"
                onClick={() => addItem(product)}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 gap-2 rounded-full border-primary/40 bg-primary/5 px-6 py-5 text-sm font-semibold text-primary hover:bg-primary/10"
              >
                <ShoppingBag className="h-4 w-4" />
                Buy Now
              </Button>
            </div>

            <div className="grid gap-4 pt-2 text-xs text-muted-foreground sm:grid-cols-2">
              <div className="flex items-start gap-2 rounded-xl bg-muted/60 p-3">
                <Truck className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Free Delivery</p>
                  <p>Delivery by tomorrow 8 AM – 12 PM to your location.</p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-xl bg-muted/60 p-3">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Deliver to</p>
                  <p>Your saved address • 110092</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs: description / offers / policies */}
          <Tabs defaultValue="description" className="mt-2">
            <TabsList className="h-10 rounded-full bg-muted/80 p-1">
              <TabsTrigger value="description" className="rounded-full px-4 text-xs">
                Description
              </TabsTrigger>
              <TabsTrigger value="offers" className="rounded-full px-4 text-xs">
                Offers
              </TabsTrigger>
              <TabsTrigger value="policies" className="rounded-full px-4 text-xs">
                Policies
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <Card className="space-y-2 rounded-2xl border border-border/70 bg-card/80 p-4 text-xs text-muted-foreground">
                <p>
                  Experience a premium crafted product designed for modern
                  lifestyles. Perfect for home, office, or gifting, with
                  attention to detail and reliable performance.
                </p>
                <ul className="grid list-disc gap-1 pl-5 sm:grid-cols-2">
                  <li>Premium build quality and elegant design</li>
                  <li>Backed by official brand warranty</li>
                  <li>Engineered for long-lasting performance</li>
                  <li>Easy returns and dedicated support</li>
                </ul>
              </Card>
            </TabsContent>
            <TabsContent value="offers" className="mt-4">
              <Card className="space-y-3 rounded-2xl border border-border/70 bg-card/80 p-4 text-xs text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Badge
                    variant="outline"
                    className="mt-0.5 rounded-full border-amber-500/40 bg-amber-500/10 text-[10px] font-semibold text-amber-600"
                  >
                    Bank Offer
                  </Badge>
                  <p>
                    10% instant discount up to $50 on credit card payments.{" "}
                    <span className="cursor-pointer text-primary">T&amp;C</span>
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge
                    variant="outline"
                    className="mt-0.5 rounded-full border-emerald-500/40 bg-emerald-500/10 text-[10px] font-semibold text-emerald-600"
                  >
                    Combo Offer
                  </Badge>
                  <p>
                    Buy 2 &amp; get extra 5% off on this product. Add items to
                    cart to see the offer applied.
                  </p>
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="policies" className="mt-4">
              <Card className="space-y-2 rounded-2xl border border-border/70 bg-card/80 p-4 text-xs text-muted-foreground">
                <p>
                  Return window of 10 days from the date of delivery.
                  Replacement or full refund available for eligible issues.
                </p>
                <p className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Secure payments powered by industry-standard encryption.
                </p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Related products */}
      <section className="mx-auto mb-16 mt-2 w-full max-w-6xl px-4 md:px-6">
        <ProductCarousel title="You might also like" />
      </section>
    </main>
  )
}


