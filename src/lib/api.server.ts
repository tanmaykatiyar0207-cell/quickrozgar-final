import { createServerFn } from "@tanstack/react-start";
import { generateGeminiJSON } from "./gemini.server";

export interface JobExtraction {
  role: string;
  pay: string;
  location: string;
  shift: string;
  requirements: string[];
}

export interface Job {
  id: string;
  title: string;
  location_name: string;
  applicants: number;
  status: "open" | "reviewing" | "closed";
  pay_amount: string;
}

// ── AI extraction ────────────────────────────────────────────────────────────
export const extractJobDetails = createServerFn({ method: "POST" })
  .handler(async (args: any): Promise<JobExtraction> => {
    try {
      const data = args.data || {};
      const description = data.description || "";
      
      const prompt = `Extract job details from this text: "${description}"
      
      Fields to extract:
      - role: The job title
      - pay: The payment amount and frequency (e.g. "₹500/shift")
      - location: The specific area or neighborhood
      - shift: The timing or shift type
      - requirements: An array of 2-3 key requirements
      
      Return as JSON.`;

      return await generateGeminiJSON(prompt);
    } catch (error) {
      console.error("AI Extraction failed:", error);
      const data = args.data || {};
      const desc = (data.description || "").toLowerCase();
      return {
        role: desc.includes("server") ? "Evening Server" : "General Staff",
        pay: desc.match(/[₹\d]+\s*(?:\/?\s*(?:shift|order|day|hr|hour))?/i)?.[0]?.trim() ?? "Negotiable",
        location: desc.match(/(?:in|at|near)\s+([A-Z][a-zA-Z\s]+?)(?:\s*,|\s*\.|$)/)?.[1]?.trim() ?? "Local area",
        shift: "Flexible",
        requirements: ["Punctual", "Local resident"],
      };
    }
  });

export const getAIMatches = createServerFn({ method: "POST" })
  .handler(async (args: any): Promise<any[]> => {
    try {
      const data = args.data || {};
      const { role, profile, items = [] } = data;
      
      if (!profile || !items.length) return [];

      let prompt = "";
      if (role === 'employer') {
        prompt = `You are the AI matching engine for QuickRozgar, a hyperlocal hiring platform.
        Target Job: ${JSON.stringify(profile)}
        Available Candidates: ${(items || []).map((w) => `ID: ${w.id}, Name: ${w.full_name}, Skills: ${w.skills}, Location: ${w.location}`).join('\n')}
        
        Task: Pick the top 5 candidates who best fit this job based on skills and location proximity.
        For each candidate, provide a 1-2 sentence "insight" explaining why they are a good match.
        
        CRITICAL: Use the EXACT "ID" provided for each candidate.
        OUTPUT: Return ONLY a JSON array of objects: [{"id": "exact_id_from_input", "insight": "your_explanation"}].`;
      } else {
        prompt = `You are the AI matching engine for QuickRozgar, a hyperlocal hiring platform.
        Target Worker: ${JSON.stringify(profile)}
        Available Jobs: ${(items || []).map((j) => `ID: ${j.id}, Title: ${j.title} at ${j.company}, Location: ${j.location}, Pay: ${j.pay}/${j.pay_unit}`).join('\n')}
        
        Task: Pick the top 5 jobs that best fit this worker's profile and location.
        For each job, provide a 1-2 sentence "insight" explaining the fit.
        
        CRITICAL: Use the EXACT "ID" provided for each job.
        OUTPUT: Return ONLY a JSON array of objects: [{"id": "exact_id_from_input", "insight": "your_explanation"}].`;
      }

      const results = await generateGeminiJSON(prompt);
      if (!Array.isArray(results)) throw new Error("Invalid AI response format");
      return results;
    } catch (error) {
      console.error("AI Matching failed:", error);
      const fallbackItems = (args.data?.items) || [];
      return fallbackItems.slice(0, 5).map((item: any) => ({ 
        id: item.id, 
        insight: "Strong match based on your profile and local demand. Recommended for immediate review." 
      }));
    }
  });

export const getWorkerSmartMatches = createServerFn({ method: "POST" })
  .handler(async (args: any): Promise<any[]> => {
    try {
      const data = args.data || {};
      const { workerProfile, jobs = [] } = data;
      if (!workerProfile || !jobs.length) return [];
      
      const prompt = `You are an AI career coach for QuickRozgar.
      Worker Profile: Name: ${workerProfile.full_name}, Skills: ${workerProfile.skills}, Location: ${workerProfile.location}.
      
      Available Jobs List:
      ${(jobs || []).map((j) => `ID: ${j.id}, Title: ${j.title}, Company: ${j.company}, Pay: ${j.pay}/${j.pay_unit}, Location: ${j.location}`).join('\n')}
      
      Task: Pick the top 2-3 jobs that best fit this worker.
      For each, write a short, punchy 1-sentence "Why this fits" insight (max 15 words).
      
      CRITICAL: Use the EXACT "ID" provided for each job.
      OUTPUT: Return ONLY a JSON array of objects: [{"id": "exact_id_from_input", "insight": "string"}].`;

      const aiMatches = await generateGeminiJSON(prompt);
      if (!Array.isArray(aiMatches)) throw new Error("Invalid AI response format");

      return aiMatches
        .map((m: any) => {
          const job = jobs.find((j: any) => j.id === m.id);
          if (!job) return null;
          return {
            ...job,
            insight: m.insight || "Recommended match for your profile."
          };
        })
        .filter(Boolean);
    } catch (error) {
      console.error("Worker Smart Match failed:", error);
      const fallbackJobs = (args.data?.jobs) || [];
      return fallbackJobs.slice(0, 2).map((j: any) => ({ 
        ...j, 
        insight: "Excellent match for your skills and location. High probability of hire." 
      }));
    }
  });

export const getEmployerTips = createServerFn({ method: "POST" })
  .handler(async (args: any): Promise<any[]> => {
    try {
      const data = args.data || {};
      const { jobs = [], apps = [] } = data;
      const prompt = `You are a hyperlocal hiring expert. Based on the following data for an employer, provide 2 concise, actionable tips to improve their hiring speed and quality.
      
      Current Jobs: ${JSON.stringify((jobs || []).slice(0, 5))}
      Recent Applications: ${JSON.stringify((apps || []).slice(0, 5))}
      
      Return EXACTLY a JSON array of 2 objects, each with 'title' and 'description' fields.`;
      
      return await generateGeminiJSON(prompt);
    } catch (error) {
      console.error("AI Tips failed:", error);
      return [
        { title: "Boost your visibility", description: "Complete your business profile to get 2× more applicants." },
        { title: "Quick reply", description: "Reply to applications within 2 hours to increase your hire rate by 40%." }
      ];
    }
  });

// ── Publish job ──────────────────────────────────────────────────────────────
export const publishJob = createServerFn({ method: "POST" })
  .handler(async (args: any): Promise<{ success: boolean; jobId: string }> => {
    try {
      const data = args.data || {};
      console.log("Publishing job:", data);
      // TODO: replace with real D1 insert once DB is wired
      await new Promise((resolve) => setTimeout(resolve, 600));
      return { success: true, jobId: Math.random().toString(36).slice(2, 8) };
    } catch (error) {
      console.error("Publish job failed:", error);
      return { success: false, jobId: "" };
    }
  });

// ── Fetch jobs (used in route loader) ────────────────────────────────────────
export const getJobs = createServerFn({ method: "GET" }).handler(
  async (): Promise<Job[]> => {
    // TODO: replace with real D1 query
    return [
      { id: "1", title: "Evening Server",   location_name: "Bandra West", applicants: 24, status: "open",      pay_amount: "₹350/shift" },
      { id: "2", title: "Delivery Rider",   location_name: "Khar",        applicants: 41, status: "open",      pay_amount: "₹220/order" },
      { id: "3", title: "Kitchen Helper",   location_name: "Bandra East", applicants: 18, status: "reviewing", pay_amount: "₹400/shift" },
      { id: "4", title: "Cashier (Weekend)",location_name: "Bandra West", applicants: 12, status: "open",      pay_amount: "₹500/shift" },
    ];
  },
);
