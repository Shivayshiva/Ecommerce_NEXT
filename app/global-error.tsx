 "use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, Home, LifeBuoy, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import "./globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global error boundary:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16 md:px-10">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />
          </div>

          <div className="relative w-full max-w-4xl">
            <div className="flex flex-col gap-3 text-center">
              <Badge className="mx-auto w-fit gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-medium text-slate-100 ring-1 ring-white/20">
                <AlertTriangle className="h-4 w-4" />
                Unexpected issue
              </Badge>
              <h1 className="text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl">
                We ran into a problem loading the site.
              </h1>
              <p className="text-pretty text-sm text-slate-300 sm:text-base">
                Our team has been notified. You can retry, head back home, or
                reach out for help.
              </p>
            </div>

            <Card className="mt-8 border-white/10 bg-white/5 shadow-2xl backdrop-blur">
              <CardHeader className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-amber-200">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15">
                    <AlertTriangle className="h-5 w-5" />
                  </span>
                  <div>
                    <CardTitle className="text-lg text-white">
                      Something went wrong
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                      We&apos;ll work on getting this fixed as soon as possible.
                    </CardDescription>
                  </div>
                </div>

                <div className="rounded-lg bg-slate-900/60 p-4 text-sm text-slate-200 ring-1 ring-white/10">
                  {error?.message ?? "An unexpected error occurred."}
                </div>

                {error?.digest ? (
                  <p className="text-xs text-slate-400">
                    Reference: <span className="font-mono">{error.digest}</span>
                  </p>
                ) : null}
              </CardHeader>

              <CardContent className="flex flex-wrap gap-3">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </body>
    </html>
  );
}