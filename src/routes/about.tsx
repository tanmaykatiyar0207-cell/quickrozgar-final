import { createFileRoute } from "@tanstack/react-router";
import { Target, HeartHandshake, Lightbulb } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About QuickRozgar — Our Mission" },
      { name: "description", content: "Our mission, the team behind QuickRozgar, and how we're rebuilding the local job market with AI." },
    ],
  }),
  component: AboutPage,
});

const team = [
  { n: "Aarav Mehta", r: "Co-founder & CEO", b: "Ex-Swiggy. 8 years scaling hyperlocal ops." },
  { n: "Sneha Iyer", r: "Co-founder & CTO", b: "ML at Flipkart. IIT Bombay." },
  { n: "Rohan Das", r: "Head of Trust & Safety", b: "Ex-Uber India. Built rider verification." },
  { n: "Maya Khurana", r: "Head of Product", b: "Designer-turned-PM. Ex-Razorpay." },
];

const timeline = [
  { y: "2023", t: "QuickRozgar founded in Mumbai" },
  { y: "2024", t: "Launched in 6 cities · 50k workers onboarded" },
  { y: "2025", t: "Series A · Voice-first AI launched" },
  { y: "2026", t: "240k+ verified workers across 24 cities" },
];

function AboutPage() {
  return (
    <section className="container-page py-16">
      {/* Vision */}
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">Our mission</span>
        <h1 className="mt-4 text-4xl font-bold text-secondary md:text-6xl">
          Make local work dignified, instant, and fair.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Half a billion Indians work in the informal economy. We're building the digital infrastructure that finally treats them — and the businesses that need them — like the backbone of the country they are.
        </p>
      </div>

      {/* Pillars */}
      <div className="mt-16 grid gap-5 md:grid-cols-3">
        {[
          { i: Target, t: "The problem", d: "Local hiring still happens through WhatsApp groups, posters, and word-of-mouth. Slow, opaque, exploitative." },
          { i: HeartHandshake, t: "Why it's underserved", d: "Workers without resumes or English fluency are invisible to existing platforms. Businesses can't trust who shows up." },
          { i: Lightbulb, t: "How AI helps", d: "Voice-first listings, skill inference, and live matching surface the right worker in minutes — without paperwork." },
        ].map((p) => (
          <div key={p.t} className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
              <p.i className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-secondary">{p.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
          </div>
        ))}
      </div>

      {/* Team */}
      <div className="mt-24">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-bold text-secondary md:text-4xl">The team</h2>
          <span className="text-sm text-muted-foreground">Mumbai · Bengaluru · Remote</span>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {team.map((m) => (
            <div key={m.n} className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-base font-semibold text-secondary-foreground">
                {m.n.split(" ").map((x) => x[0]).join("")}
              </div>
              <div className="mt-4 text-base font-semibold text-secondary">{m.n}</div>
              <div className="text-xs font-medium text-primary">{m.r}</div>
              <p className="mt-2 text-sm text-muted-foreground">{m.b}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-24 grid gap-12 md:grid-cols-[280px_1fr]">
        <div>
          <h2 className="text-3xl font-bold text-secondary md:text-4xl">Our journey</h2>
          <p className="mt-3 text-muted-foreground">Three years, one mission, growing fast.</p>
        </div>
        <ol className="relative space-y-8 border-l border-border pl-6">
          {timeline.map((t) => (
            <li key={t.y} className="relative">
              <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-background bg-primary" />
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">{t.y}</div>
              <div className="mt-1 text-base text-secondary">{t.t}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
