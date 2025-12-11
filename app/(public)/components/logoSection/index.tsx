import React from 'react'
import { motion } from 'framer-motion'

function LogoSection() {
  return (
    <motion.a
    href="/"
    className="flex items-center gap-2"
    whileHover={{ scale: 1.20 }}
    whileTap={{ scale: 0.95 }}
  >
    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
      <span className="text-primary-foreground font-bold text-xl">S</span>
    </div>
    <span className="hidden sm:block text-xl font-bold text-foreground">
      Sirsa<span className="text-primary pl-1">Store</span>
    </span>
  </motion.a>
  )
}

export default LogoSection