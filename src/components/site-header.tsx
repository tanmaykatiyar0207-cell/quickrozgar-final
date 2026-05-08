import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, Sparkles, Zap, ChevronRight } from "lucide-react";
import logo from "@/assets/quickrozgar-logo.png";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const links = [
  { to: "/", label: "Home" },
  { to: "/discover", label: "Find Work" },
  { to: "/ai-matching", label: "AI Matching", icon: Sparkles },
  { to: "/sdg", label: "Impact" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate({ to: "/" });
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "py-3 bg-white border-b border-border shadow-soft" 
        : "py-5 bg-transparent"
    }`}>
      <div className="container-page flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute -inset-2 rounded-xl bg-primary/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <img src={logo} alt="QuickRozgar" className="relative h-10 w-10 rounded-xl object-contain shadow-sm transition-transform group-hover:scale-110" />
          </div>
          <span className="text-xl font-black tracking-tight text-secondary">
            Quick<span className="text-primary">Rozgar</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex bg-surface rounded-full px-2 py-1.5 border border-border">
          {links.map((l) => {
            const active = path === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                  active
                    ? "text-secondary"
                    : "text-muted-foreground hover:text-secondary"
                }`}
              >
                {active && (
                  <div className="absolute inset-0 rounded-full bg-white shadow-soft -z-10" />
                )}
                {l.icon && <l.icon className={`h-3.5 w-3.5 ${active ? "text-primary" : "text-muted-foreground"}`} />}
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <>
              <Link
                to="/dashboard"
                className="rounded-full px-5 py-2.5 text-sm font-bold text-secondary hover:bg-muted transition-all inline-flex items-center gap-2"
              >
                <User className="h-4 w-4 text-primary" /> Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full bg-secondary/5 hover:bg-secondary/10 px-5 py-2.5 text-sm font-bold text-secondary transition-all inline-flex items-center gap-2 border border-secondary/10"
              >
                <LogOut className="h-4 w-4" /> Exit
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full px-5 py-2.5 text-sm font-bold text-secondary hover:text-primary transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/login"
                className="rounded-full bg-secondary px-6 py-2.5 text-sm font-bold text-white shadow-glow hover:scale-105 transition-transform flex items-center gap-2"
              >
                Get started <ChevronRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-full p-2.5 md:hidden bg-surface border border-border shadow-soft"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="fixed inset-x-0 top-[72px] p-4 md:hidden animate-in slide-in-from-top-4 duration-300">
          <div className="rounded-[2rem] border border-border bg-white p-6 shadow-elevated">
            <nav className="flex flex-col gap-2">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between rounded-2xl px-4 py-4 text-base font-bold ${
                    path === l.to 
                      ? "bg-primary/10 text-secondary" 
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {l.icon && <l.icon className="h-5 w-5 text-primary" />}
                    {l.label}
                  </span>
                  <ChevronRight className="h-4 w-4 opacity-30" />
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-border/50">
                {!session ? (
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center justify-center rounded-2xl bg-secondary py-4 text-center text-sm font-bold text-white shadow-glow"
                  >
                    Get started now
                  </Link>
                ) : (
                  <button
                    onClick={() => { setOpen(false); handleLogout(); }}
                    className="flex w-full items-center justify-center rounded-2xl bg-destructive/10 py-4 text-center text-sm font-bold text-destructive"
                  >
                    Log out of account
                  </button>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
