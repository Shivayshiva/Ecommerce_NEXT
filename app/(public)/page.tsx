
import { CategoryGrid } from "@/components/category-grid"
import { FlashDeals } from "@/components/flash-deals"
import { ProductCarousel } from "@/components/product-carousel"
import { TrendingProducts } from "@/components/trending-products"
import { BrandShowcase } from "@/components/brand-showcase"
import { FeaturesSection } from "@/components/features-section"
import { Newsletter } from "@/components/newsletter"

export default function Home() {
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
