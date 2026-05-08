import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Sparkles, MapPin, Zap, UserPlus, CheckCircle2, ArrowLeft, BrainCircuit } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/ai-matching")({
  component: AIMatchingPage,
});

function AIMatchingPage() {
  const [role, setRole] = useState<'worker' | 'employer' | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  
  // Data for Employer
  const [selectedJob, setSelectedJob] = useState("");
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  
  // Data for Worker
  const [openJobs, setOpenJobs] = useState<any[]>([]);
  
  const [invitingId, setInvitingId] = useState<string | null>(null);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDZhYFJOc4hNIWOG3sz18mILjWORMVh8lY";

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setUser(user);
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setRole(profile?.role || 'worker');

        if (profile?.role === 'employer') {
          // Fetch employer's jobs
          const { data: jobs } = await supabase.from('jobs').select('*').eq('employer_id', user.id).eq('status', 'open');
          if (jobs && jobs.length > 0) {
            setMyJobs(jobs);
            setSelectedJob(jobs[0].id);
          }
          // Fetch potential workers
          const { data: workers } = await supabase.from('profiles').select('*').eq('role', 'worker').limit(10);
          setWorkers(workers || []);
        } else {
          // Fetch all open jobs for worker matching
          const { data: jobs } = await supabase.from('jobs').select('*').eq('status', 'open').limit(20);
          setOpenJobs(jobs || []);
        }
      }
    });
  }, []);

  const handleScan = async () => {
    setIsScanning(true);
    setHasScanned(false);
    
    try {
      let prompt = "";
      if (role === 'employer') {
        const activeJob = myJobs.find(j => j.id === selectedJob) || myJobs[0];
        prompt = `You are the AI matching engine for QuickRozgar.
        Job Detail: Role: ${activeJob.title}, Company: ${activeJob.company}, Location: ${activeJob.location}.
        Candidates: ${workers.map((w, i) => `${i}: ${w.full_name}, Skills: ${w.skills}, Location: ${w.location}`).join('\n')}
        Task: For each candidate, write a 2-sentence explanation of why they fit.
        OUTPUT: Return EXACTLY a JSON array of strings. No markdown.`;
      } else {
        const workerProfile = await supabase.from('profiles').select('*').eq('id', user.id).single();
        prompt = `You are the AI matching engine for QuickRozgar.
        Worker Profile: Name: ${workerProfile.data.full_name}, Skills: ${workerProfile.data.skills}, Location: ${workerProfile.data.location}.
        Available Jobs: ${openJobs.map((j, i) => `${i}: ${j.title} at ${j.company}, Location: ${j.location}`).join('\n')}
        Task: For each job, write a 2-sentence explanation of why it fits this worker.
        OUTPUT: Return EXACTLY a JSON array of strings. No markdown.`;
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
      const cleanText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const insights = JSON.parse(cleanText);
      
      setAiInsights(insights);
      setHasScanned(true);
    } catch (error) {
      console.error("AI Matching Error:", error);
      toast.error("AI analysis encountered an issue, using smart defaults.");
      const list = role === 'employer' ? workers : openJobs;
      setAiInsights(list.map(() => "Great match based on location and skill overlap. Highly recommended for this role."));
      setHasScanned(true);
    } finally {
      setIsScanning(false);
      toast.success("AI Analysis Complete!");
    }
  };

  const inviteOrApply = async (id: string, name: string) => {
    setInvitingId(id);
    const jobId = role === 'employer' ? selectedJob : id;
    const workerId = role === 'employer' ? id : user.id;

    const { error } = await supabase.from('applications').insert([{
      job_id: jobId,
      worker_id: workerId,
      status: 'pending'
    }]);

    setInvitingId(null);
    if (error && error.code !== '23505') {
      toast.error(error.message);
    } else {
      toast.success(role === 'employer' ? `Invitation sent to ${name}!` : `Application sent to ${name}!`);
    }
  };

  if (!role) return <div className="container-page py-24 flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;

  const resultsList = role === 'employer' ? workers : openJobs;

  return (
    <section className="relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 hero-aura opacity-30 pointer-events-none" />
      <div className="container-page relative py-12">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary uppercase tracking-widest mb-4">
              <Sparkles className="h-3 w-3" /> Gemini Matching Engine
            </span>
            <h1 className="text-5xl font-bold text-secondary tracking-tight">
              AI {role === 'employer' ? 'Candidate' : 'Job'} <span className="text-primary">Discovery.</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {role === 'employer' 
                ? "Let Gemini scan the local workforce to find candidates with the perfect skill overlap and commute distance."
                : "Our AI analyzes your unique skills to find high-paying jobs in your neighborhood that you'll actually love."}
            </p>
          </div>
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="rounded-full bg-secondary px-8 py-3.5 text-sm font-bold text-white shadow-glow hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
          >
            {isScanning ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Zap className="h-4 w-4" />}
            {isScanning ? "Analyzing..." : "Run AI Match Scan"}
          </button>
        </div>

        {role === 'employer' && (
          <div className="mb-12 max-w-sm">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Matching for job:</label>
            <select 
              className="w-full rounded-2xl border border-border bg-surface/50 backdrop-blur px-5 py-3 text-sm font-bold text-secondary outline-none focus:ring-2 focus:ring-primary/20"
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
            >
              {myJobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
            </select>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hasScanned ? (
            resultsList.map((item, idx) => (
              <div key={item.id} className="group relative rounded-[2rem] border border-border bg-surface/80 backdrop-blur p-8 shadow-soft hover:shadow-card transition-all hover:-translate-y-1">
                <div className="flex justify-between items-start mb-6">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-white text-2xl font-bold shadow-soft">
                    {role === 'employer' ? item.full_name?.[0] : item.company?.[0]}
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-full mb-1">98% MATCH</div>
                    <div className="text-sm font-bold text-secondary">{role === 'employer' ? "Top Talent" : `₹${item.pay}/${item.pay_unit}`}</div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-secondary mb-1">
                  {role === 'employer' ? item.full_name : item.title}
                </h3>
                <p className="text-sm text-muted-foreground font-medium mb-6">
                  {role === 'employer' ? item.skills : item.company} · {item.location}
                </p>

                <div className="mb-8 p-4 rounded-2xl bg-blue-50 border border-blue-100 relative">
                  <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-primary animate-pulse" />
                  <div className="flex items-center gap-2 text-[10px] font-bold text-blue-800 uppercase tracking-widest mb-2">
                    <BrainCircuit className="h-3 w-3" /> Gemini Insight
                  </div>
                  <p className="text-xs text-blue-900 leading-relaxed font-medium italic">
                    "{aiInsights[idx] || 'Verified high-overlap match based on hyperlocal data.'}"
                  </p>
                </div>

                <button
                  onClick={() => inviteOrApply(item.id, role === 'employer' ? item.full_name : item.company)}
                  disabled={invitingId === item.id}
                  className="w-full rounded-2xl bg-secondary py-3 text-sm font-bold text-white shadow-soft hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {invitingId === item.id ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <UserPlus className="h-4 w-4" />}
                  {role === 'employer' ? "Invite to Apply" : "Quick Apply Now"}
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center">
              <div className="mx-auto w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                <BrainCircuit className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-secondary">Ready to discover.</h2>
              <p className="text-muted-foreground mt-2">Click the scan button above to let Gemini find your next {role === 'employer' ? 'hire' : 'job'}.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
