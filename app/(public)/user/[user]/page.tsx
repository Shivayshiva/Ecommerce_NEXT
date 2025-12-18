import Link from "next/link";
import {
  ArrowRight,
  Heart,
  LifeBuoy,
  ShoppingBag,
  Sparkles,
  Ticket,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type UserPageProps = {
  params: { user: string };
};

export default function UserPage({ params }: UserPageProps) {
  const displayName =
    decodeURIComponent(params.user ?? "").replace(/-/g, " ").trim() || "User";

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Badge className="bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-300/40">
              Personalized hub
            </Badge>
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              Hi {displayName}, here&apos;s your account overview
            </h2>
            <p className="text-sm text-slate-300">
              Track orders, manage favorites, and access member perks in one
              place.
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/products">
              Continue shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-white">Orders</CardTitle>
              <CardDescription className="text-slate-300">
                View status and invoices.
              </CardDescription>
            </div>
            <ShoppingBag className="h-5 w-5 text-emerald-200" />
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-semibold text-white">3</p>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/orders">Manage orders</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-white">Wishlist</CardTitle>
              <CardDescription className="text-slate-300">
                Keep track of favorites.
              </CardDescription>
            </div>
            <Heart className="h-5 w-5 text-pink-200" />
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-semibold text-white">12</p>
            <Button asChild variant="outline" className="w-full border-white/10 text-slate-100">
              <Link href="/wishlist">View wishlist</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-white">Rewards</CardTitle>
              <CardDescription className="text-slate-300">
                Redeem perks and coupons.
              </CardDescription>
            </div>
            <Ticket className="h-5 w-5 text-amber-200" />
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-semibold text-white">420 pts</p>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/rewards">View rewards</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-white">Recent activity</CardTitle>
              <CardDescription className="text-slate-300">
                A quick snapshot of what&apos;s happened lately.
              </CardDescription>
            </div>
            <Sparkles className="h-5 w-5 text-sky-200" />
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-200">
            <div className="rounded-lg border border-white/5 bg-slate-900/70 p-3">
              Delivered order #10023 — Smartwatch Series X
            </div>
            <div className="rounded-lg border border-white/5 bg-slate-900/70 p-3">
              Added “Noise Cancelling Headphones” to wishlist
            </div>
            <div className="rounded-lg border border-white/5 bg-slate-900/70 p-3">
              Applied 15% welcome coupon on your last purchase
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-white">Need help?</CardTitle>
              <CardDescription className="text-slate-300">
                We&apos;re here if you run into any issues.
              </CardDescription>
            </div>
            <LifeBuoy className="h-5 w-5 text-indigo-200" />
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-200">
              Check FAQs or reach out to our support team for quick assistance.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="secondary" className="gap-2">
                <Link href="/support">Visit support</Link>
              </Button>
              <Button asChild variant="ghost" className="gap-2 text-slate-200">
                <a href="mailto:support@sirsa.shop">Email support</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

