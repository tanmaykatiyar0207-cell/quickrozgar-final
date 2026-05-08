import { Link } from "@tanstack/react-router";
import { Twitter, Linkedin, Github, Heart } from "lucide-react";
import logo from "@/assets/quickrozgar-logo.png";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <img src={logo} alt="QuickRozgar" className="h-9 w-9 rounded-lg object-contain" />
              <span className="text-base font-semibold text-secondary">
                Quick<span className="text-primary">Rozgar</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              AI-powered hyperlocal hiring. Connecting businesses with nearby workers in minutes.
            </p>
          </div>

          <FooterCol
            title="Product"
            items={[
              { to: "/discover", label: "Find Work" },
              { to: "/dashboard", label: "Employer Dashboard" },
              { to: "/ai-matching", label: "AI Matching" },
            ]}
          />
          <FooterCol
            title="Company"
            items={[
              { to: "/about", label: "About" },
              { to: "/sdg", label: "Impact" },
              { to: "/contact", label: "Contact" },
            ]}
          />
          <FooterCol
            title="Resources"
            items={[
              { to: "/about", label: "Documentation" },
              { to: "/privacy", label: "Privacy" },
              { to: "/terms", label: "Terms" },
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-border pt-8 md:flex-row md:items-center">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} QuickRozgar Technologies. All rights reserved.
            </p>
            <p className="text-[11px] font-medium text-secondary/60 flex items-center gap-1">
              Crafted with <Heart className="h-3 w-3 text-rose-500 fill-rose-500 animate-pulse" /> in Bengaluru
            </p>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <a href="#" aria-label="Twitter" className="hover:text-secondary"><Twitter className="h-4 w-4" /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-secondary"><Linkedin className="h-4 w-4" /></a>
            <a href="#" aria-label="GitHub" className="hover:text-secondary"><Github className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { to: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-secondary">{title}</h4>
      <ul className="mt-4 space-y-3">
        {items.map((i) => (
          <li key={i.label}>
            <Link to={i.to} className="text-sm text-muted-foreground hover:text-secondary">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
