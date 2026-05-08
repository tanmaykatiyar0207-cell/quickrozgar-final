import { createFileRoute } from "@tanstack/react-router";
import { Mail, Twitter, Linkedin, MessageCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — QuickRozgar" },
      { name: "description", content: "Get in touch with the QuickRozgar team. Sales, support, and partnerships." },
    ],
  }),
  component: ContactPage,
});

const faqs = [
  { q: "How fast can I hire someone?", a: "Most businesses receive their first qualified application within 8 minutes of posting." },
  { q: "Are workers verified?", a: "Yes. Every worker passes ID verification, and we surface ratings and work history transparently." },
  { q: "What does it cost?", a: "Posting is free. We charge a small flat fee per successful hire — no subscriptions." },
  { q: "Which cities do you operate in?", a: "We're live in 24 Indian cities. Tell us where you are — we expand based on demand." },
  { q: "Do you support languages other than English?", a: "Yes. We support Hindi, Tamil, Marathi, Bengali, Telugu, Kannada, and 6 more." },
];

function ContactPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="container-page py-16">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        {/* Left */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Contact</span>
          <h1 className="mt-3 text-4xl font-bold text-secondary md:text-5xl">Let's talk.</h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Whether you want to hire workers, partner with us, or join the team — we'd love to hear from you.
          </p>

          <div className="mt-8 space-y-4">
            <ContactRow icon={Mail} label="Email" value="hello@quickrozgar.in" />
            <ContactRow icon={MessageCircle} label="Sales" value="sales@quickrozgar.in" />
            <ContactRow icon={Twitter} label="Twitter" value="@quickrozgar" />
            <ContactRow icon={Linkedin} label="LinkedIn" value="linkedin.com/company/quickrozgar" />
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <div className="text-sm font-semibold text-secondary">Headquarters</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Indiqube Sigma · 3rd Cross Road, Bandra West<br />
              Mumbai 400050 · India
            </p>
          </div>
        </div>

        {/* Form */}
        <form className="rounded-3xl border border-border bg-surface p-8 shadow-card">
          <div className="grid gap-4">
            <Field label="Full name" placeholder="Jane Doe" />
            <Field label="Work email" placeholder="jane@company.com" type="email" />
            <Field label="Company" placeholder="Café Bloom" />
            <div>
              <label className="text-sm font-medium text-secondary">How can we help?</label>
              <textarea
                rows={5}
                placeholder="Tell us a little about your hiring needs…"
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
            <button
              type="button"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
            >
              Send message
            </button>
            <p className="text-xs text-muted-foreground">We typically respond within 4 business hours.</p>
          </div>
        </form>
      </div>

      {/* FAQ */}
      <div className="mt-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-secondary md:text-4xl">Frequently asked</h2>
          <p className="mt-3 text-muted-foreground">Quick answers to common questions.</p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl divide-y divide-border rounded-2xl border border-border bg-surface shadow-soft">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <button
                key={f.q}
                onClick={() => setOpen(isOpen ? null : i)}
                className="block w-full text-left"
              >
                <div className="flex items-center justify-between p-6">
                  <span className="text-sm font-semibold text-secondary">{f.q}</span>
                  <span className="text-xl text-muted-foreground">{isOpen ? "−" : "+"}</span>
                </div>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-muted-foreground">{f.a}</div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-sm font-medium text-secondary">{label}</label>
      <input
        {...props}
        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="text-sm font-medium text-secondary">{value}</div>
      </div>
    </div>
  );
}
