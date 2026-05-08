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
  IndianRupee,
} from "lucide-react";

import logo from "@/assets/quickrozgar-logo.png";

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
        <div className="absolute inset-0 hero-aura" />
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="container-page relative pb-20 pt-20 md:pb-28 md:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary shadow-sm backdrop-blur animate-in fade-in slide-in-from-top-2 duration-700">
              <Sparkles className="h-3 w-3" />
              AI-Powered Hyperlocal Matching
            </span>
            <h1 className="mt-6 text-balance text-5xl font-bold leading-[1.05] text-secondary md:text-6xl lg:text-7xl">
              Hire nearby workers, <span className="text-gradient-brand">instantly.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              QuickRozgar matches your job to verified gig workers within walking distance — using AI that understands skills, location, and availability in real time.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
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
          <div className="mx-auto mt-20 max-w-5xl">
            <div className="rounded-[2.5rem] border border-border bg-surface p-3 shadow-elevated">
              <div className="rounded-[2rem] bg-secondary p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <Zap className="h-64 w-64 text-primary" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm font-semibold text-white/70 uppercase tracking-widest">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                      </span>
                      Live matches near Bandra West
                    </div>
                    <span className="text-xs font-medium text-white/40">Updated just now</span>
                  </div>
                  <div className="mt-10 grid gap-6 md:grid-cols-3">
                    {[
                      { name: "Rahul S.", role: "Delivery Partner", dist: "0.4 km", score: 96, color: "text-blue-400" },
                      { name: "Priya K.", role: "Cleaning Pro", dist: "0.7 km", score: 92, color: "text-emerald-400" },
                      { name: "Anil M.", role: "Electrician", dist: "1.1 km", score: 89, color: "text-amber-400" },
                    ].map((w) => (
                      <div key={w.name} className="group rounded-[1.5rem] bg-white/5 p-6 ring-1 ring-white/10 transition-all hover:bg-white/10 hover:scale-[1.03]">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-start justify-between">
                            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold text-white">
                              {w.name[0]}
                            </div>
                            <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary">
                              {w.score}% match
                            </span>
                          </div>
                          <div>
                            <div className="text-xl font-bold text-white">{w.name}</div>
                            <div className={`text-sm font-semibold ${w.color}`}>{w.role}</div>
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-sm text-white/50">
                            <MapPin className="h-4 w-4" /> {w.dist} away
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
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
              tone: "bg-[oklch(0.965_0.045_80)] text-primary",
            },
            {
              icon: Sparkles,
              title: "AI-matched candidates",
              body: "Our matching engine ranks workers by skill, distance, reliability, and availability.",
              tone: "bg-[oklch(0.95_0.04_290)] text-violet",
            },
            {
              icon: ShieldCheck,
              title: "Verified & insured",
              body: "ID-verified workers with ratings, work history, and built-in safety tools.",
              tone: "bg-[oklch(0.95_0.04_160)] text-emerald",
            },
            {
              icon: Mic,
              title: "Voice-to-job posting",
              body: "Describe the role in your own language. Our AI structures it into a complete listing.",
              tone: "bg-[oklch(0.95_0.04_15)] text-rose",
            },
            {
              icon: MapPin,
              title: "Hyperlocal radius",
              body: "Match within a 1–5 km radius for faster onboarding and fewer no-shows.",
              tone: "bg-[oklch(0.94_0.04_195)] text-teal",
            },
            {
              icon: Briefcase,
              title: "Built for shifts & gigs",
              body: "From a 2-hour shift to a recurring gig — flexible terms that fit your business.",
              tone: "bg-[oklch(0.965_0.045_80)] text-primary",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-surface p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
            >
              <span className={`grid h-11 w-11 place-items-center rounded-xl ${f.tone}`}>
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-secondary">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS BADGE */}
      <section className="container-page py-12">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-secondary text-white shadow-glow">
          <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
            <Sparkles className="h-64 w-64" />
          </div>
          <div className="relative z-10 px-8 py-16 md:px-12">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { v: "50k+", l: "AI Smart Matches", i: Sparkles, c: "text-violet-400" },
                { v: "2km", l: "Hyperlocal Radius", i: MapPin, c: "text-primary" },
                { v: "8 min", l: "Time to Hire", i: Zap, c: "text-warning" },
                { v: "4.8★", l: "Reliability Score", i: Star, c: "text-yellow-400" },
                { v: "95%", l: "Match Accuracy", i: CheckCircle2, c: "text-emerald-400" },
              ].map((s) => (
                <div key={s.l} className="group relative rounded-2xl border border-white/5 bg-white/5 p-5 transition-all hover:bg-white/10">
                  <s.i className={`h-6 w-6 ${s.c} mb-3 transition-transform group-hover:scale-110`} />
                  <div className="text-3xl font-bold tracking-tight">{s.v}</div>
                  <div className="mt-1 text-xs text-white/50 font-semibold uppercase tracking-wider">{s.l}</div>
                </div>
              ))}
            </div>
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

      {/* IMPACT SECTION */}
      <section className="bg-muted/30 border-y border-border overflow-hidden relative">
        <div className="container-page py-24 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success mb-4">
                <ShieldCheck className="h-3.5 w-3.5" /> SDG Impact Tracked
              </span>
              <h2 className="text-4xl font-bold text-secondary md:text-5xl tracking-tight leading-[1.1]">
                A measurable commitment.
              </h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                We publish quarterly impact reports tracking earnings lifted, hours formalized, and emissions saved via hyperlocal matching.
              </p>
              <div className="mt-8 flex gap-6">
                <Link to="/sdg" className="text-sm font-bold text-primary flex items-center gap-1.5 hover:underline">
                  View full report <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-3 w-full">
              {[
                { v: "₹84 Cr", l: "Wages Disbursed", i: IndianRupee, c: "text-emerald-600", bg: "bg-emerald-50" },
                { v: "1.2M", l: "Verified Shifts", i: CheckCircle2, c: "text-blue-600", bg: "bg-blue-50" },
                { v: "3.8M kg", l: "CO₂ Saved", i: Zap, c: "text-primary", bg: "bg-primary/5" },
              ].map((m) => (
                <div key={m.l} className="rounded-3xl border border-border bg-surface p-8 shadow-soft flex flex-col items-center text-center group hover:scale-[1.02] transition-transform">
                  <div className={`h-14 w-14 rounded-2xl ${m.bg} flex items-center justify-center mb-6`}>
                    <m.i className={`h-7 w-7 ${m.c}`} />
                  </div>
                  <div className="text-3xl font-bold text-secondary tracking-tight">{m.v}</div>
                  <div className="mt-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">{m.l}</div>
                </div>
              ))}
            </div>
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
