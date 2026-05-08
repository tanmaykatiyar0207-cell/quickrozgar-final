import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Plus,
  TrendingUp,
  Users,
  Briefcase,
  Clock,
  MapPin,
  Sparkles,
  MoreHorizontal,
  ArrowUpRight,
  Search,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Employer Dashboard — QuickRozgar" },
      { name: "description", content: "Post jobs, review nearby workers, and manage hiring from one professional dashboard." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <section className="container-page py-12">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <h1 className="text-3xl font-bold text-secondary md:text-4xl">Café Bloom · Bandra</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-secondary hover:bg-muted">
            <Search className="h-4 w-4" /> Search
          </button>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft"
          >
            <Plus className="h-4 w-4" /> Post a Job
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          { l: "Active jobs", v: "6", d: "+2 this week", i: Briefcase },
          { l: "Applications", v: "143", d: "+38 today", i: Users },
          { l: "Avg. time to hire", v: "12m", d: "-3m vs last wk", i: Clock },
          { l: "Hire rate", v: "92%", d: "+4% MoM", i: TrendingUp },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.l}</span>
              <s.i className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-3 text-3xl font-bold tracking-tight text-secondary">{s.v}</div>
            <div className="mt-1 text-xs text-success">{s.d}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Post job + listings */}
        <div className="space-y-6 lg:col-span-2">
          {/* Quick post */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-secondary">Post a new job</h3>
                <p className="text-sm text-muted-foreground">Describe the role and we'll match in minutes.</p>
              </div>
              <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary">
                AI assisted
              </span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <input
                placeholder="Role title — e.g. Evening Server"
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
              />
              <input
                placeholder="Pay — ₹350 / shift"
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
              />
              <input
                placeholder="Location — Bandra West"
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
              />
              <input
                placeholder="Shift — Today, 6–10 PM"
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
            <div className="mt-5 flex items-center justify-between">
              <button className="text-sm font-medium text-primary hover:underline">+ Add details</button>
              <button className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground">
                Publish job
              </button>
            </div>
          </div>

          {/* Active listings */}
          <div className="rounded-2xl border border-border bg-surface shadow-soft">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h3 className="text-base font-semibold text-secondary">Active job listings</h3>
              <Link to="/discover" className="text-sm font-medium text-primary hover:underline">
                View all
              </Link>
            </div>
            <ul className="divide-y divide-border">
              {[
                { t: "Evening Server", l: "Bandra West", a: 24, s: "Open", p: "₹350/shift" },
                { t: "Delivery Rider", l: "Khar", a: 41, s: "Open", p: "₹220/order" },
                { t: "Kitchen Helper", l: "Bandra East", a: 18, s: "Reviewing", p: "₹400/shift" },
                { t: "Cashier (Weekend)", l: "Bandra West", a: 12, s: "Open", p: "₹500/shift" },
              ].map((j) => (
                <li key={j.t} className="flex items-center justify-between p-5">
                  <div>
                    <div className="font-medium text-secondary">{j.t}</div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{j.l}</span>
                      <span>{j.p}</span>
                      <span>{j.a} applicants</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        j.s === "Open" ? "bg-primary-soft text-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {j.s}
                    </span>
                    <button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent applications */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <h3 className="text-base font-semibold text-secondary">Recent applications</h3>
            <div className="mt-5 grid gap-3">
              {[
                { n: "Rahul Sharma", r: "Evening Server", t: "2m ago", m: 96 },
                { n: "Priya Khanna", r: "Cashier", t: "9m ago", m: 92 },
                { n: "Anil Mehta", r: "Delivery Rider", t: "21m ago", m: 89 },
                { n: "Fatima Ali", r: "Kitchen Helper", t: "44m ago", m: 87 },
              ].map((a) => (
                <div key={a.n} className="flex items-center justify-between rounded-xl border border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-muted text-sm font-semibold text-secondary">
                      {a.n[0]}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-secondary">{a.n}</div>
                      <div className="text-xs text-muted-foreground">{a.r} · {a.t}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary">{a.m}% match</span>
                    <button className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground">Review</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Recs */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary">
                <Sparkles className="h-4 w-4" />
              </span>
              <h3 className="text-base font-semibold text-secondary">AI Recommendations</h3>
            </div>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="rounded-xl bg-muted/60 p-4">
                <div className="font-medium text-secondary">Increase pay by ₹40 to fill faster</div>
                <p className="mt-1 text-xs text-muted-foreground">Similar roles in Bandra fill 3× faster at ₹390.</p>
              </li>
              <li className="rounded-xl bg-muted/60 p-4">
                <div className="font-medium text-secondary">Reopen Saturday shift</div>
                <p className="mt-1 text-xs text-muted-foreground">14 high-rated workers available within 1 km.</p>
              </li>
              <li className="rounded-xl bg-muted/60 p-4">
                <div className="font-medium text-secondary">Try voice posting</div>
                <p className="mt-1 text-xs text-muted-foreground">Cuts your listing time by 60%.</p>
              </li>
            </ul>
          </div>

          {/* Nearby workers */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-secondary">Nearby workers</h3>
              <Link to="/ai-matching" className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                Map view <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <ul className="mt-4 space-y-3">
              {[
                { n: "Sana R.", s: "Server · 0.3 km", r: 4.9 },
                { n: "Vikram T.", s: "Rider · 0.6 km", r: 4.8 },
                { n: "Neha P.", s: "Cashier · 0.9 km", r: 4.7 },
                { n: "Imran J.", s: "Helper · 1.1 km", r: 4.6 },
              ].map((w) => (
                <li key={w.n} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-muted text-xs font-semibold text-secondary">{w.n[0]}</div>
                    <div>
                      <div className="text-sm font-medium text-secondary">{w.n}</div>
                      <div className="text-xs text-muted-foreground">{w.s}</div>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-secondary">{w.r}★</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
