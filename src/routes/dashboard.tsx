import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { extractJobDetails, getEmployerTips, getAIMatches } from "@/lib/api.server";
import {
  Plus,
  TrendingUp,
  Users,
  Briefcase,
  Clock,
  MapPin,
  Sparkles,
  MoreHorizontal,
  ArrowUpRight,
  Search,
  Loader2,
  Check,
  X,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Employer Dashboard — QuickRozgar" },
      {
        name: "description",
        content:
          "Post jobs, review nearby workers, and manage hiring from one professional dashboard.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  
  // Job Form State
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("Food & Café");
  const [pay, setPay] = useState<number>(600);
  const [payUnit, setPayUnit] = useState("shift");
  const [location, setLocation] = useState("");
  const [shift, setShift] = useState("");

  // AI Posting State
  const [aiDescription, setAiDescription] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [aiTips, setAiTips] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (data?.role === 'worker') {
          window.location.href = "/worker-dashboard";
          return;
        }
        setUser(user);
      }
      setAuthChecked(true);
    }).catch(() => {
      setAuthChecked(true);
    });
  }, []);

  // Fetch employer's jobs
  const { data: jobs = [], isLoading: isLoadingJobs } = useQuery({
    queryKey: ["my-jobs", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('employer_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: applications = [], isLoading: isLoadingApps } = useQuery({
    queryKey: ["job-applications", user?.id],
    enabled: !!user,
    queryFn: async () => {
      // 1. Fetch applications
      const { data: apps, error } = await supabase
        .from('applications')
        .select(`*, jobs (title)`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (!apps || apps.length === 0) return [];

      // 2. Fetch worker profiles manually to avoid PostgREST relationship errors
      const workerIds = [...new Set(apps.map(a => a.worker_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, skills, location')
        .in('id', workerIds);

      // 3. Map them together
      return apps.map(a => ({
        ...a,
        profiles: profiles?.find(p => p.id === a.worker_id)
      }));
    },
  });

  const activeJobs = useMemo(() => jobs.filter((j: any) => j.status === "open"), [jobs]);
  const closedJobs = useMemo(() => jobs.filter((j: any) => j.status === "closed"), [jobs]);

  // Fetch AI Tips & Matches when data is ready
  const [candidateMatches, setCandidateMatches] = useState<any[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);

  useEffect(() => {
    if (jobs.length > 0 || applications.length > 0) {
      getEmployerTips({ jobs, apps: applications })
        .then(setAiTips)
        .catch(console.error);
    }
  }, [jobs.length, applications.length]);

  useEffect(() => {
    async function fetchMatches() {
      if (activeJobs.length > 0) {
        setIsLoadingMatches(true);
        try {
          const { data: workers } = await supabase.from('profiles').select('*').eq('role', 'worker').limit(10);
          if (workers && workers.length > 0) {
            const insights = await getAIMatches({
              role: 'employer',
              profile: activeJobs[0],
              items: workers
            });
            const merged = insights.map((insightObj: any) => {
              const fullItem = workers.find(i => i.id === insightObj.id);
              return fullItem ? { ...fullItem, insight: insightObj.insight } : null;
            }).filter(Boolean);
            setCandidateMatches(merged.slice(0, 3));
          }
        } catch (error) {
          console.error("Dashboard matching error:", error);
        } finally {
          setIsLoadingMatches(false);
        }
      }
    }
    fetchMatches();
  }, [activeJobs.length]);

  const updateApplicationStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: 'accepted' | 'rejected' }) => {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      toast.success(`Application ${variables.status}!`);
      queryClient.invalidateQueries({ queryKey: ["job-applications"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update application");
    }
  });


  const createJob = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Please sign in to post a job");
      
      const { error } = await supabase
        .from('jobs')
        .insert([{
          employer_id: user.id,
          title: title.trim(),
          company: company.trim() || "My Business",
          category,
          location: location.trim(),
          pay: String(pay),
          pay_unit: payUnit,
          shift: shift.trim(),
          status: 'open'
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      setTitle("");
      setLocation("");
      setShift("");
      toast.success("Job published successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to publish job");
    },
  });

  const handleAIExtraction = async () => {
    if (!aiDescription.trim()) return toast.error("Please describe the job first!");
    
    setIsExtracting(true);
    try {
      const details = await extractJobDetails({ description: aiDescription });
      
      if (details.role) setTitle(details.role);
      if (details.pay) setPay(Number(details.pay.replace(/[^0-9]/g, '')) || 600);
      if (details.location) setLocation(details.location);
      if (details.shift) setShift(details.shift);
      
      toast.success("AI magic applied! Check the details below.");
    } catch (error) {
      console.error("AI Extraction Error:", error);
      toast.error("AI could not extract details. Please fill manually.");
    } finally {
      setIsExtracting(false);
    }
  };

  const updateJobStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { error } = await supabase
        .from('jobs')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Job status updated");
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
    },
  });

  if (!authChecked) {
    return (
      <div className="container-page py-24 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user && authChecked) {
    return (
      <div className="container-page py-24 text-center">
        <h2 className="text-2xl font-bold">Please log in to view your dashboard</h2>
        <Link to="/login" className="mt-4 inline-block text-primary font-semibold">Go to Login</Link>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 hero-aura opacity-30 pointer-events-none" />
      <div className="container-page relative py-12">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary uppercase tracking-widest mb-3">
              <ShieldCheck className="h-3 w-3" /> Employer Control Center
            </span>
            <h1 className="text-4xl font-bold text-secondary md:text-5xl tracking-tight">
              {company || user?.email?.split('@')[0]}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 backdrop-blur px-5 py-2.5 text-sm font-bold text-secondary hover:bg-muted transition-all">
              <Search className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" /> Search workers
            </button>
            <button className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-2.5 text-sm font-bold text-white shadow-glow hover:scale-105 transition-transform">
              <Plus className="h-4 w-4" /> Post a Job
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              l: "Active jobs",
              v: String(activeJobs.length),
              d: "Live & matching",
              i: Briefcase,
              c: "text-blue-600",
              bg: "bg-blue-50"
            },
            {
              l: "Closed jobs",
              v: String(closedJobs.length),
              d: "Archived",
              i: Clock,
              c: "text-slate-600",
              bg: "bg-slate-50"
            },
            { 
              l: "Applications", 
              v: String(applications.length), 
              d: "Worker replies", 
              i: Users,
              c: "text-violet-600",
              bg: "bg-violet-50"
            },
            { 
              l: "Hire rate", 
              v: "92%", 
              d: "+4% this month", 
              i: TrendingUp,
              c: "text-emerald-600",
              bg: "bg-emerald-50"
            },
          ].map((s) => (
            <div key={s.l} className="group relative rounded-3xl border border-border bg-surface/80 backdrop-blur p-6 shadow-soft transition-all hover:shadow-card hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <s.i className={`h-5 w-5 ${s.c}`} />
                </div>
                <div className="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">{s.d}</div>
              </div>
              <div className="mt-6">
                <div className="text-4xl font-bold tracking-tight text-secondary">{s.v}</div>
                <div className="mt-1 text-sm font-semibold text-muted-foreground uppercase tracking-wider">{s.l}</div>
              </div>
            </div>
          ))}
        </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Post job + listings */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Real applications (MOVED TO TOP FOR PRIORITY) */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-secondary">Incoming Applications</h3>
              <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                {applications.filter((a: any) => a.status === 'pending').length} Pending
              </span>
            </div>
            
            <div className="grid gap-4">
              {applications.map((a: any) => (
                <div
                  key={a.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-border bg-background p-5 hover:border-primary/50 hover:shadow-soft transition-all gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-violet-soft to-primary-soft text-lg font-bold text-secondary shrink-0">
                      {a.profiles?.full_name?.[0] || 'W'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-semibold text-secondary">{a.profiles?.full_name || 'Worker'}</h4>
                        {a.status === 'pending' && <span className="h-2 w-2 rounded-full bg-warning animate-pulse" title="New Application" />}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Applied for: <span className="font-semibold text-primary">{a.jobs?.title}</span>
                      </p>
                      
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        {a.profiles?.skills && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 font-medium">
                            <Briefcase className="h-3 w-3" /> {a.profiles.skills}
                          </span>
                        )}
                        {a.profiles?.location && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 font-medium">
                            <MapPin className="h-3 w-3" /> {a.profiles.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 border-t sm:border-t-0 border-border pt-4 sm:pt-0 shrink-0 w-full sm:w-auto">
                    {a.status === 'pending' ? (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button 
                          onClick={() => updateApplicationStatus.mutate({ id: a.id, status: 'rejected' })}
                          className="flex-1 sm:flex-none rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-2 text-xs font-semibold text-destructive hover:bg-destructive hover:text-white transition-colors"
                        >
                          Decline
                        </button>
                        <button 
                          onClick={() => updateApplicationStatus.mutate({ id: a.id, status: 'accepted' })}
                          className="flex-1 sm:flex-none rounded-xl bg-success px-4 py-2 text-xs font-semibold text-white shadow-soft hover:scale-105 transition-transform"
                        >
                          Accept
                        </button>
                      </div>
                    ) : (
                      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                        a.status === 'accepted' ? 'bg-success/15 text-success' : 'bg-destructive/10 text-destructive'
                      }`}>
                        {a.status === 'accepted' ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground ml-auto sm:ml-0 mt-1">
                      {new Date(a.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              
              {applications.length === 0 && !isLoadingApps && (
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-2xl bg-muted/30">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-surface mb-3 shadow-soft">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h4 className="text-base font-semibold text-secondary">No applications yet</h4>
                  <p className="text-sm text-muted-foreground text-center max-w-sm mt-1">
                    When local workers apply to your active job listings, their profiles will appear right here for your review.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick post */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-secondary">Post a new job</h3>
                <p className="text-sm text-muted-foreground">
                  Describe the role and we'll match in minutes.
                </p>
              </div>
              <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> AI Powered
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <div className="relative">
                <textarea
                  placeholder="Describe your job in natural language... (e.g. 'Need a delivery rider for Koramangala, 6-11 PM, 500 per shift')"
                  value={aiDescription}
                  onChange={(e) => setAiDescription(e.target.value)}
                  className="w-full min-h-[100px] rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                />
                <button
                  onClick={handleAIExtraction}
                  disabled={isExtracting || !aiDescription.trim()}
                  className="absolute bottom-4 right-4 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-white shadow-glow hover:scale-105 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {isExtracting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                  {isExtracting ? "Extracting..." : "Magic Extract"}
                </button>
              </div>

              <div className="flex items-center gap-2 py-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Or fill manually</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
              <input
                placeholder="Role title — e.g. Evening Server"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
              />
              <input
                placeholder="Pay amount — e.g. 350"
                value={pay || ''}
                onChange={(e) => setPay(Number(e.target.value))}
                inputMode="numeric"
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
              />
              <select
                value={payUnit}
                onChange={(e) => setPayUnit(e.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-secondary outline-none focus:border-primary"
              >
                <option value="shift">per shift</option>
                <option value="hour">per hour</option>
                <option value="order">per order</option>
                <option value="day">per day</option>
              </select>
              <input
                placeholder="Location — e.g. Bandra West"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
              />
              <input
                placeholder="Shift — Today, 6–10 PM"
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-secondary outline-none focus:border-primary md:col-span-2"
              >
                <option>Food & Café</option>
                <option>Delivery</option>
                <option>Retail</option>
                <option>Cleaning</option>
                <option>Skilled</option>
                <option>Events</option>
              </select>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <button className="text-sm font-medium text-primary hover:underline">
                + Add details
              </button>
              <button
                onClick={() => createJob.mutate()}
                disabled={createJob.isPending || title.trim().length < 2}
                className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground disabled:opacity-60 flex items-center gap-2"
              >
                {createJob.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {createJob.isPending ? "Publishing…" : "Publish job"}
              </button>
            </div>
          </div>
        </div>

          {/* Active listings */}
          <div className="rounded-2xl border border-border bg-surface shadow-soft">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h3 className="text-base font-semibold text-secondary">My job listings</h3>
              <Link to="/discover" className="text-sm font-medium text-primary hover:underline">
                View all
              </Link>
            </div>
            <ul className="divide-y divide-border">
              {jobs.slice(0, 10).map((j: any) => (
                <li key={j.id} className="flex items-center justify-between p-5">
                  <div>
                    <div className="font-medium text-secondary">{j.title}</div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {j.location}
                      </span>
                      <span>
                        ₹{j.pay}/{j.pay_unit}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        j.status === "open"
                          ? "bg-primary-soft text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {j.status === "open" ? "Open" : j.status}
                    </span>
                    {j.status === "open" ? (
                      <button
                         onClick={() => updateJobStatus.mutate({ id: j.id, status: "closed" })}
                        className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-secondary hover:bg-muted"
                      >
                        Close
                      </button>
                    ) : (
                      <button
                        onClick={() => updateJobStatus.mutate({ id: j.id, status: "open" })}
                        className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground"
                      >
                        Reopen
                      </button>
                    )}
                    <button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted" aria-label="More">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
              {jobs.length === 0 && !isLoadingJobs && (
                <li className="p-10 text-center text-sm text-muted-foreground">
                  You haven't posted any jobs yet.
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Recs */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary">
                <Sparkles className="h-4 w-4" />
              </span>
              <h3 className="text-base font-semibold text-secondary">AI Recommendations</h3>
            </div>
            <ul className="mt-5 space-y-4 text-sm">
              {aiTips.length > 0 ? (
                aiTips.map((tip, i) => (
                  <li key={i} className="rounded-xl bg-muted/60 p-4 border border-primary/5">
                    <div className="font-medium text-secondary">{tip.title}</div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {tip.description}
                    </p>
                  </li>
                ))
              ) : (
                <>
                  <li className="rounded-xl bg-muted/60 p-4">
                    <div className="font-medium text-secondary">Boost your visibility</div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Complete your business profile to get 2× more applicants.
                    </p>
                  </li>
                  <li className="rounded-xl bg-muted/60 p-4">
                    <div className="font-medium text-secondary">n8n Workflow suggestion</div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Connect your n8n webhook to get WhatsApp alerts for new applications.
                    </p>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Nearby workers */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-secondary">Top-rated workers</h3>
              <Link
                to="/ai-matching"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary"
              >
                Map view <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <ul className="mt-4 space-y-4">
              {isLoadingMatches ? (
                <div className="py-8 text-center text-xs text-muted-foreground animate-pulse">Gemini is finding the best talent...</div>
              ) : candidateMatches.length > 0 ? (
                candidateMatches.map((w) => (
                  <li key={w.id} className="group flex flex-col gap-2 rounded-2xl border border-border bg-background/50 p-4 hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary/60 text-xs font-bold text-white shadow-soft">
                          {w.full_name?.[0] || 'W'}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-secondary">{w.full_name}</div>
                          <div className="text-[10px] text-muted-foreground font-medium">{w.skills} · {w.location}</div>
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">MATCH</div>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed italic border-l-2 border-primary/20 pl-2 mt-1">
                      "{w.insight}"
                    </p>
                    <button className="mt-2 w-full rounded-xl bg-secondary/10 py-1.5 text-[10px] font-bold text-secondary hover:bg-secondary hover:text-white transition-all">
                      Invite to apply
                    </button>
                  </li>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-muted-foreground">No matches found. Post a job to start matching!</div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);
}
