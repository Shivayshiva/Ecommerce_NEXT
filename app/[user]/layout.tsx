import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type UserLayoutProps = {
  children: React.ReactNode;
  params: { user: string };
};

export default function UserLayout({ children, params }: UserLayoutProps) {
  const displayName =
    decodeURIComponent(params.user ?? "").replace(/-/g, " ").trim() || "User";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Badge className="w-fit bg-white/10 text-xs font-medium text-slate-100 ring-1 ring-white/20">
              Customer space
            </Badge>
            <div>
              <p className="text-sm text-slate-300">Welcome back,</p>
              <h1 className="text-2xl font-semibold text-white sm:text-3xl">
                {displayName}
              </h1>
              <p className="text-sm text-slate-400">
                Manage your profile, orders, and preferences from one place.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary" className="gap-2">
              <Link href="/">Back to store</Link>
            </Button>
            <Button asChild className="gap-2">
              <Link href="/cart">View cart</Link>
            </Button>
          </div>
        </header>

        <main className="mt-8 space-y-8">{children}</main>
      </div>
    </div>
  );
}

