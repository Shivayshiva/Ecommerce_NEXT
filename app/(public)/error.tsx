 "use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, Home, LifeBuoy, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {


  return (
    <div className="relative min-h-[80vh] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Soft background orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 -top-20 h-60 w-60 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/10 blur-2xl" />
      </div>

      <div className="relative mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16 md:px-10">
        <div className="flex flex-col gap-3 text-center">
          <Badge className="mx-auto w-fit gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-medium text-slate-100 ring-1 ring-white/20">
            <AlertTriangle className="h-4 w-4" />
            We hit a snag
          </Badge>
          <h1 className="text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Something went off course.
          </h1>
          <p className="text-pretty text-sm text-slate-300 sm:text-base">
            We couldn&apos;t complete this request. You can retry, head back
            home, or contact us if the issue keeps happening.
          </p>
        </div>

        <Card className="border-white/10 bg-white/5 shadow-2xl backdrop-blur">
          <CardHeader className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-amber-200">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div>
                <CardTitle className="text-lg text-white">
                  Unexpected error
                </CardTitle>
                <CardDescription className="text-slate-300">
                  We&apos;ve logged the details so we can look into it.
                </CardDescription>
              </div>
            </div>

            <div className="rounded-lg bg-slate-900/60 p-4 text-sm text-slate-200 ring-1 ring-white/10">
              {error?.message ?? "An unknown error occurred."}
            </div>

            {error?.digest ? (
              <p className="text-xs text-slate-400">
                Reference: <span className="font-mono">{error.digest}</span>
              </p>
            ) : null}
          </CardHeader>

          <CardContent className="flex flex-col gap-6">
            <div className="grid gap-3 text-sm text-slate-200 md:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="font-semibold text-white">Quick reset</p>
                <p className="text-xs text-slate-400">
                  Try reloading this view to recover gracefully.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="font-semibold text-white">Return home</p>
                <p className="text-xs text-slate-400">
                  Head back to the storefront and continue browsing.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="font-semibold text-white">Need help?</p>
                <p className="text-xs text-slate-400">
                  Reach out if this persists so we can assist you.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={reset} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try again
              </Button>
              <Button asChild variant="secondary" className="gap-2">
                <Link href="/">
                  <Home className="h-4 w-4" />
                  Go home
                </Link>
              </Button>
              <Button asChild variant="ghost" className="gap-2 text-slate-200">
                <a href="mailto:support@sirsa.shop">
                  <LifeBuoy className="h-4 w-4" />
                  Contact support
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}