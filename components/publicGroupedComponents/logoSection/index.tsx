import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

function LogoSection() {
  return (
    <motion.a
    href="/"
    className="flex items-center gap-2"
    whileHover={{ scale: 1.20 }}
    whileTap={{ scale: 0.95 }}
  >
    <div className="w-16 h-16 rounded-xl flex items-center justify-center">
      <Image
        src="/android-chrome-512X512.png"
        alt="Sirsa Store logo"
        width={72}
        height={72}
        className="w-16 h-16"
      />
    </div>
    <span className="hidden sm:block text-xl font-bold text-foreground">
      Sirsa<span className="text-primary pl-1">Store</span>
    </span>
  </motion.a>
  )
}

export default LogoSection