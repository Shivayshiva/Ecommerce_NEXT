"use client"

import { motion } from "framer-motion"

const brands = [
  { name: "Apple", logo: "/apple-logo-minimalist.png" },
  { name: "Samsung", logo: "/samsung-logo.png" },
  { name: "Nike", logo: "/nike-swoosh.png" },
  { name: "Sony", logo: "/sony-logo.png" },
  { name: "Adidas", logo: "/adidas-logo.png" },
  { name: "LG", logo: "/lg-logo-abstract.png" },
]

export function BrandShowcase() {
  return (
    <section className="py-12 bg-card">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-xl md:text-2xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Shop by Brands
        </motion.h2>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {brands.map((brand, index) => (
            <motion.a
              key={brand.name}
              href="#"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="aspect-[3/2] bg-muted rounded-xl flex items-center justify-center p-4 hover:shadow-lg transition-all border border-border"
            >
              <img
                src={brand.logo || "/placeholder.svg"}
                alt={brand.name}
                className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all"
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
