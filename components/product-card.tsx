"use client"

import { motion } from "framer-motion"
import { Heart, Eye, ShoppingCart, Star, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCartStore, useQuickViewStore } from "@/lib/store"
import type { Product } from "@/lib/data"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: Product
  index?: number
  isFlashDeal?: boolean
}

export function ProductCard({ product, index = 0, isFlashDeal }: ProductCardProps) {
  const { addItem } = useCartStore()
  const { openQuickView } = useQuickViewStore()
  const { toast } = useToast()

  const [isInWishlist, setIsInWishlist] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [isAddedToCart, setIsAddedToCart] = useState(false)

  const discount = Math.round((1 - product.price / product.originalPrice) * 100)

  // Fetch initial wishlist status
  useEffect(() => {
    const fetchWishlistStatus = async () => {
      try {
        const response = await fetch("/api/users/wishlist")
        const data = await response.json()

        if (data.success) {
          const productId = (product as any)._id || product.id.toString()
          const inWishlist = data.wishlist.some((item: any) => 
            item.productId.toString() === productId
          )
          setIsInWishlist(inWishlist)
        }
      } catch (error) {
        console.error("Failed to fetch wishlist status:", error)
      }
    }

    fetchWishlistStatus()
  }, [product])

  const handleAddToCart = () => {
    addItem(product)
    setIsAddedToCart(true)
  }

  // Check initial wishlist status
  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const response = await fetch("/api/users/wishlist")
        const data = await response.json()

        console.log("Wishlist_wishlist", data)

        if (data.success) {
          const productId = (product as any)._id || product.id.toString()
          const inWishlist = data.wishlist.some((item: any) => item.productId === productId)
          setIsInWishlist(inWishlist)
        }
      } catch (error) {
        console.error("Failed to fetch wishlist status:", error)
      }
    }

    checkWishlistStatus()
  }, [product.id, (product as any)._id])

  const handleWishlistToggle = async () => {
    if (wishlistLoading) return

    setWishlistLoading(true)

    try {
      const action = isInWishlist ? "remove" : "add"
      const productId = (product as any)._id || product.id.toString()

      console.log("Sending wishlist request:", { productId, action })

      const response = await fetch("/api/users/wishlist", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          action,
        }),
      })

      const data = await response.json()
      console.log("Wishlist response:", data)

      if (data.success) {
        setIsInWishlist(!isInWishlist)
        toast({
          title: data.message,
          description: action === "add"
            ? "Product added to your wishlist"
            : "Product removed from your wishlist",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update wishlist",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setWishlistLoading(false)
    }
  }

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
        onClick={handleWishlistToggle}
        disabled={wishlistLoading}
        className="absolute top-2 right-2 z-10 w-8 h-8 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-card transition-colors disabled:opacity-50"
      >
        <Heart
          className={`h-4 w-4 transition-colors ${
            isInWishlist ? "fill-destructive text-destructive" : "text-muted-foreground"
          } ${wishlistLoading ? "animate-pulse" : ""}`}
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

        {/* Add to Cart Button */}
        <motion.div className="mt-3">
          <Button
            onClick={handleAddToCart}
            disabled={isAddedToCart}
            className="w-full h-9 text-sm font-medium transition-all duration-200 disabled:opacity-100"
            variant={isAddedToCart ? "secondary" : "default"}
          >
            <motion.div
              className="flex items-center gap-2"
              initial={false}
              animate={{
                scale: isAddedToCart ? 1.05 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {isAddedToCart ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </motion.div>
          </Button>
        </motion.div>

        {/* Stock indicator */}
        {product.stock < 10 && <p className="text-xs text-destructive mt-1">Only {product.stock} left!</p>}
      </div>
    </motion.div>
  )
}
