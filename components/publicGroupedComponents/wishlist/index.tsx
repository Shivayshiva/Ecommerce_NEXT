"use client"
import Link from "next/link"
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useWishlistStore } from '@/lib/store'

export default function Wishlist() {
  const { items } = useWishlistStore()
  const wishlistItemCount = items.length

  return (
    <motion.div whileHover={{ scale: 1.3 }} whileTap={{ scale: 1 }}>
      <Button
        asChild
        variant="ghost"
        size="icon"
        className="relative"
        aria-label="Wishlist"
      >
        <Link href="/wishlist">
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
        </Link>
      </Button>
    </motion.div>
  )
}