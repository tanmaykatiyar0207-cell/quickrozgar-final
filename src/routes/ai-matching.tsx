import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Mic, MapPin, TrendingUp, ShieldCheck, Brain } from "lucide-react";

export const Route = createFileRoute("/ai-matching")({
  head: () => ({
    meta: [
      { title: "AI Matching — QuickRozgar" },
      { name: "description", content: "See how QuickRozgar uses AI to match jobs and workers in real time, hyperlocally." },
    ],
  }),
  component: AIMatchingPage,
});

const markers = [
  { x: 22, y: 30, n: "Rahul", s: 96 },
  { x: 48, y: 22, n: "Priya", s: 92 },
  { x: 70, y: 38, n: "Anil", s: 89 },
  { x: 36, y: 56, n: "Sana", s: 87 },
  { x: 62, y: 64, n: "Vikram", s: 84 },
  { x: 80, y: 52, n: "Neha", s: 81 },
];

function AIMatchingPage() {
  return (
    <section className="container-page py-12">
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3 w-3" /> AI Matching Engine
        </span>
        <h1 className="mt-4 text-4xl font-bold text-secondary md:text-5xl">
          Right person. Right place. Right now.
        </h1>
        <p className="mt-4 text-muted-foreground">
          A real-time engine that ranks workers by skill fit, distance, reliability, and live availability — so you hire with confidence.
        </p>
      </div>

      {/* Map + matches */}
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-surface shadow-card">
            {/* Map background */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(to right, oklch(0 0 0 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, oklch(0 0 0 / 0.06) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            {/* "Roads" */}
            <div className="absolute inset-0">
              <div className="absolute left-0 right-0 top-1/3 h-[3px] bg-muted" />
              <div className="absolute left-0 right-0 top-2/3 h-[3px] bg-muted" />
              <div className="absolute bottom-0 left-1/4 top-0 w-[3px] bg-muted" />
              <div className="absolute bottom-0 left-2/3 top-0 w-[3px] bg-muted" />
            </div>

            {/* Center pin (employer) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="absolute -inset-6 animate-ping rounded-full bg-primary/20" />
                <div className="absolute -inset-12 rounded-full bg-primary/10" />
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-elevated">
                  <MapPin className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Worker markers */}
            {markers.map((m) => (
              <div
                key={m.n}
                className="absolute flex flex-col items-center"
                style={{ left: `${m.x}%`, top: `${m.y}%`, transform: "translate(-50%, -50%)" }}
              >
                <div className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground shadow-soft">
                  {m.n} · {m.s}%
                </div>
                <div className="mt-1 h-3 w-3 rounded-full border-2 border-surface bg-secondary shadow-soft" />
              </div>
            ))}

            <div className="absolute bottom-4 left-4 rounded-xl bg-surface/90 px-3 py-2 text-xs text-muted-foreground shadow-soft backdrop-blur">
              Live · 6 candidates within 2 km
            </div>
          </div>
        </div>

        {/* Match score cards */}
        <div className="space-y-4">
          {[
            { n: "Rahul Sharma", r: "Server · 0.4 km", s: 96, why: "Top-rated café experience, available now." },
            { n: "Priya Khanna", r: "Cashier · 0.7 km", s: 92, why: "Strong POS skills, active in last 2h." },
            { n: "Anil Mehta", r: "Rider · 1.1 km", s: 89, why: "98% on-time rate, owns 2-wheeler." },
          ].map((m) => (
            <div key={m.n} className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-base font-semibold text-secondary">{m.n}</div>
                  <div className="text-xs text-muted-foreground">{m.r}</div>
                </div>
                <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
                  {m.s}% match
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${m.s}%` }} />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{m.why}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Voice-to-job */}
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-secondary p-8 text-white shadow-card">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/10"><Mic className="h-3.5 w-3.5" /></span>
            Voice-to-Job AI
          </div>
          <h3 className="mt-4 text-2xl font-semibold">"I need two delivery riders this evening, around ₹250 per order."</h3>

          <div className="mt-6 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
            <div className="text-xs uppercase tracking-widest text-white/50">Extracted listing</div>
            <dl className="mt-3 grid gap-3 text-sm">
              <Row k="Role" v="Delivery Rider × 2" />
              <Row k="Pay" v="₹250 / order" />
              <Row k="Shift" v="Today, 5–10 PM" />
              <Row k="Radius" v="2 km from your location" />
              <Row k="Required" v="Own 2-wheeler · Smartphone" />
            </dl>
          </div>
          <p className="mt-4 text-xs text-white/50">
            Supports Hindi, Tamil, Marathi, Bengali, Telugu, Kannada and 6 more.
          </p>
        </div>

        {/* Insights */}
        <div className="grid gap-4">
          {[
            { i: Brain, t: "Smart skill inference", d: "We map informal experience (e.g. 'helped at uncle's dhaba') to structured skills." },
            { i: TrendingUp, t: "Demand forecasting", d: "Predicts shift-fill probability and suggests optimal pay in real time." },
            { i: ShieldCheck, t: "Trust scoring", d: "Combines ratings, attendance, and verification to produce a single trust score." },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
                <x.i className="h-4 w-4" />
              </span>
              <div className="mt-4 text-base font-semibold text-secondary">{x.t}</div>
              <p className="mt-1 text-sm text-muted-foreground">{x.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-2 last:border-0 last:pb-0">
      <dt className="text-white/50">{k}</dt>
      <dd className="text-right font-medium text-white">{v}</dd>
    </div>
  );
}
