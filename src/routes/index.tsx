import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  MapPin,
  Sparkles,
  ShieldCheck,
  Zap,
  Users,
  Star,
  Briefcase,
  Mic,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QuickRozgar — Hire Nearby Workers Instantly" },
      { name: "description", content: "AI-powered hyperlocal hiring platform. Post a job in seconds, find verified workers nearby." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="container-page relative pb-20 pt-20 md:pb-28 md:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Now live in 24 Indian cities
            </span>
            <h1 className="mt-6 text-balance text-5xl font-bold leading-[1.05] text-secondary md:text-6xl lg:text-7xl">
              Hire nearby workers, <span className="text-primary">instantly.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              QuickRozgar matches your job to verified gig workers within walking distance — using AI that understands skills, location, and availability in real time.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5"
              >
                Post a Job
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/discover"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-sm font-semibold text-secondary hover:bg-muted"
              >
                Find Work
              </Link>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              No credit card required · Free for first 5 hires
            </p>
          </div>

          {/* Hero card preview */}
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="rounded-3xl border border-border bg-surface p-2 shadow-elevated">
              <div className="rounded-2xl bg-secondary p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <span className="h-2 w-2 rounded-full bg-success" />
                    Live matches near Bandra West
                  </div>
                  <span className="text-xs text-white/60">Updated just now</span>
                </div>
                <div className="mt-6 grid gap-3 md:grid-cols-3">
                  {[
                    { name: "Rahul S.", role: "Delivery Partner", dist: "0.4 km", score: 96 },
                    { name: "Priya K.", role: "Cleaning Pro", dist: "0.7 km", score: 92 },
                    { name: "Anil M.", role: "Electrician", dist: "1.1 km", score: 89 },
                  ].map((w) => (
                    <div key={w.name} className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-white">{w.name}</div>
                          <div className="text-xs text-white/60">{w.role}</div>
                        </div>
                        <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[11px] font-semibold text-primary">
                          {w.score}% match
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-xs text-white/60">
                        <MapPin className="h-3 w-3" /> {w.dist} away
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOGOS */}
      <section className="border-y border-border bg-surface/60">
        <div className="container-page py-10">
          <p className="text-center text-xs uppercase tracking-widest text-muted-foreground">
            Trusted by 12,000+ businesses across India
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-70">
            {["Zypp", "Urban Co", "Chai Point", "Blinkit", "Lenskart", "Country Delight"].map(
              (n) => (
                <span key={n} className="text-sm font-semibold tracking-tight text-secondary/70">
                  {n}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container-page py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold text-secondary md:text-5xl">
            Hiring, reimagined for the local economy.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Built for restaurants, retailers, logistics, and service businesses that need reliable workers, fast.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Zap,
              title: "Hire in under 10 minutes",
              body: "Post a role and get qualified candidates ready to work — same day, on your block.",
            },
            {
              icon: Sparkles,
              title: "AI-matched candidates",
              body: "Our matching engine ranks workers by skill, distance, reliability, and availability.",
            },
            {
              icon: ShieldCheck,
              title: "Verified & insured",
              body: "ID-verified workers with ratings, work history, and built-in safety tools.",
            },
            {
              icon: Mic,
              title: "Voice-to-job posting",
              body: "Describe the role in your own language. Our AI structures it into a complete listing.",
            },
            {
              icon: MapPin,
              title: "Hyperlocal radius",
              body: "Match within a 1–5 km radius for faster onboarding and fewer no-shows.",
            },
            {
              icon: Briefcase,
              title: "Built for shifts & gigs",
              body: "From a 2-hour shift to a recurring gig — flexible terms that fit your business.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-surface p-6 shadow-soft transition-shadow hover:shadow-card"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-secondary">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-border bg-secondary text-white">
        <div className="container-page py-16">
          <div className="grid gap-10 md:grid-cols-4">
            {[
              { v: "240k+", l: "Verified workers" },
              { v: "12k+", l: "Active businesses" },
              { v: "8 min", l: "Average time to hire" },
              { v: "4.8★", l: "Average worker rating" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-4xl font-bold tracking-tight md:text-5xl">{s.v}</div>
                <div className="mt-2 text-sm text-white/60">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container-page py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">How it works</span>
            <h2 className="mt-3 text-4xl font-bold text-secondary md:text-5xl">
              Three steps from post to hire.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Designed for the speed of street-level business — and the rigor of an enterprise hiring platform.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { n: "01", t: "Describe your need", d: "Type or speak it. Our AI builds the job listing." },
              { n: "02", t: "Review smart matches", d: "Get ranked candidates within minutes, with full profiles." },
              { n: "03", t: "Hire and pay in-app", d: "Onboard, message, and pay — all from one dashboard." },
            ].map((s) => (
              <div
                key={s.n}
                className="flex gap-5 rounded-2xl border border-border bg-surface p-5 shadow-soft"
              >
                <div className="text-sm font-semibold text-primary">{s.n}</div>
                <div>
                  <div className="text-base font-semibold text-secondary">{s.t}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-surface/60 border-y border-border">
        <div className="container-page py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold text-secondary md:text-5xl">Loved by local teams.</h2>
            <p className="mt-4 text-muted-foreground">From kirana stores to growing D2C brands.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                q: "We staffed our entire weekend rush in two hours. The match quality is genuinely impressive.",
                n: "Meera Iyer",
                r: "Owner, Café Bloom",
              },
              {
                q: "It replaced three WhatsApp groups and a spreadsheet. Workers show up, and they're good.",
                n: "Karan Patel",
                r: "Ops Lead, GoBox Logistics",
              },
              {
                q: "The voice posting feature is magic. I post jobs while walking the floor.",
                n: "Anita Rao",
                r: "Founder, Stitch & Co.",
              },
            ].map((t) => (
              <div key={t.n} className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
                <div className="flex gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-secondary">"{t.q}"</p>
                <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-muted text-sm font-semibold text-secondary">
                    {t.n[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-secondary">{t.n}</div>
                    <div className="text-xs text-muted-foreground">{t.r}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-24">
        <div className="overflow-hidden rounded-3xl bg-secondary p-10 md:p-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="text-3xl font-bold text-white md:text-4xl">
                Ready to staff your next shift?
              </h3>
              <p className="mt-3 max-w-md text-white/70">
                Join thousands of businesses hiring smarter, faster, and closer to home.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
                >
                  Post a Job <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/5"
                >
                  Talk to sales
                </Link>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                "Free onboarding & setup",
                "Background-verified workforce",
                "Pay only when you hire",
                "Dedicated success manager",
              ].map((p) => (
                <li key={p} className="flex items-center gap-3 text-sm text-white/80">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

// keep unused icon imports out
void Users;
