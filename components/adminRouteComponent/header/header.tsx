import Link from "next/link";
// import { SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminHeader() {
  return (
    <header className="w-full border-b border-border bg-card/60 backdrop-blur px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* <SidebarTrigger /> */}
        <div>
          <p className="text-xs text-muted-foreground">Admin console</p>
          <h1 className="text-lg font-semibold text-foreground">
            Dashboard
          </h1>
        </div>
      </div>

      <Link
        href="/"
        className="rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground transition hover:bg-secondary/80"
      >
        Back to store
      </Link>
    </header>
  );
}