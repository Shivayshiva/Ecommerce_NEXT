import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnimatePresence, motion } from 'framer-motion'
import { Badge, Mic, Search } from 'lucide-react';
import React, { useState } from 'react'

const categories = [
    "All Categories",
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Beauty",
    "Sports",
    "Books",
    "Toys",
    "Grocery",
  ]

export default function SearchBar() {
    const [searchFocused, setSearchFocused] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All Categories")

  return (
    <div className="flex-1 max-w-2xl relative hidden md:block">
    <motion.div
      className={`relative flex items-center rounded-full border-2 transition-all duration-300 ${
        searchFocused ? "border-primary shadow-lg shadow-primary/20" : "border-border"
      }`}
      animate={{ scale: searchFocused ? 1.05 : 1 }}
    >
      <div className="flex items-center border-r border-border">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="border-0 bg-transparent h-12 px-4 rounded-l-full rounded-r-none focus:ring-0 focus-visible:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Input
        type="text"
        placeholder="Search for products, brands and more..."
        className="border-0 bg-transparent pl-4 pr-24 py-3 h-12 rounded-r-full rounded-l-none focus-visible:ring-0"
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setSearchFocused(false)}
      />
      <div className="absolute right-2 flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10">
          <Mic className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button size="icon" className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90">
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>

    {/* Search Suggestions */}
    <AnimatePresence>
      {searchFocused && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-2xl border border-border p-4 z-50"
        >
          <p className="text-xs text-muted-foreground mb-2">Popular Searches</p>
          <div className="flex flex-wrap gap-2">
            {["iPhone 15", "Nike Shoes", "Samsung TV", "Headphones", "Laptop"].map((term) => (
              <Badge
                key={term}
                // variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {term}
              </Badge>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
  )
}