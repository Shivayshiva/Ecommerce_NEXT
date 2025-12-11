"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Zap, Clock } from "lucide-react"
import { ProductCard } from "./product-card"
import { products } from "@/lib/data"

export function FlashDeals() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 32,
    seconds: 47,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) {
          seconds = 59
          minutes--
        }
        if (minutes < 0) {
          minutes = 59
          hours--
        }
        if (hours < 0) {
          hours = 23
          minutes = 59
          seconds = 59
        }
        return { hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const flashProducts = products.slice(0, 6)

  return (
    <section className="py-8 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center animate-pulse-glow">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">Flash Deals</h2>
              <p className="text-sm text-muted-foreground">Limited time offers</p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-full"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Ends in:</span>
            <div className="flex items-center gap-1">
              <span className="bg-primary text-primary-foreground px-2 py-1 rounded font-mono font-bold">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span>:</span>
              <span className="bg-primary text-primary-foreground px-2 py-1 rounded font-mono font-bold">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span>:</span>
              <span className="bg-primary text-primary-foreground px-2 py-1 rounded font-mono font-bold">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {flashProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} isFlashDeal />
          ))}
        </div>
      </div>
    </section>
  )
}
