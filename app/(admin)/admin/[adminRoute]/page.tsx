type AdminSlugPageProps = {
  params: { adminRoute: string };
};

export default function AdminSlugPage({ params }: AdminSlugPageProps) {
  const displayName =
    decodeURIComponent(params.adminRoute ?? "").replace(/-/g, " ").trim() ||
    "Admin";

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-white">
          {displayName} workspace
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          This is a placeholder page for the dynamic admin route. Add your
          dashboards, tables, or forms here.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Overview", hint: "KPIs and quick stats." },
          { title: "Products", hint: "Manage catalog items." },
          { title: "Orders", hint: "Review and fulfill orders." },
          { title: "Customers", hint: "View and support customers." },
          { title: "Content", hint: "Banners, pages, and promos." },
          { title: "Settings", hint: "Roles, access, and preferences." },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-lg border border-white/10 bg-white/5 p-4"
          >
            <h3 className="text-base font-semibold text-white">
              {card.title}
            </h3>
            <p className="mt-1 text-sm text-slate-300">{card.hint}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

