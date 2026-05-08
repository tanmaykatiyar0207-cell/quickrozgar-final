import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Briefcase,
  Users,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<any>(null);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  const [onboardingStep, setOnboardingStep] = useState<'role' | 'worker_form' | 'employer_form'>('role');
  
  // Detailed Form States
  const [workerDetails, setWorkerDetails] = useState({ name: "", location: "", skill: "Delivery" });
  const [employerDetails, setEmployerDetails] = useState({ companyName: "", location: "", industry: "Food & Beverage" });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkProfile(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !data || !data.role) {
      setShowRoleSelection(true);
    } else {
      if (data.role === 'employer') {
        navigate({ to: '/dashboard' });
      } else if (data.role === 'worker') {
        navigate({ to: '/discover' });
      } else {
        setShowRoleSelection(true);
      }
    }
  };

  const handleAuth = async () => {
    if (!email || !password) return toast.error("Please fill in all fields");
    setLoading(true);
    
    try {
      const { data, error } = activeTab === 'login' 
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) throw error;
      
      if (activeTab === 'signup') {
        if (!data.session) {
          toast.success("Success! Please check your email to verify your account.");
        } else {
          toast.success("Signup successful! Let's set up your profile.");
          setSession(data.session);
          checkProfile(data.user!.id);
        }
      } else {
        toast.success("Welcome back!");
        if (data.session) {
          setSession(data.session);
          checkProfile(data.user!.id);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const finishOnboarding = async (role: 'employer' | 'worker') => {
    if (!session) return;
    setLoading(true);
    try {
      const profileData = role === 'employer' 
        ? { 
            id: session.user.id, 
            role, 
            full_name: employerDetails.companyName,
            location: employerDetails.location,
            company_name: employerDetails.companyName,
            skills: employerDetails.industry
          }
        : { 
            id: session.user.id, 
            role, 
            full_name: workerDetails.name,
            location: workerDetails.location,
            skills: workerDetails.skill,
            company_name: null
          };

      const { error } = await supabase
        .from('profiles')
        .insert([profileData]);

      if (error) throw error;
      
      toast.success(`Welcome to QuickRozgar, ${profileData.full_name}!`);
      navigate({ to: role === 'employer' ? '/dashboard' : '/discover' });
    } catch (error: any) {
      toast.error(error.message || "Failed to save profile. Make sure you ran the SQL update!");
    } finally {
      setLoading(false);
    }
  };

  if (showRoleSelection) {
    return (
      <div className="container-page flex min-h-[80vh] items-center justify-center py-12">
        <div className="max-w-2xl w-full text-center">
          
          {onboardingStep === 'role' && (
            <div className="animate-in fade-in zoom-in duration-500">
              <h1 className="text-4xl font-bold text-secondary md:text-5xl">How will you use QuickRozgar?</h1>
              <p className="mt-4 text-lg text-muted-foreground">Select your path to continue.</p>
              
              <div className="mt-12 grid gap-6 md:grid-cols-2">
                <button
                  onClick={() => setOnboardingStep('employer_form')}
                  className="group relative overflow-hidden rounded-3xl border-2 border-border bg-surface p-8 text-left transition-all hover:border-primary hover:shadow-glow"
                >
                  <div className="mb-4 inline-grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary">
                    <Briefcase className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-secondary">I am an Employer</h3>
                  <p className="mt-2 text-muted-foreground text-sm">
                    I want to post jobs, hire nearby workers, and manage my workforce instantly.
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Set up employer profile <ArrowRight className="h-4 w-4" />
                  </div>
                </button>

                <button
                  onClick={() => setOnboardingStep('worker_form')}
                  className="group relative overflow-hidden rounded-3xl border-2 border-border bg-surface p-8 text-left transition-all hover:border-violet hover:shadow-glow-violet"
                >
                  <div className="mb-4 inline-grid h-14 w-14 place-items-center rounded-2xl bg-violet-soft text-violet">
                    <Users className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-secondary">I am a Worker</h3>
                  <p className="mt-2 text-muted-foreground text-sm">
                    I want to find local gigs, earn instantly, and build my reputation nearby.
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-violet opacity-0 transition-opacity group-hover:opacity-100">
                    Set up worker profile <ArrowRight className="h-4 w-4" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {onboardingStep === 'worker_form' && (
            <div className="mx-auto max-w-md text-left animate-in slide-in-from-right-8 duration-500">
              <button onClick={() => setOnboardingStep('role')} className="text-sm text-muted-foreground hover:text-secondary mb-6 flex items-center gap-1">
                &larr; Back
              </button>
              <div className="mb-4 inline-grid h-12 w-12 place-items-center rounded-2xl bg-violet-soft text-violet">
                <Users className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold text-secondary">Worker Profile</h2>
              <p className="text-muted-foreground mt-2 mb-8">Tell us what you do so we can match you with the best nearby jobs.</p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary">Your Full Name</label>
                  <input 
                    placeholder="e.g. Rahul Sharma" 
                    value={workerDetails.name}
                    onChange={e => setWorkerDetails({...workerDetails, name: e.target.value})}
                    className="w-full rounded-xl border border-border bg-surface py-3 px-4 text-sm outline-none focus:border-violet"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary">Your Primary Skill / Work Type</label>
                  <select 
                    value={workerDetails.skill}
                    onChange={e => setWorkerDetails({...workerDetails, skill: e.target.value})}
                    className="w-full rounded-xl border border-border bg-surface py-3 px-4 text-sm outline-none focus:border-violet"
                  >
                    <option>Delivery & Logistics</option>
                    <option>Food & Café (Cook, Server)</option>
                    <option>Retail & Sales</option>
                    <option>Cleaning & Housekeeping</option>
                    <option>Skilled Trade (Plumber, Electrician)</option>
                    <option>Events & Security</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary">Your Location (Neighborhood/City)</label>
                  <input 
                    placeholder="e.g. Bandra West, Mumbai" 
                    value={workerDetails.location}
                    onChange={e => setWorkerDetails({...workerDetails, location: e.target.value})}
                    className="w-full rounded-xl border border-border bg-surface py-3 px-4 text-sm outline-none focus:border-violet"
                  />
                </div>
                
                <button 
                  onClick={() => finishOnboarding('worker')}
                  disabled={loading || !workerDetails.name || !workerDetails.location}
                  className="w-full rounded-xl bg-violet py-3.5 text-sm font-semibold text-white shadow-soft transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Start Finding Work <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {onboardingStep === 'employer_form' && (
            <div className="mx-auto max-w-md text-left animate-in slide-in-from-right-8 duration-500">
              <button onClick={() => setOnboardingStep('role')} className="text-sm text-muted-foreground hover:text-secondary mb-6 flex items-center gap-1">
                &larr; Back
              </button>
              <div className="mb-4 inline-grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary">
                <Briefcase className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold text-secondary">Employer Profile</h2>
              <p className="text-muted-foreground mt-2 mb-8">Set up your organization to start hiring local talent instantly.</p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary">Organization / Company Name</label>
                  <input 
                    placeholder="e.g. Café Bloom" 
                    value={employerDetails.companyName}
                    onChange={e => setEmployerDetails({...employerDetails, companyName: e.target.value})}
                    className="w-full rounded-xl border border-border bg-surface py-3 px-4 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary">Industry</label>
                  <select 
                    value={employerDetails.industry}
                    onChange={e => setEmployerDetails({...employerDetails, industry: e.target.value})}
                    className="w-full rounded-xl border border-border bg-surface py-3 px-4 text-sm outline-none focus:border-primary"
                  >
                    <option>Food & Beverage</option>
                    <option>Retail & E-commerce</option>
                    <option>Logistics & Delivery</option>
                    <option>Hospitality & Events</option>
                    <option>Construction & Trade</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary">Business Location</label>
                  <input 
                    placeholder="e.g. Khar West, Mumbai" 
                    value={employerDetails.location}
                    onChange={e => setEmployerDetails({...employerDetails, location: e.target.value})}
                    className="w-full rounded-xl border border-border bg-surface py-3 px-4 text-sm outline-none focus:border-primary"
                  />
                </div>
                
                <button 
                  onClick={() => finishOnboarding('employer')}
                  disabled={loading || !employerDetails.companyName || !employerDetails.location}
                  className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="container-page flex min-h-[80vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-8 shadow-elevated relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent -z-10" />
        
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-bold text-secondary tracking-tight">QuickRozgar</h2>
          <p className="text-muted-foreground mt-2 text-sm">Your portal to hyperlocal hiring & earning.</p>
        </div>

        <div className="flex rounded-xl bg-muted/50 p-1 mb-6">
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'login' ? 'bg-background shadow text-secondary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'signup' ? 'bg-background shadow text-secondary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('signup')}
          >
            Register
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="email" 
                placeholder="name@example.com" 
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <button 
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 mt-2"
            disabled={loading}
            onClick={handleAuth}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {activeTab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          By continuing, you agree to QuickRozgar's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
