import { createFileRoute } from "@tanstack/react-router";
import { Scale, CheckCircle2, AlertTriangle, Briefcase, Zap, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | QuickRozgar" },
      { name: "description", content: "The rules and guidelines for using the QuickRozgar platform." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const terms = [
    {
      title: "Platform Purpose",
      icon: Briefcase,
      content: "QuickRozgar is a marketplace connecting hyperlocal workers with employers. We do not employ the workers listed on the platform; we facilitate the connection and management of short-term gigs.",
    },
    {
      title: "User Verification",
      icon: CheckCircle2,
      content: "All users must provide valid information. Misrepresentation of skills (for workers) or job details (for employers) can lead to immediate account suspension to protect community trust.",
    },
    {
      title: "AI Matching Disclaimer",
      icon: Zap,
      content: "Our AI matching engine provides recommendations based on available data. While highly accurate, we do not guarantee employment or the absolute suitability of any candidate or job.",
    },
    {
      title: "Prohibited Conduct",
      icon: AlertTriangle,
      content: "Users may not use the platform for illegal activities, harassment, or circumventing the platform's booking systems. QuickRozgar reserves the right to moderate all content.",
    },
  ];

  return (
    <section className="relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 hero-aura opacity-30 pointer-events-none" />
      <div className="container-page relative py-16 max-w-4xl">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary uppercase tracking-widest mb-4">
            Last Updated: May 2026
          </span>
          <h1 className="text-5xl font-bold text-secondary tracking-tight">Terms of <span className="text-primary">Service.</span></h1>
          <p className="mt-4 text-lg text-muted-foreground">The legal framework that ensures a fair and safe experience for everyone.</p>
        </div>

        <div className="space-y-8">
          {terms.map((t) => (
            <div key={t.title} className="rounded-[2.5rem] border border-border bg-surface/80 backdrop-blur p-10 shadow-soft">
              <div className="flex items-center gap-5 mb-6">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-white shadow-glow">
                  <t.icon className="h-7 w-7" />
                </div>
                <h2 className="text-3xl font-bold text-secondary">{t.title}</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">{t.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border-2 border-dashed border-border p-10 text-center">
          <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-bold text-secondary">Have questions about these terms?</h3>
          <p className="mt-2 text-muted-foreground">Our legal and support teams are here to help you understand your rights.</p>
          <button className="mt-8 rounded-full bg-primary px-8 py-3 text-sm font-bold text-white shadow-glow hover:scale-105 transition-transform">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
}
