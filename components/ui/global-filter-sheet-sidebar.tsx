import { SlidersHorizontal } from "lucide-react"

import { GlobalButton } from "@/components/ui/global-button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"

interface GlobalFilterSheetSidebarProps {
  brands: string[]
  priceRange: [number, number]
  selectedBrands: string[]
  inStockOnly: boolean
  onSaleOnly: boolean
  onPriceRangeChange: (value: [number, number]) => void
  onBrandToggle: (brand: string) => void
  onInStockToggle: (checked: boolean) => void
  onSaleToggle: (checked: boolean) => void
  onClearFilters: () => void
}

export function GlobalFilterSheetSidebar({
  brands,
  priceRange,
  selectedBrands,
  inStockOnly,
  onSaleOnly,
  onPriceRangeChange,
  onBrandToggle,
  onInStockToggle,
  onSaleToggle,
  onClearFilters,
}: GlobalFilterSheetSidebarProps) {
  const activeFiltersCount =
    (selectedBrands.length > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (onSaleOnly ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 50000 ? 1 : 0)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="relative">
          <GlobalButton
            title="Filters"
            icon={<SlidersHorizontal className="h-4 w-4" />}
            variant="outline"
            size="sm"
          />
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Refine your search to find the perfect products.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Price Range */}
          <div>
            <Label className="text-sm font-medium">Price Range</Label>
            <div className="mt-3 px-2">
              <Slider
                value={priceRange}
                onValueChange={onPriceRangeChange}
                max={50000}
                min={0}
                step={500}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>₹{priceRange[0].toLocaleString()}</span>
                <span>₹{priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Brands */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Brands</Label>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={brand}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() => onBrandToggle(brand)}
                  />
                  <Label htmlFor={brand} className="text-sm">
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Other Filters */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={inStockOnly}
                onCheckedChange={onInStockToggle}
              />
              <Label htmlFor="in-stock" className="text-sm">
                In Stock Only
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="on-sale"
                checked={onSaleOnly}
                onCheckedChange={onSaleToggle}
              />
              <Label htmlFor="on-sale" className="text-sm">
                On Sale Only
              </Label>
            </div>
          </div>

          <Separator />

          <GlobalButton
            title="Clear All Filters"
            onClick={onClearFilters}
            variant="outline"
            className="w-full"
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}