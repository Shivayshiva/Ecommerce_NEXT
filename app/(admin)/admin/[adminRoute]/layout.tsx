import type { ReactNode } from "react";
import Link from "next/link";

type AdminSlugLayoutProps = {
  children: ReactNode;
  params: { adminRoute: string };
};

export default function AdminSlugLayout({
  children,
  params,
}: AdminSlugLayoutProps) {
  const displayName =
    decodeURIComponent(params.adminRoute ?? "").replace(/-/g, " ").trim() ||
    "Admin user";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
          <div className="space-y-1">
            <p className="text-sm text-slate-400">Admin console</p>
            <h1 className="text-2xl font-semibold text-white">{displayName}</h1>
            <p className="text-sm text-slate-400">
              Manage settings and resources for this admin scope.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
          >
            Back to admin home
          </Link>
        </header>

        <main className="mt-8 space-y-8">{children}</main>
      </div>
    </div>
  );
}

