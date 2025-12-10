const categories = [
  {
    title: "New Arrivals",
    copy: "Fresh picks across apparel, gadgets, and home essentials.",
  },
  {
    title: "Best Sellers",
    copy: "Most-loved products with consistent 5-star reviews.",
  },
  {
    title: "Under $50",
    copy: "Everyday value without compromising on quality.",
  },
];

const testimonials = [
  { quote: "Great quality and quick delivery every time.", name: "Riya" },
  { quote: "Simple checkout and reliable support.", name: "Arjun" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16">
        <header className="flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Aurora Commerce
          </p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Shop the essentials that fit your day-to-day.
          </h1>
          <p className="max-w-2xl text-lg text-slate-600">
            Clean layout, clear prices, and curated picks so you can check out in minutes.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/shop"
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Start shopping
            </a>
            <a
              href="/signin"
              className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
            >
              Sign in
            </a>
            <span className="text-sm text-slate-500">Free returns for 30 days</span>
          </div>
        </header>

        <section className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Featured
            </p>
            <h2 className="text-2xl font-semibold">Handpicked for you</h2>
            <p className="text-sm text-slate-600">
              Quick links to the most requested categories so you can jump right in.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {categories.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm"
              >
                <div className="font-semibold">{item.title}</div>
                <p className="mt-2 text-slate-600">{item.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-3">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Shipping
            </p>
            <h3 className="text-lg font-semibold">Fast & predictable</h3>
            <p className="text-sm text-slate-600">Most orders arrive within 3–5 days.</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Support
            </p>
            <h3 className="text-lg font-semibold">Always here</h3>
            <p className="text-sm text-slate-600">
              Chat or email support to help with sizing, returns, or orders.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Rewards
            </p>
            <h3 className="text-lg font-semibold">Earn as you shop</h3>
            <p className="text-sm text-slate-600">Points on every order with simple perks.</p>
          </div>
        </section>

        <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"
            >
              “{item.quote}”
              <div className="mt-3 text-xs font-semibold text-slate-500">— {item.name}</div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
