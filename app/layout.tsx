import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sirsa Ecommerce | Modern storefront",
  description:
    "A modern e-commerce experience with curated collections, effortless checkout, and personalized recommendations.",
  icons: {
    icon: "/favicon-32x32.png",
    shortcut: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Sirsa Ecommerce",
    description: "A modern e-commerce experience with curated collections, effortless checkout, and personalized recommendations.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Sirsa Ecommerce",
    locale: "en_US",
    type: "website",
    images: [
      {
        // url: `${process.env.NEXT_PUBLIC_APP_URL}/api/og`,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/android-chrome-512x512.png`,
        width: 1200,
        height: 630,
        alt: "Sirsa Ecommerce",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sirsa Ecommerce",
    description: "A modern e-commerce experience with curated collections, effortless checkout, and personalized recommendations.",
    images: [
      {
        // url: `${process.env.NEXT_PUBLIC_APP_URL}/api/og`,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/android-chrome-512x512.png`,
        
        width: 1200,
        height: 630,
        alt: "Sirsa Ecommerce",
      },
    ],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
   
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

