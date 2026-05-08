import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/quickrozgar-logo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/discover", label: "Find Work" },
  { to: "/dashboard", label: "Employers" },
  { to: "/ai-matching", label: "AI Matching" },
  { to: "/sdg", label: "Impact" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-primary">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-[17px] font-semibold tracking-tight text-secondary">
            QuickRozgar
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = path === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-muted text-secondary"
                    : "text-muted-foreground hover:text-secondary"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/discover"
            className="rounded-full px-4 py-2 text-sm font-medium text-secondary hover:bg-muted"
          >
            Sign in
          </Link>
          <Link
            to="/dashboard"
            className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-opacity hover:opacity-90"
          >
            Get started
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-secondary hover:bg-muted"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-secondary px-4 py-2 text-center text-sm font-medium text-secondary-foreground"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
