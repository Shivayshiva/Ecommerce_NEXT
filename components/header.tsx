"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Mic,
  MapPin,
  ChevronDown,
  Bell,
  Package,
  Sparkles,
} from "lucide-react"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCartStore } from "@/lib/store"
import { MegaMenu } from "./mega-menu"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showMegaMenu, setShowMegaMenu] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { items, toggleCart } = useCartStore()
  const { data: session } = useSession()

  const userName = session?.user?.name || session?.user?.email || "User"

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      {/* Top Bar */}
      <div className="bg-foreground text-background text-xs py-2 hidden md:block">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              Free shipping on orders over $50
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              New users get 20% off
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="hover:underline">Download App</button>
            <button className="hover:underline">Sell on ShopVerse</button>
            <button className="hover:underline">Help Center</button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <motion.header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-card/95 backdrop-blur-lg shadow-lg" : "bg-card"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>

            {/* Logo */}
            <motion.a
              href="/"
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">S</span>
              </div>
              <span className="hidden sm:block text-xl font-bold text-foreground">
                Sirsa<span className="text-primary pl-1">Store</span>
              </span>
            </motion.a>

            {/* Location Selector */}
            <button className="hidden lg:flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <MapPin className="h-4 w-4" />
              <div className="text-left">
                <p className="text-xs">Deliver to</p>
                <p className="font-medium text-foreground">New York 10001</p>
              </div>
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl relative hidden md:block">
              <motion.div
                className={`relative flex items-center rounded-full border-2 transition-all duration-300 ${
                  searchFocused ? "border-primary shadow-lg shadow-primary/20" : "border-border"
                }`}
                animate={{ scale: searchFocused ? 1.02 : 1 }}
              >
                <Input
                  type="text"
                  placeholder="Search for products, brands and more..."
                  className="border-0 bg-transparent pl-4 pr-24 py-3 h-12 rounded-full focus-visible:ring-0"
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
                          variant="secondary"
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

            {/* Right Actions */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative hidden md:flex">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* Wishlist */}
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                  5
                </span>
              </Button>

              {/* Cart */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="relative" onClick={toggleCart}>
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center"
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </Button>
              </motion.div>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden md:flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <div className="text-left hidden lg:block">
                      <p className="text-xs text-muted-foreground">
                        {session ? `Hello, ${userName}` : "Hello, Sign in"}
                      </p>
                      <p className="text-sm font-medium">Account</p>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {session ? (
                    <>
                      <DropdownMenuLabel>{userName}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Account</DropdownMenuItem>
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>Logout</DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem onClick={() => signIn()}>Sign in</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Category Navigation */}
          <nav className="hidden md:flex items-center gap-1 pb-2 overflow-x-auto scrollbar-hide">
            <Button
              variant="ghost"
              className="flex items-center gap-1 text-sm font-medium"
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
            >
              <Menu className="h-4 w-4" />
              All Categories
              <ChevronDown className="h-3 w-3" />
            </Button>
            {["Electronics", "Fashion", "Home & Kitchen", "Beauty", "Sports", "Books", "Toys", "Grocery"].map(
              (category) => (
                <Button
                  key={category}
                  variant="ghost"
                  className="text-sm text-muted-foreground hover:text-foreground whitespace-nowrap"
                >
                  {category}
                </Button>
              ),
            )}
            <Button variant="ghost" className="text-sm text-primary font-medium whitespace-nowrap">
              🔥 Today&apos;s Deals
            </Button>
          </nav>
        </div>

        {/* Mega Menu */}
        <AnimatePresence>
          {showMegaMenu && (
            <MegaMenu onMouseEnter={() => setShowMegaMenu(true)} onMouseLeave={() => setShowMegaMenu(false)} />
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Search */}
      <div className="md:hidden p-4 bg-card border-b border-border">
        <div className="relative flex items-center rounded-full border border-border">
          <Input
            type="text"
            placeholder="Search products..."
            className="border-0 bg-transparent pl-4 pr-20 py-2 h-10 rounded-full focus-visible:ring-0"
          />
          <div className="absolute right-2 flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
              <Mic className="h-4 w-4" />
            </Button>
            <Button size="icon" className="h-7 w-7 rounded-full bg-primary">
              <Search className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/50 z-50 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-card z-50 md:hidden overflow-y-auto"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Hello, {userName}</p>
                    <p className="text-sm text-muted-foreground">
                      {session ? "Welcome back" : "Welcome to ShopVerse"}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Shop by Category</p>
                {["Electronics", "Fashion", "Home & Kitchen", "Beauty", "Sports", "Books", "Toys", "Grocery"].map(
                  (category) => (
                    <button
                      key={category}
                      className="w-full text-left py-3 border-b border-border hover:text-primary transition-colors"
                    >
                      {category}
                    </button>
                  ),
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
