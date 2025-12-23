"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Sample categories - in a real app, these would come from an API
const categories = [
  {
    slug: "electronics",
    name: "Electronics",
    description: "Smartphones, laptops, tablets, and more",
    image: "/categories/electronics.jpg",
    productCount: 1250,
  },
  {
    slug: "clothing",
    name: "Clothing",
    description: "Fashion for men, women, and kids",
    image: "/categories/clothing.jpg",
    productCount: 890,
  },
  {
    slug: "home-kitchen",
    name: "Home & Kitchen",
    description: "Everything for your home and cooking needs",
    image: "/categories/home-kitchen.jpg",
    productCount: 650,
  },
  {
    slug: "sports-outdoors",
    name: "Sports & Outdoors",
    description: "Gear for fitness, sports, and outdoor activities",
    image: "/categories/sports.jpg",
    productCount: 420,
  },
  {
    slug: "books",
    name: "Books",
    description: "Fiction, non-fiction, educational, and more",
    image: "/categories/books.jpg",
    productCount: 2100,
  },
  {
    slug: "beauty-personal-care",
    name: "Beauty & Personal Care",
    description: "Cosmetics, skincare, and personal hygiene",
    image: "/categories/beauty.jpg",
    productCount: 780,
  },
]

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover our wide range of products organized by categories.
              Find exactly what you're looking for with ease.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/category/${category.slug}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 border-border/60 hover:border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>

                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {category.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {category.productCount.toLocaleString()} products
                      </span>
                      <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Shop Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}