import type { ReactNode } from "react";
import { Header } from "@/components/header"
// import { HeroBanner } from "@/components/hero-banner"
import { Footer } from "@/components/footer"
import { CartSidebar } from "@/components/cart-sidebar"
import { QuickViewModal } from "@/components/quick-view-modal"

export default function PublicLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Header />
      {/* <HeroBanner /> */}
      {children}
      <Footer />
      <CartSidebar />
      <QuickViewModal />
    </>
  );
}
