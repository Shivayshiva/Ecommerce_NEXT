"use client"

import { motion } from "framer-motion"
import { Heart, Eye, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCartStore, useQuickViewStore, useWishlistStore } from "@/lib/store"
import type { Product } from "@/lib/data"

interface ProductCardProps {
  product: Product
  index?: number
  isFlashDeal?: boolean
}

export function ProductCard({ product, index = 0, isFlashDeal }: ProductCardProps) {
  const { addItem } = useCartStore()
  const { openQuickView } = useQuickViewStore()
  const { toggleWishlist, isInWishlist } = useWishlistStore()

  const inWishlist = isInWishlist(product.id)
  const discount = Math.round((1 - product.price / product.originalPrice) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group relative bg-card rounded-xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {isFlashDeal && <Badge className="bg-destructive text-destructive-foreground text-[10px] px-2">⚡ FLASH</Badge>}
        {discount > 0 && (
          <Badge variant="secondary" className="text-[10px] px-2 bg-success text-success-foreground">
            {discount}% OFF
          </Badge>
        )}
        {product.isNew && <Badge className="bg-accent text-accent-foreground text-[10px] px-2">NEW</Badge>}
      </div>

      {/* Wishlist Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => toggleWishlist(product.id)}
        className="absolute top-2 right-2 z-10 w-8 h-8 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-card transition-colors"
      >
        <Heart
          className={`h-4 w-4 transition-colors ${inWishlist ? "fill-destructive text-destructive" : "text-muted-foreground"}`}
        />
      </motion.button>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Quick Actions Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px] flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="icon"
              className="w-10 h-10 rounded-full bg-card text-foreground hover:bg-primary hover:text-primary-foreground"
              onClick={() => openQuickView(product)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="icon"
              className="w-10 h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => addItem(product)}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-3">
        <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
        <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5 bg-success/10 text-success px-1.5 py-0.5 rounded text-xs font-medium">
            <Star className="h-3 w-3 fill-current" />
            {product.rating}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-lg text-foreground">${product.price}</span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
          )}
        </div>

        {/* Stock indicator */}
        {product.stock < 10 && <p className="text-xs text-destructive mt-1">Only {product.stock} left!</p>}
      </div>
    </motion.div>
  )
}
