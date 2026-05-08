import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, MapPin, Clock, IndianRupee, Bookmark, SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Find Work Near You — QuickRozgar" },
      { name: "description", content: "Discover verified gig and shift work nearby. Filter by skill, distance, and pay." },
    ],
  }),
  component: DiscoverPage,
});

const categories = ["All", "Delivery", "Food & Café", "Retail", "Cleaning", "Skilled", "Events"];

const jobs = [
  { t: "Evening Server", c: "Café Bloom", cat: "Food & Café", l: "Bandra West", d: 0.4, p: 350, u: "shift", tags: ["Hospitality", "Weekends"], time: "Today · 6–10 PM" },
  { t: "Delivery Rider", c: "GoBox", cat: "Delivery", l: "Khar", d: 0.7, p: 220, u: "order", tags: ["2-wheeler", "Own vehicle"], time: "Flexible hours" },
  { t: "Cashier (Weekend)", c: "FreshMart", cat: "Retail", l: "Bandra West", d: 1.1, p: 500, u: "shift", tags: ["POS", "Weekends"], time: "Sat–Sun, 10–7" },
  { t: "Office Cleaning", c: "WorkSpace Co.", cat: "Cleaning", l: "BKC", d: 1.6, p: 600, u: "day", tags: ["Mornings", "Daily"], time: "Mon–Fri, 7–11 AM" },
  { t: "Electrician", c: "Urban Repairs", cat: "Skilled", l: "Khar", d: 0.9, p: 800, u: "job", tags: ["Certified", "Tools provided"], time: "On-call" },
  { t: "Event Steward", c: "Lume Events", cat: "Events", l: "Worli", d: 3.4, p: 1200, u: "event", tags: ["Uniform provided"], time: "Sat, 5 PM–12 AM" },
  { t: "Kitchen Helper", c: "Spice Route", cat: "Food & Café", l: "Bandra East", d: 1.2, p: 400, u: "shift", tags: ["No experience"], time: "Today · 4–10 PM" },
  { t: "Stock Assistant", c: "FreshMart", cat: "Retail", l: "Khar", d: 0.8, p: 380, u: "shift", tags: ["Heavy lifting"], time: "Mornings" },
];

function DiscoverPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const filtered = useMemo(
    () =>
      jobs.filter(
        (j) =>
          (cat === "All" || j.cat === cat) &&
          (q === "" ||
            j.t.toLowerCase().includes(q.toLowerCase()) ||
            j.c.toLowerCase().includes(q.toLowerCase()) ||
            j.l.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, cat],
  );

  return (
    <section className="container-page py-12">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold text-secondary md:text-5xl">Find work nearby.</h1>
        <p className="mt-3 text-muted-foreground">
          Browse verified roles in your neighborhood. Apply in one tap.
        </p>
      </div>

      {/* Search */}
      <div className="mt-8 flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by role, area, or company"
            className="w-full rounded-full border border-border bg-surface py-3.5 pl-11 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
          />
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium text-secondary hover:bg-muted">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
      </div>

      {/* Categories */}
      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => {
          const active = c === cat;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                active
                  ? "border-secondary bg-secondary text-secondary-foreground"
                  : "border-border bg-surface text-secondary hover:bg-muted"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Results */}
      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{filtered.length} jobs near you</p>
        <select className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-secondary">
          <option>Sort: Nearest</option>
          <option>Sort: Highest pay</option>
          <option>Sort: Newest</option>
        </select>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {filtered.map((j) => (
          <article
            key={j.t + j.c}
            className="group flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-soft transition-shadow hover:shadow-card"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-medium text-primary">{j.cat}</div>
                  <h3 className="mt-1 text-lg font-semibold text-secondary">{j.t}</h3>
                  <div className="mt-1 text-sm text-muted-foreground">{j.c}</div>
                </div>
                <button className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-secondary">
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {j.tags.map((t) => (
                  <span key={t} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-secondary">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{j.l} · {j.d} km</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{j.time}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-secondary">
                  <IndianRupee className="h-3 w-3" />{j.p}/{j.u}
                </span>
              </div>
              <button className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
                Apply
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
