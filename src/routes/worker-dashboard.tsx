import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Briefcase, MapPin, IndianRupee, Clock, CheckCircle2, XCircle, Search, Loader2, Star, Target, Check, X, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { getWorkerSmartMatches } from "@/lib/api.server";


export const Route = createFileRoute("/worker-dashboard")({
  component: WorkerDashboard,
});

function WorkerDashboard() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setUser(user);
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data?.role === 'employer') {
          window.location.href = "/dashboard";
          return;
        }
        setProfile(data);
      }
      setAuthChecked(true);
    });
  }, []);

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["worker-applications", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id, 
          status, 
          created_at,
          jobs (
            id, title, company, pay, pay_unit, location, shift
          )
        `)
        .eq('worker_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const updateApplicationStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: 'accepted' | 'rejected' }) => {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      toast.success(variables.status === 'accepted' ? "Invitation Accepted!" : "Invitation Declined");
      queryClient.invalidateQueries({ queryKey: ["worker-applications"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update status");
    }
  });

  if (!authChecked || isLoading) {
    return (
      <div className="container-page py-24 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-page py-24 text-center">
        <h2 className="text-2xl font-bold">Please log in to view your dashboard</h2>
        <Link to="/login" className="mt-4 inline-block text-primary font-semibold">Go to Login</Link>
      </div>
    );
  }

  const acceptedCount = applications.filter((a: any) => a.status === 'accepted').length;

  return (
    <section className="relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 hero-aura opacity-30 pointer-events-none" />
      <div className="container-page relative py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-primary/20 blur animate-pulse" />
              <div className="relative grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-primary to-blue-600 text-4xl font-bold text-white shadow-glow">
                {profile?.full_name?.[0] || 'W'}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-4xl font-bold text-secondary tracking-tight">{profile?.full_name || 'Worker Profile'}</h1>
                <span className="rounded-full bg-success/15 px-3 py-1 text-[10px] font-bold text-success uppercase tracking-widest flex items-center gap-1 border border-success/20">
                  <ShieldCheck className="h-3 w-3" /> Verified Partner
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-muted-foreground">
                <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-primary" /> {profile?.skills || 'General Gig Worker'}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> {profile?.location || 'Bangalore'}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/discover" className="rounded-full bg-secondary px-6 py-3 text-sm font-bold text-white shadow-glow hover:scale-105 transition-transform flex items-center gap-2">
              <Search className="h-4 w-4" /> Browse New Jobs
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {[
            { 
              l: "Applications", 
              v: String(applications.length), 
              d: "Tracked listings", 
              i: Target,
              c: "text-blue-600",
              bg: "bg-blue-50"
            },
            { 
              l: "Jobs Secured", 
              v: String(acceptedCount), 
              d: "Verified hires", 
              i: CheckCircle2,
              c: "text-emerald-600",
              bg: "bg-emerald-50"
            },
            { 
              l: "Reliability", 
              v: "4.9", 
              d: "Top 2% in Bangalore", 
              i: Star,
              c: "text-amber-600",
              bg: "bg-amber-50"
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
                <div className="text-4xl font-bold tracking-tight text-secondary">{s.v}{s.l === "Reliability" && <span className="text-xl text-muted-foreground">/5</span>}</div>
                <div className="mt-1 text-sm font-semibold text-muted-foreground uppercase tracking-wider">{s.l}</div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Recommendations */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary">
              <Sparkles className="h-4 w-4" />
            </span>
            <h2 className="text-2xl font-bold text-secondary">Smart AI Matches</h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <WorkerAIMatches workerProfile={profile} />
          </div>
        </div>

      <div className="rounded-2xl border border-border bg-surface shadow-card overflow-hidden">
        <div className="border-b border-border p-6 bg-muted/20">
          <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" /> My Job Activity & Invitations
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Respond to employer invitations or track your sent applications.</p>
        </div>

        <div className="divide-y divide-border">
          {applications.map((app: any) => {
            const job = app.jobs;
            if (!job) return null;

            return (
              <div key={app.id} className="p-6 hover:bg-muted/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-secondary">{job.title}</h3>
                    <span className="rounded-md bg-secondary/5 px-2 py-0.5 text-xs font-semibold text-secondary">
                      {job.company}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
                    <span className="flex items-center gap-1 font-semibold text-secondary"><IndianRupee className="h-4 w-4" /> {job.pay} / {job.pay_unit}</span>
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {job.shift}</span>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                  {app.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateApplicationStatus.mutate({ id: app.id, status: 'rejected' })}
                        className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-secondary hover:bg-muted transition-colors"
                      >
                        Decline
                      </button>
                      <button 
                        onClick={() => updateApplicationStatus.mutate({ id: app.id, status: 'accepted' })}
                        className="rounded-xl bg-success px-4 py-2 text-xs font-bold text-white shadow-soft hover:scale-105 transition-transform"
                      >
                        Accept Job
                      </button>
                    </div>
                  )}
                  {app.status === 'accepted' && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 border border-success/20 px-4 py-1.5 text-sm font-bold text-success">
                      <CheckCircle2 className="h-4 w-4" /> Hired / Accepted
                    </span>
                  )}
                  {app.status === 'rejected' && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 border border-destructive/20 px-4 py-1.5 text-sm font-bold text-destructive">
                      <XCircle className="h-4 w-4" /> Not Selected
                    </span>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">
                    Updated {new Date(app.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })}

          {applications.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-muted mb-4">
                <Briefcase className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold text-secondary">No activity yet</h3>
              <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
                You haven't applied to any jobs yet, and no employers have invited you. Head over to the Find Work page to get started!
              </p>
              <Link to="/discover" className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white hover:scale-105 transition-transform">
                Explore Jobs
              </Link>
            </div>
          )}
        </div>
        </div>
      </div>
    </section>
  );
}

function WorkerAIMatches({ workerProfile }: { workerProfile: any }) {
  const queryClient = useQueryClient();
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function getMatches() {
      if (!workerProfile) return;
      
      try {
        // 1. Fetch open jobs
        const { data: jobs } = await supabase
          .from('jobs')
          .select('*')
          .eq('status', 'open')
          .limit(10);
        
        if (!jobs || jobs.length === 0) {
          setIsLoading(false);
          return;
        }

        // 2. Ask Gemini to find the best match via server function
        const result = await getWorkerSmartMatches({ workerProfile, jobs });

        setMatches(result);
      } catch (err) {
        console.error("Worker AI Match Error:", err);
        // Fallback for demo
        setMatches([
          { id: 'mock-1', title: "Premium Delivery Partner", company: "Zomato", pay: "450", pay_unit: "shift", location: "Indiranagar", insight: "High demand for your delivery skills in this premium area." },
          { id: 'mock-2', title: "Retail Associate", company: "Lenskart", pay: "600", pay_unit: "day", location: "Koramangala", insight: "Matches your customer handling experience and is near your location." }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
    getMatches();
  }, [workerProfile]);


  const applyMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sign in to apply");
      
      const { error } = await supabase
        .from('applications')
        .insert([{ job_id: jobId, worker_id: user.id }]);
        
      if (error && error.code !== '23505') throw error;
    },
    onSuccess: () => {
      toast.success("Applied via Smart Match!");
      queryClient.invalidateQueries({ queryKey: ["worker-applications"] });
    }
  });

  if (isLoading) return <div className="col-span-full h-32 flex items-center justify-center border-2 border-dashed border-border rounded-3xl animate-pulse">Scanning best matches for you...</div>;

  return (
    <>
      {matches.map((j) => (
        <div key={j.id} className="rounded-3xl border border-primary/20 bg-surface/50 p-6 shadow-soft hover:shadow-card transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full">Recommended</span>
              <h3 className="mt-2 text-xl font-bold text-secondary">{j.title}</h3>
              <p className="text-sm text-muted-foreground">{j.company} · {j.location}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-secondary">₹{j.pay}</div>
              <div className="text-[10px] text-muted-foreground uppercase">{j.pay_unit}</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 rounded-xl bg-violet-50 border border-violet-100 flex gap-2 items-start">
            <Zap className="h-4 w-4 text-violet-600 shrink-0 mt-0.5" />
            <p className="text-xs text-violet-900 leading-relaxed font-medium">
              {j.insight}
            </p>
          </div>

          <button 
            onClick={() => applyMutation.mutate(j.id)}
            disabled={applyMutation.isPending}
            className="mt-5 w-full rounded-2xl bg-secondary py-2.5 text-sm font-bold text-white shadow-soft hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {applyMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            {applyMutation.isPending ? "Applying..." : "Quick Apply"}
          </button>
        </div>
      ))}
    </>
  );
}
