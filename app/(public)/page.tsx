"use client"
import { CategoryGrid } from "@/components/category-grid"
import { FlashDeals } from "@/components/flash-deals"
import { ProductCarousel } from "@/components/product-carousel"
import { TrendingProducts } from "@/components/trending-products"
import { BrandShowcase } from "@/components/brand-showcase"
import { FeaturesSection } from "@/components/features-section"
import { Newsletter } from "@/components/newsletter"

export default function Home() {

  // try{
  //   ldsjfksdfslfd
  // }
  // catch(error){
  //   throw new Error(`Syntax Error ${error}`)
  // }

  //catched by nearest error.tsx or global-error.tsx
  return (

<main className="min-h-screen bg-background">
  <CategoryGrid />
  <FlashDeals />
  <ProductCarousel title="Recommended For You" />
  <TrendingProducts />
  <BrandShowcase />
  <ProductCarousel title="Recently Viewed" />
  <FeaturesSection />
  <Newsletter />
</main>
);
}
