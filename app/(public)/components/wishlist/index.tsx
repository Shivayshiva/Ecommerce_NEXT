"use client"
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useWishlistStore } from '@/lib/store'


export default function Wishlist() {
    const { toggleWishlist } = useWishlistStore()
    const { items } = useWishlistStore()
    const wishlistItemCount = items.length
  return (
    <motion.div whileHover={{ scale: 1.3 }} whileTap={{ scale: 1 }}>
                <Button variant="ghost" size="icon" className="relative" onClick={toggleWishlist}>
                  <Heart className="h-5 w-5" />
                  {wishlistItemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center"
                    >
                      {wishlistItemCount}
                    </motion.span>
                  )}
                </Button>
              </motion.div>
  )
}