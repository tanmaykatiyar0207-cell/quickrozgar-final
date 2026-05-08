import { createFileRoute } from "@tanstack/react-router";
import { Shield, Lock, Eye, FileText, Globe, Server } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | QuickRozgar" },
      { name: "description", content: "How we protect your data and privacy at QuickRozgar." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const sections = [
    {
      title: "Data We Collect",
      icon: Eye,
      content: "We collect information you provide directly to us: full name, phone number, skills, and professional photos. For employers, we collect business names and job requirements.",
    },
    {
      title: "Location Data",
      icon: Globe,
      content: "QuickRozgar is a hyperlocal platform. We collect precise location data to match workers with jobs in their immediate neighborhood. You can disable this, but matching will be less accurate.",
    },
    {
      title: "AI Processing",
      icon: Shield,
      content: "We use Google Gemini AI to analyze skillsets and job descriptions. This processing happens securely, and your personal identifying information is minimized during the matching phase.",
    },
    {
      title: "Third-Party Services",
      icon: Server,
      content: "We use Supabase for secure authentication and database management. Your data is encrypted at rest and in transit using industry-standard protocols.",
    },
  ];

  return (
    <section className="relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 hero-aura opacity-30 pointer-events-none" />
      <div className="container-page relative py-16 max-w-4xl">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary uppercase tracking-widest mb-4">
            Effective: May 2026
          </span>
          <h1 className="text-5xl font-bold text-secondary tracking-tight">Privacy <span className="text-primary">Policy.</span></h1>
          <p className="mt-4 text-lg text-muted-foreground">Your trust is our most valuable asset. Here's how we handle your information.</p>
        </div>

        <div className="grid gap-8">
          {sections.map((s) => (
            <div key={s.title} className="rounded-[2rem] border border-border bg-surface/80 backdrop-blur p-8 shadow-soft">
              <div className="flex items-center gap-4 mb-4">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-secondary">{s.title}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-secondary p-10 text-white shadow-glow relative overflow-hidden">
          <Lock className="absolute -bottom-4 -right-4 h-48 w-48 opacity-10" />
          <div className="relative z-10">
            <h3 className="text-3xl font-bold">Data Sovereignty</h3>
            <p className="mt-4 text-white/70 max-w-2xl leading-relaxed">
              You own your data. You can request a full export of your profile or permanent deletion of your account at any time through your dashboard settings.
            </p>
            <div className="mt-8 flex gap-4">
              <div className="flex items-center gap-2 text-sm font-bold bg-white/10 px-4 py-2 rounded-full">
                <FileText className="h-4 w-4" /> GDPR Compliant
              </div>
              <div className="flex items-center gap-2 text-sm font-bold bg-white/10 px-4 py-2 rounded-full">
                <Shield className="h-4 w-4" /> ISO Certified
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
