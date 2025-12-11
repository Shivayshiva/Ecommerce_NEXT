"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const banners = [
  {
    id: 1,
    title: "Summer Sale is Live!",
    subtitle: "Up to 70% off on Electronics",
    cta: "Shop Now",
    bg: "from-orange-500 to-red-600",
    image: "/electronics-sale-banner.png",
  },
  {
    id: 2,
    title: "New Fashion Collection",
    subtitle: "Trending styles for the season",
    cta: "Explore Fashion",
    bg: "from-pink-500 to-rose-600",
    image: "/fashion-collection-banner.jpg",
  },
  {
    id: 3,
    title: "Home Makeover Deals",
    subtitle: "Transform your space with up to 50% off",
    cta: "Shop Home",
    bg: "from-teal-500 to-emerald-600",
    image: "/home-decor-banner.png",
  },
]

export function HeroBanner() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrent((prev) => (prev + 1) % banners.length)
  const prevSlide = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length)

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ x: 120 }}
            animate={{ x: 4 }}
            exit={{ x: -120 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className={`absolute inset-0 bg-gradient-to-r ${banners[current].bg}`}
          >
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="grid md:grid-cols-2 gap-8 items-center w-full">
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center md:text-left"
                >
                  <motion.div
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm mb-4"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Sparkles className="h-4 w-4" />
                    Limited Time Offer
                  </motion.div>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 text-balance">
                    {banners[current].title}
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 mb-6">{banners[current].subtitle}</p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      className="bg-white text-foreground hover:bg-white/90 font-semibold px-8 shadow-xl"
                    >
                      {banners[current].cta}
                    </Button>
                  </motion.div>
                </motion.div>
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="hidden md:block"
                >
                  <Image
                    src={banners[current].image || "/placeholder.svg"}
                    alt={banners[current].title}
                    width={640}
                    height={480}
                    className="w-full max-w-md mx-auto drop-shadow-2xl animate-float"
                    priority
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === current ? "w-8 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
