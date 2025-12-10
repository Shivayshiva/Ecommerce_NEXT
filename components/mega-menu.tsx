"use client"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"

const categories = [
  {
    name: "Electronics",
    subcategories: ["Mobiles", "Laptops", "Tablets", "Cameras", "Audio", "Gaming", "Accessories"],
    image: "/electronics-gadgets.png",
  },
  {
    name: "Fashion",
    subcategories: ["Men's Clothing", "Women's Clothing", "Kids", "Footwear", "Watches", "Jewelry", "Bags"],
    image: "/diverse-fashion-collection.png",
  },
  {
    name: "Home & Kitchen",
    subcategories: ["Furniture", "Decor", "Kitchen", "Bedding", "Bath", "Storage", "Lighting"],
    image: "/cozy-living-room.png",
  },
  {
    name: "Beauty",
    subcategories: ["Skincare", "Makeup", "Haircare", "Fragrances", "Men's Grooming", "Tools", "Wellness"],
    image: "/beauty-products-collection.png",
  },
]

interface MegaMenuProps {
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export function MegaMenu({ onMouseEnter, onMouseLeave }: MegaMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute left-0 right-0 bg-card border-t border-border shadow-2xl z-50"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-4"
            >
              <div className="relative h-32 rounded-xl overflow-hidden group">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                <h3 className="absolute bottom-3 left-3 text-background font-bold text-lg">{category.name}</h3>
              </div>
              <ul className="space-y-2">
                {category.subcategories.map((sub) => (
                  <li key={sub}>
                    <a
                      href="#"
                      className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors group"
                    >
                      <ChevronRight className="h-3 w-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {sub}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
