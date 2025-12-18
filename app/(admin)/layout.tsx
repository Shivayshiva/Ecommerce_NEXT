import type { ReactNode } from "react";
import Link from "next/link";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-full px-10 py-5">
        {/* <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-xl backdrop-blur">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Admin console</p>
            <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Manage products, orders, and content from one place.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition hover:bg-secondary/80"
          >
            Back to store
          </Link>
        </header> */}

        <main className="mt-8 space-y-8">{children}</main>
      </div>
    </div>
  );
}
