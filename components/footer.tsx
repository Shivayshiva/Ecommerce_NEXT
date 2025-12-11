"use client"

import { motion } from "framer-motion"
import { Facebook, Twitter, Instagram, Youtube, CreditCard, Smartphone, MapPin, Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <motion.a href="/" className="flex items-center gap-2 mb-4" whileHover={{ scale: 1.05 }}>
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-bold">ShopVerse</span>
            </motion.a>
            <p className="text-background/60 text-sm mb-4">
              Your one-stop destination for all your shopping needs. Quality products, great prices.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-background/60">
              {["About Us", "Contact", "FAQs", "Track Order", "Shipping Info"].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm text-background/60">
              {["Electronics", "Fashion", "Home & Kitchen", "Beauty", "Sports"].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm text-background/60">
              {["My Account", "Order History", "Wishlist", "Returns", "Privacy Policy"].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-background/60">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>123 Shopping Street, NY 10001</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>support@shopverse.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+1 (800) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-background/60">We accept:</span>
              <div className="flex gap-2">
                {[CreditCard, CreditCard, CreditCard, Smartphone].map((Icon, index) => (
                  <div key={index} className="w-10 h-6 bg-background/10 rounded flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-background/60">© 2025 ShopVerse. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
