"use client"

import Link from "next/link"
import { motion } from "framer-motion"

const categories = [
  { name: "Mobiles", icon: "📱", color: "from-blue-500 to-cyan-500", slug: "mobiles" },
  { name: "Electronics", icon: "💻", color: "from-purple-500 to-pink-500", slug: "electronics" },
  { name: "Fashion", icon: "👗", color: "from-rose-500 to-orange-500", slug: "fashion" },
  { name: "Home", icon: "🏠", color: "from-emerald-500 to-teal-500", slug: "home-living" },
  { name: "Beauty", icon: "💄", color: "from-pink-500 to-red-500", slug: "beauty" },
  { name: "Sports", icon: "⚽", color: "from-green-500 to-lime-500", slug: "sports" },
  { name: "Books", icon: "📚", color: "from-amber-500 to-yellow-500", slug: "books" },
  { name: "Toys", icon: "🎮", color: "from-indigo-500 to-blue-500", slug: "toys" },
]

export function CategoryGrid() {
  return (
    <section className="py-8 bg-card">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-xl md:text-2xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Shop by Category
        </motion.h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map((category, index) => (
            <Link key={category.name} href={`/category/${category.slug}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >

                <div
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl md:text-3xl shadow-lg group-hover:shadow-xl transition-shadow`}
                >
                  {category.icon}
                </div>
                <span className="text-xs md:text-sm font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors">
                  {category.name}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
