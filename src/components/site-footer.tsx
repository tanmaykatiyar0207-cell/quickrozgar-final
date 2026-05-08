import { Link } from "@tanstack/react-router";
import { Sparkles, Twitter, Linkedin, Github } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-primary">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="text-base font-semibold text-secondary">QuickRozgar</span>
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
              { to: "/contact", label: "Help Center" },
              { to: "/contact", label: "Privacy" },
              { to: "/contact", label: "Terms" },
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 md:flex-row md:items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} QuickRozgar Technologies. All rights reserved.
          </p>
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
