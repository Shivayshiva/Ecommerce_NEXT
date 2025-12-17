import Link from "next/link";
import { Compass, Home, ShoppingBag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="relative min-h-[80vh] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-12 -top-16 h-56 w-56 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute bottom-6 right-0 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-2xl" />
      </div>

      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 py-16 text-center md:px-10">
        <Badge className="mx-auto flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-medium text-slate-100 ring-1 ring-white/20">
          <Compass className="h-4 w-4" />
          404 · Page not found
        </Badge>

        <div className="space-y-3">
          <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
            We can&apos;t find that aisle.
          </h1>
          <p className="text-sm text-slate-300 sm:text-base">
            The page you&apos;re looking for might have moved or no longer
            exists. Let&apos;s get you back to shopping.
          </p>
        </div>

        <Card className="w-full border-white/10 bg-white/5 shadow-2xl backdrop-blur">
          <CardHeader className="flex flex-col items-center gap-2 text-center">
            <CardTitle className="flex items-center gap-2 text-white">
              <ShoppingBag className="h-5 w-5" />
              Continue exploring
            </CardTitle>
            <CardDescription className="text-slate-300">
              Choose one of the options below to jump back into the store.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-slate-200 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-left">
              <p className="font-semibold text-white">Back to home</p>
              <p className="text-xs text-slate-400">
                Visit the storefront to browse featured picks.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-left">
              <p className="font-semibold text-white">Need assistance?</p>
              <p className="text-xs text-slate-400">
                Reach out if you need help finding something specific.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Go to home
            </Link>
          </Button>
          <Button asChild variant="secondary" className="gap-2">
            <a href="mailto:support@sirsa.shop">Contact support</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

