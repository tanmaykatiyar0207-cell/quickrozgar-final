import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, MapPin, Clock, IndianRupee, Bookmark, SlidersHorizontal, Loader2, Check, Briefcase } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Find Work Near You — QuickRozgar" },
      {
        name: "description",
        content: "Discover verified gig and shift work nearby. Filter by skill, distance, and pay.",
      },
    ],
  }),
  component: DiscoverPage,
});

const categories = ["All", "Recent", "Delivery", "Food & Café", "Retail", "Cleaning", "Skilled", "Events"];

function DiscoverPage() {
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const fallbackJobs = [
    { id: "mock-1", title: "Evening Server", company: "Café Bloom", category: "Food & Café", location: "Bandra West", pay: "400", pay_unit: "shift", shift: "6 PM - 10 PM" },
    { id: "mock-2", title: "Delivery Rider", company: "Quick Eats", category: "Delivery", location: "Andheri", pay: "250", pay_unit: "order", shift: "Flexible" },
    { id: "mock-3", title: "Retail Assistant", company: "Style Boutique", category: "Retail", location: "Juhu", pay: "500", pay_unit: "shift", shift: "Morning Shift" },
    { id: "mock-4", title: "Event Helper", company: "Grand Events", category: "Events", location: "BKC", pay: "800", pay_unit: "day", shift: "Full Day" },
  ];

  // Fetch jobs from Supabase
  const { data: dbJobs = [], isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const jobs = dbJobs.length > 0 ? dbJobs : fallbackJobs;

  // Fetch user's applications to show "Applied" state
  const { data: myApplications = [] } = useQuery({
    queryKey: ["my-applications"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('applications')
        .select('job_id')
        .eq('worker_id', user.id);
      
      if (error) throw error;
      return data.map(a => a.job_id);
    },
  });

  // Apply mutation
  const applyMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please sign in to apply");

      if (jobId.startsWith('mock-')) {
        await new Promise(r => setTimeout(r, 600)); // Simulate network
        return; // Skip DB insert for mock jobs
      }

      const { error } = await supabase
        .from('applications')
        .insert([{ job_id: jobId, worker_id: user.id }]);

      if (error) {
        if (error.code === '23505') throw new Error("Already applied to this job");
        throw error;
      }
    },
    onSuccess: (_, jobId) => {
      toast.success("Application sent successfully!");
      if (!jobId.startsWith('mock-')) {
        queryClient.invalidateQueries({ queryKey: ["my-applications"] });
      } else {
        // Manually update mock application state for immediate feedback
        queryClient.setQueryData(["my-applications"], (old: any) => [...(old || []), jobId]);
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to apply");
    }
  });

  const filtered = useMemo(() => {
    let result = jobs;

    // Search query filter
    if (q) {
      result = result.filter(
        (j: any) =>
          j.title.toLowerCase().includes(q.toLowerCase()) ||
          j.company.toLowerCase().includes(q.toLowerCase()) ||
          j.location.toLowerCase().includes(q.toLowerCase())
      );
    }

    // Category filter
    if (cat === "Recent") {
      // Jobs are already sorted by created_at DESC from Supabase
      // Just slice the top 30 newest jobs to feel curated
      result = result.slice(0, 30);
    } else if (cat !== "All") {
      result = result.filter((j: any) => j.category === cat);
    }

    return result;
  }, [q, cat, jobs]);

  return (
    <section className="relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 hero-aura opacity-20 pointer-events-none" />
      <div className="container-page relative py-12">
        <div className="max-w-2xl mb-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary uppercase tracking-widest mb-4">
            <Briefcase className="h-3 w-3" /> Hyperlocal Opportunities
          </span>
          <h1 className="text-5xl font-bold text-secondary md:text-6xl tracking-tight leading-[0.9]">
            Find work <span className="text-primary">nearby.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Browse verified roles in your neighborhood. AI-powered matching ensures you find the right shift in minutes.
          </p>
        </div>

      {/* Search */}
      <div className="mt-8 flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by role, area, or company"
            className="w-full rounded-full border border-border bg-surface py-3.5 pl-11 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
          />
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium text-secondary hover:bg-muted">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
      </div>

      {/* Categories */}
      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => {
          const active = c === cat;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                active
                  ? "border-secondary bg-secondary text-secondary-foreground"
                  : "border-border bg-surface text-secondary hover:bg-muted"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Results */}
      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Loading…" : `${filtered.length} jobs near you`}
        </p>
        <select className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-secondary">
          <option>Sort: Nearest</option>
          <option>Sort: Highest pay</option>
          <option>Sort: Newest</option>
        </select>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {filtered.map((j: any) => {
          const isApplied = myApplications.includes(j.id);
          const isApplying = applyMutation.variables === j.id && applyMutation.isPending;

          return (
            <article
              key={j.id}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-soft transition-shadow hover:shadow-card"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-medium text-primary">{j.category}</div>
                    <h3 className="mt-1 text-lg font-semibold text-secondary">{j.title}</h3>
                    <div className="mt-1 text-sm text-muted-foreground">{j.company}</div>
                  </div>
                  <button className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-secondary">
                    <Bookmark className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-secondary">
                    Verified
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {j.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {j.shift}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-secondary">
                    <IndianRupee className="h-3 w-3" />
                    {j.pay}/{j.pay_unit}
                  </span>
                </div>
                <button 
                  onClick={() => applyMutation.mutate(j.id)}
                  disabled={isApplied || isApplying}
                  className={`rounded-full px-5 py-2 text-xs font-semibold transition-all flex items-center gap-2 ${
                    isApplied 
                      ? "bg-success/10 text-success border border-success/20" 
                      : "bg-primary text-primary-foreground hover:scale-105"
                  }`}
                >
                  {isApplying ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : isApplied ? (
                    <><Check className="h-3 w-3" /> Applied</>
                  ) : (
                    "Apply"
                  )}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);
}


