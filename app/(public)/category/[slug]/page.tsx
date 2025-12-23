"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Grid3X3, List } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { GlobalButton } from "@/components/ui/global-button"
import { GlobalSelectField } from "@/components/ui/global-select-field"
import { GlobalFilterSheetSidebar } from "@/components/ui/global-filter-sheet-sidebar"
import { GlobalTitle } from "@/components/ui/global-title"

interface Product {
  _id: string
  name: string
  slug: string
  sku: string
  brand: string
  category: string
  subcategory?: string
  images: string[]
  price: number
  mrp: number
  costPrice: number
  discountPercent: number
  rating: number
  ratingCount: number
  stock: number
  lowStockThreshold: number
  backorder: boolean
  status: "active" | "draft" | "inactive"
  featured: boolean
  bestseller: boolean
  isNew: boolean
  sponsored: boolean
  flashDeal?: {
    isActive: boolean
    dealPrice?: number
    discountPercent?: number
    startAt?: Date
    endAt?: Date
    maxQuantity?: number
    soldQuantity: number
    priority: number
    createdBy?: string
  }
  trending?: {
    isTrending: boolean
    score: number
    reason?: string
    validTill?: Date
    priority: number
  }
  salesMetrics?: {
    views: number
    purchases: number
    conversionRate: number
    revenue: number
  }
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
  }
  createdAt: string
  updatedAt: string
}

type ViewMode = "grid" | "list"
type SortOption = "newest" | "price-low" | "price-high" | "rating" | "popular"

export default function CategoryPage() {
  const params = useParams()
  const categorySlug = params.slug as string

  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortBy, setSortBy] = useState<SortOption>("newest")

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [onSaleOnly, setOnSaleOnly] = useState(false)

  // Get unique brands from products
  const brands = Array.from(new Set(products.map(p => p.brand))).sort()

  useEffect(() => {
    fetchProducts()
  }, [categorySlug])

  useEffect(() => {
    applyFilters()
  }, [products, priceRange, selectedBrands, inStockOnly, onSaleOnly, sortBy])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/product?category=${encodeURIComponent(categorySlug)}`)
      if (!response.ok) throw new Error("Failed to fetch products")

      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Price filter
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand))
    }

    // Stock filter
    if (inStockOnly) {
      filtered = filtered.filter(p => p.stock > 0)
    }

    // Sale filter
    if (onSaleOnly) {
      filtered = filtered.filter(p => p.discountPercent > 0)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "popular":
          return (b.salesMetrics?.purchases || 0) - (a.salesMetrics?.purchases || 0)
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    setFilteredProducts(filtered)
  }

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    )
  }

  const clearFilters = () => {
    setPriceRange([0, 50000])
    setSelectedBrands([])
    setInStockOnly(false)
    setOnSaleOnly(false)
  }

  const categoryName = categorySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <GlobalTitle
              title={categoryName}
              description={`${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'} found`}
            />

            <div className="flex items-center gap-4">
              {/* Sort */}
              <GlobalSelectField
                value={sortBy}
                onValueChange={(value: SortOption) => setSortBy(value)}
                placeholder="Sort by"
                options={[
                  { value: "newest", label: "Newest First" },
                  { value: "price-low", label: "Price: Low to High" },
                  { value: "price-high", label: "Price: High to Low" },
                  { value: "rating", label: "Highest Rated" },
                  { value: "popular", label: "Most Popular" },
                ]}
                className="w-[180px]"
              />

              {/* View Mode */}
              <div className="flex items-center border rounded-lg">
                <GlobalButton
                  title=""
                  icon={<Grid3X3 className="h-4 w-4" />}
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                />
                <GlobalButton
                  title=""
                  icon={<List className="h-4 w-4" />}
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                />
              </div>

              {/* Filters Sheet */}
              <GlobalFilterSheetSidebar
                brands={brands}
                priceRange={priceRange}
                selectedBrands={selectedBrands}
                inStockOnly={inStockOnly}
                onSaleOnly={onSaleOnly}
                onPriceRangeChange={setPriceRange}
                onBrandToggle={handleBrandToggle}
                onInStockToggle={setInStockOnly}
                onSaleToggle={setOnSaleOnly}
                onClearFilters={clearFilters}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg mb-2">No products found</div>
            <p className="text-muted-foreground">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                : "space-y-4"
            }
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard
                  product={{
                    id: product?._id,
                    name: product.name,
                    brand: product.brand,
                    price: product.price,
                    originalPrice: product.mrp,
                    image: product.images[0] || "/placeholder-product.jpg",
                    rating: product.rating,
                    reviews: product.ratingCount,
                    stock: product.stock,
                    isNew: product.isNew,
                    category: product.category,
                    discount: product.discountPercent,
                  }}
                  index={index}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}