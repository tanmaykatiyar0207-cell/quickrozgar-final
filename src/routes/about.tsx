import { createFileRoute } from "@tanstack/react-router";
import { Target, HeartHandshake, Lightbulb, Heart, ShieldCheck, MapPin, Sparkles, CheckCircle2, Zap, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About QuickRozgar — Our Mission" },
      { name: "description", content: "Our mission, the team behind QuickRozgar, and how we're rebuilding the local job market with AI." },
    ],
  }),
  component: AboutPage,
});

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
      <div className="mt-16 grid gap-5 md:grid-cols-3 border-b border-border pb-24">
        {[
          { i: Target, t: "The problem", d: "Local hiring still happens through WhatsApp groups, posters, and word-of-mouth. Slow, opaque, exploitative." },
          { i: HeartHandshake, t: "Why it's underserved", d: "Workers without resumes or English fluency are invisible to existing platforms. Businesses can't trust who shows up." },
          { i: Lightbulb, t: "How AI helps", d: "Voice-first listings, skill inference, and live matching surface the right worker in minutes — without paperwork." },
        ].map((p) => (
          <div key={p.t} className="rounded-2xl border border-border bg-surface p-6 shadow-soft transition-transform hover:scale-[1.02]">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
              <p.i className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-secondary">{p.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
          </div>
        ))}
      </div>
      <div className="mt-32">
        <h2 className="text-3xl font-bold text-secondary md:text-4xl text-center">Our Core Principles</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            { 
              t: "Dignity First", 
              d: "We believe every worker deserves respect, clear terms, and timely payments. No hidden fees, no exploitation.",
              i: Heart
            },
            { 
              t: "Radical Transparency", 
              d: "Trust is built on data. Verified ratings, real-time tracking, and clear wage breakdowns for every shift.",
              i: ShieldCheck
            },
            { 
              t: "Hyperlocal Strength", 
              d: "Strong communities are built by people working near home. We prioritize matches within walking distance.",
              i: MapPin
            }
          ].map((p) => (
            <div key={p.t} className="text-center p-6">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <p.i className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-secondary">{p.t}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Built for the Next Billion */}
      <div className="mt-32 rounded-[2.5rem] bg-secondary p-10 md:p-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <Sparkles className="h-64 w-64" />
        </div>
        <div className="relative z-10 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">The Gemini Revolution</span>
            <h2 className="mt-4 text-4xl font-bold md:text-5xl leading-[1.1]">Built for the <span className="text-violet-400">Next Billion.</span></h2>
            <p className="mt-6 text-lg text-white/70 leading-relaxed">
              Most gig workers in India don't have a PDF resume or a LinkedIn profile. We use Gemini AI to infer skills from voice, work history, and local reliability scores.
            </p>
            <div className="mt-8 space-y-4">
              {[
                "Voice-to-listing parsing for shop owners",
                "Skill inference for workers without resumes",
                "Real-time hyper-local matching engine",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-medium">
                  <CheckCircle2 className="h-5 w-5 text-primary" /> {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glow backdrop-blur">
            <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-warning" /> AI Matching in Action
            </h4>
            <div className="space-y-3 opacity-80">
              <div className="p-3 rounded-xl bg-white/10 text-xs font-medium border border-white/5">"I need a delivery boy near Indiranagar"</div>
              <ArrowRight className="h-4 w-4 mx-auto text-white/40" />
              <div className="p-3 rounded-xl bg-primary/20 text-xs font-bold border border-primary/20 text-primary">AI matched Rahul S. (0.4km away)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sign-off */}
      <div className="mt-32 mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
        <p className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-muted/50 text-sm font-medium text-secondary">
          Crafted with <Heart className="h-4 w-4 text-rose-500 fill-rose-500 animate-pulse" /> in Bengaluru
        </p>
        <p className="mt-4 text-xs text-muted-foreground tracking-[0.3em] uppercase">
          Empowering India's Local Economy
        </p>
      </div>
    </section>
  );
}
