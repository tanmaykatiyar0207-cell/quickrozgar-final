import { createFileRoute } from "@tanstack/react-router";
import { Sprout, Briefcase, Cpu, Scale, Building2, ShieldCheck, IndianRupee, CheckCircle2, Zap } from "lucide-react";

export const Route = createFileRoute("/sdg")({
  head: () => ({
    meta: [
      { title: "Our Impact — UN SDG Alignment | QuickRozgar" },
      { name: "description", content: "How QuickRozgar advances the UN Sustainable Development Goals through hyperlocal employment." },
    ],
  }),
  component: SDGPage,
});

const sdgs = [
  {
    n: "01",
    color: "oklch(0.62 0.21 28)",
    icon: Sprout,
    title: "No Poverty",
    body: "Direct, transparent income for informal workers — without intermediaries skimming wages.",
    relevance: "78% of India's workforce is informal. Reliable daily earnings reduce income volatility for the most vulnerable households.",
  },
  {
    n: "08",
    color: "oklch(0.55 0.16 25)",
    icon: Briefcase,
    title: "Decent Work & Economic Growth",
    body: "Verified, dignified gigs with rating systems, in-app payments, and worker protections.",
    relevance: "Formalizes hidden work, builds verifiable employment history, and unlocks future credit and benefits.",
  },
  {
    n: "09",
    color: "oklch(0.55 0.13 50)",
    icon: Cpu,
    title: "Industry, Innovation & Infrastructure",
    body: "AI-native infrastructure for the world's largest informal labor market — built mobile-first, voice-ready.",
    relevance: "A new digital backbone for hyperlocal hiring — scalable across geographies and languages.",
  },
  {
    n: "10",
    color: "oklch(0.50 0.16 350)",
    icon: Scale,
    title: "Reduced Inequalities",
    body: "Voice-first onboarding and skill inference open the platform to workers without resumes or English proficiency.",
    relevance: "Removes literacy and language barriers that exclude millions from existing job platforms.",
  },
  {
    n: "11",
    color: "oklch(0.55 0.13 200)",
    icon: Building2,
    title: "Sustainable Cities & Communities",
    body: "Hyperlocal matching reduces commute time, fuel use, and urban congestion.",
    relevance: "Workers earn near home; businesses staff from their neighborhoods. Stronger, more resilient local economies.",
  },
];

function SDGPage() {
  return (
    <section className="container-page py-16">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
          UN Sustainable Development Goals
        </span>
        <h1 className="mt-5 text-4xl font-bold text-secondary md:text-6xl">
          Building work that <span className="text-primary">works for everyone.</span>
        </h1>
        <p className="mt-5 text-muted-foreground">
          QuickRozgar exists to make local employment dignified, accessible, and instant. Here's how our work aligns with five UN Sustainable Development Goals.
        </p>
      </div>

      <div className="mt-16 space-y-6">
        {sdgs.map((s, i) => (
          <article
            key={s.n}
            className="grid gap-6 rounded-3xl border border-border bg-surface p-6 shadow-soft md:grid-cols-[200px_1fr] md:p-8"
          >
            <div
              className="flex flex-col items-start justify-between rounded-2xl p-6 text-white"
              style={{ backgroundColor: s.color }}
            >
              <s.icon className="h-7 w-7" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest opacity-80">SDG</div>
                <div className="text-5xl font-bold leading-none">{s.n}</div>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                Goal {i + 1} of {sdgs.length}
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-secondary md:text-3xl">{s.title}</h2>
              <p className="mt-3 text-muted-foreground">{s.body}</p>
              <div className="mt-5 rounded-xl bg-muted/60 p-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-secondary/70">Real-world relevance</div>
                <p className="mt-1.5 text-sm text-secondary">{s.relevance}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-16 overflow-hidden rounded-[2.5rem] bg-secondary p-10 text-center text-white md:p-16 shadow-glow relative">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <ShieldCheck className="h-48 w-48" />
        </div>
        <div className="relative z-10">
          <h3 className="text-4xl font-bold md:text-5xl tracking-tight">A measurable commitment.</h3>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/60">
            We publish quarterly impact reports tracking earnings lifted, hours formalized, and emissions saved.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { v: "₹84 Cr", l: "Wages disbursed", i: IndianRupee, c: "text-emerald-400" },
              { v: "1.2M", l: "Verified shifts completed", i: CheckCircle2, c: "text-blue-400" },
              { v: "3.8M kg", l: "CO₂ saved via local matching", i: Zap, c: "text-primary" },
            ].map((x) => (
              <div key={x.l} className="rounded-2xl border border-white/10 bg-white/5 p-8 flex flex-col items-center">
                <x.i className={`h-8 w-8 ${x.c} mb-4`} />
                <div className="text-4xl font-bold tracking-tight">{x.v}</div>
                <div className="mt-2 text-sm font-semibold text-white/50 uppercase tracking-wider">{x.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
