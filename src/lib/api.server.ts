import { createServerFn } from "@tanstack/react-start";

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
  .validator((d: string) => d)
  .handler(async ({ data }): Promise<JobExtraction> => {
    const lower = data.toLowerCase();

    const extraction: JobExtraction = {
      role: lower.includes("server")
        ? "Evening Server"
        : lower.includes("rider") || lower.includes("delivery")
          ? "Delivery Rider"
          : lower.includes("cashier")
            ? "Cashier"
            : lower.includes("kitchen") || lower.includes("cook")
              ? "Kitchen Helper"
              : "General Staff",
      pay: data.match(/[₹\d]+\s*(?:\/?\s*(?:shift|order|day|hr|hour))?/i)?.[0]?.trim() ?? "Negotiable",
      location: data.match(/(?:in|at|near)\s+([A-Z][a-zA-Z\s]+?)(?:\s*,|\s*\.|$)/)?.[1]?.trim() ?? "Local area",
      shift: lower.includes("evening") || lower.includes("night")
        ? "Evening Shift (5 PM–10 PM)"
        : lower.includes("morning")
          ? "Morning Shift (8 AM–1 PM)"
          : lower.includes("full") || lower.includes("all day")
            ? "Full Day"
            : "Flexible",
      requirements: ["Punctual", "Local resident"],
    };

    // Simulated AI latency
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return extraction;
  });

// ── Publish job ──────────────────────────────────────────────────────────────
export const publishJob = createServerFn({ method: "POST" })
  .validator((data: JobExtraction) => data)
  .handler(async ({ data }): Promise<{ success: boolean; jobId: string }> => {
    console.log("Publishing job:", data);
    // TODO: replace with real D1 insert once DB is wired
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { success: true, jobId: Math.random().toString(36).slice(2, 8) };
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
