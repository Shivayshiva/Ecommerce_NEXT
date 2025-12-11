"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Heart, Star, Minus, Plus, ShoppingCart, Truck, Shield, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useQuickViewStore, useCartStore, useWishlistStore } from "@/lib/store"

export function QuickViewModal() {
  const { isOpen, product, closeQuickView } = useQuickViewStore()
  const { addItem } = useCartStore()
  const { toggleWishlist, isInWishlist } = useWishlistStore()
  const [quantity, setQuantity] = useState(1)

  if (!product) return null

  const inWishlist = isInWishlist(product.id)
  const discount = Math.round((1 - product.price / product.originalPrice) * 100)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuickView}
            className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] bg-card rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="relative aspect-square bg-muted">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {discount > 0 && (
                  <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                    {discount}% OFF
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm rounded-full"
                  onClick={closeQuickView}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Details */}
              <div className="p-6 flex flex-col">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
                  <h2 className="text-xl font-bold mb-2">{product.name}</h2>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? "fill-warning text-warning" : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-bold text-primary">${product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-xl text-muted-foreground line-through">${product.originalPrice}</span>
                    )}
                  </div>

                  <p className="text-muted-foreground mb-6">
                    Experience premium quality with our best-selling product. Perfect for everyday use with exceptional
                    durability and style.
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-sm font-medium">Quantity:</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 bg-transparent"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 bg-transparent"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { icon: Truck, text: "Free Shipping" },
                      { icon: Shield, text: "2 Year Warranty" },
                      { icon: RefreshCw, text: "Easy Returns" },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex flex-col items-center text-center">
                        <Icon className="h-5 w-5 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 h-12"
                      onClick={() => {
                        for (let i = 0; i < quantity; i++) {
                          addItem(product)
                        }
                        closeQuickView()
                      }}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 bg-transparent"
                      onClick={() => toggleWishlist(product.id)}
                    >
                      <Heart className={`h-5 w-5 ${inWishlist ? "fill-destructive text-destructive" : ""}`} />
                    </Button>
                  </div>
                  <Button variant="secondary" className="w-full h-12">
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
