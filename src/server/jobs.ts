import { z } from "zod";
import { errorJson, json, methodNotAllowed, uuidSchema } from "../lib/api-utils";

type D1Like = {
  prepare: (sql: string) => {
    bind: (...values: unknown[]) => {
      all: () => Promise<{ results: unknown[] }>;
      run: () => Promise<unknown>;
    };
  };
};

type EnvWithDb = { DB?: D1Like };

type DevJobRow = {
  id: string;
  title: string;
  company_name: string;
  description: string;
  category: string;
  location_text: string;
  pay_amount: number;
  pay_unit: string;
  schedule_text: string | null;
  start_time: string | null;
  end_time: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

const payUnitSchema = z.enum(["shift", "hour", "order", "day", "job", "event"]);
const statusSchema = z.enum(["draft", "published", "closed"]);

const createJobBodySchema = z.object({
  title: z.string().min(2).max(120),
  company_name: z.string().min(2).max(120),
  description: z.string().min(2).max(4000),
  category: z.string().min(2).max(80),
  location_text: z.string().min(2).max(120),
  pay_amount: z.number().int().nonnegative(),
  pay_unit: payUnitSchema,
  schedule_text: z.string().min(1).max(120).optional(),
  start_time: z.string().datetime().optional(),
  end_time: z.string().datetime().optional(),
  status: statusSchema.optional(),
});

const patchJobBodySchema = createJobBodySchema.partial().extend({
  status: statusSchema.optional(),
});

declare global {
  // eslint-disable-next-line no-var
  var __quickrozgarDevJobsStore: Map<string, DevJobRow> | undefined;
}

function genId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
}

async function readJsonBody(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error("Expected application/json");
  }
  return await request.json();
}

function getDevJobsStore(): Map<string, DevJobRow> {
  const existing = globalThis.__quickrozgarDevJobsStore;
  if (existing) return existing;
  const store = new Map<string, DevJobRow>();
  globalThis.__quickrozgarDevJobsStore = store;
  return store;
}

function seedBangaloreJobsIfNeeded(store: Map<string, DevJobRow>, count: number) {
  if (store.size >= count) return;

  const roles = [
    { title: "Delivery Rider", category: "Delivery", pay_unit: "order", pay_amount: 220 },
    { title: "Kitchen Helper", category: "Food & Café", pay_unit: "shift", pay_amount: 450 },
    { title: "Cashier", category: "Retail", pay_unit: "shift", pay_amount: 550 },
    { title: "Housekeeping", category: "Cleaning", pay_unit: "day", pay_amount: 750 },
    { title: "Electrician", category: "Skilled", pay_unit: "job", pay_amount: 1200 },
    { title: "Waiter / Server", category: "Food & Café", pay_unit: "shift", pay_amount: 500 },
    { title: "Warehouse Picker", category: "Retail", pay_unit: "shift", pay_amount: 600 },
    { title: "Event Steward", category: "Events", pay_unit: "event", pay_amount: 1500 },
  ] as const;

  const companies = [
    "Namma Cafe",
    "QuickKart",
    "MetroMart",
    "GreenLeaf Kitchens",
    "Bengaluru Events Co.",
    "UrbanFix",
    "FreshBasket",
    "SwiftShip",
    "Indiranagar Diner",
    "Koramangala Bites",
  ];

  const areas = [
    "Koramangala",
    "Indiranagar",
    "HSR Layout",
    "Whitefield",
    "Marathahalli",
    "Bellandur",
    "MG Road",
    "JP Nagar",
    "Jayanagar",
    "Hebbal",
    "Yelahanka",
    "Electronic City",
  ];

  const schedule = [
    "Today · 10 AM–6 PM",
    "Today · 6–10 PM",
    "Tomorrow · 9 AM–5 PM",
    "Weekend · 12–8 PM",
    "Flexible",
  ];

  const now = Date.now();
  for (let i = store.size; i < count; i++) {
    const role = roles[i % roles.length];
    const company = companies[i % companies.length];
    const area = areas[i % areas.length];
    const when = schedule[i % schedule.length];

    const createdAt = new Date(now - i * 60_000).toISOString();
    const id = `dev-${i.toString().padStart(4, "0")}-${Math.random().toString(16).slice(2, 10)}`;
    store.set(id, {
      id,
      title: role.title,
      company_name: company,
      description: `Hiring in ${area}. Quick onboarding. Immediate start.`,
      category: role.category,
      location_text: `${area}, Bangalore`,
      pay_amount: role.pay_amount + ((i % 5) * 25),
      pay_unit: role.pay_unit,
      schedule_text: when === "Flexible" ? null : when,
      start_time: null,
      end_time: null,
      status: "published",
      created_at: createdAt,
      updated_at: createdAt,
    });
  }
}

function requireDbOrDevFallback(env: EnvWithDb): { mode: "d1"; db: D1Like } | { mode: "dev"; store: Map<string, DevJobRow> } {
  if (env.DB) return { mode: "d1", db: env.DB };
  const store = getDevJobsStore();
  seedBangaloreJobsIfNeeded(store, 500);
  return { mode: "dev", store };
}

export async function handleJobsApi(request: Request, env: unknown): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname;
  if (!path.startsWith("/api/jobs")) return null;

  try {
    const method = request.method.toUpperCase();
    const envWithDb = (env ?? {}) as EnvWithDb;
    const db = requireDbOrDevFallback(envWithDb);

    // /api/jobs
    if (path === "/api/jobs") {
      if (method === "GET") {
        const query = (url.searchParams.get("query") ?? "").trim();
        const category = (url.searchParams.get("category") ?? "").trim();
        const location = (url.searchParams.get("location") ?? "").trim();
        const status = (url.searchParams.get("status") ?? "").trim();
        const company = (url.searchParams.get("company") ?? "").trim();

        const where: string[] = [];
        const binds: unknown[] = [];

        if (status) {
          where.push("status = ?");
          binds.push(status);
        }
        if (company) {
          where.push("company_name = ?");
          binds.push(company);
        }
        if (category) {
          where.push("category = ?");
          binds.push(category);
        }
        if (location) {
          where.push("location_text LIKE ?");
          binds.push(`%${location}%`);
        }
        if (query) {
          where.push("(title LIKE ? OR description LIKE ? OR company_name LIKE ?)");
          binds.push(`%${query}%`, `%${query}%`, `%${query}%`);
        }

        if (db.mode === "dev") {
          const jobs = Array.from(db.store.values())
            .filter((j) => (status ? j.status === status : true))
            .filter((j) => (company ? j.company_name === company : true))
            .filter((j) => (category ? j.category === category : true))
            .filter((j) => (location ? j.location_text.toLowerCase().includes(location.toLowerCase()) : true))
            .filter((j) =>
              query
                ? (j.title + " " + j.description + " " + j.company_name)
                    .toLowerCase()
                    .includes(query.toLowerCase())
                : true,
            )
            .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
            .slice(0, 100);
          return json({ jobs });
        }

        const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
        const sql = `
        SELECT id, title, company_name, description, category, location_text, pay_amount, pay_unit,
               schedule_text, start_time, end_time, status, created_at, updated_at
        FROM jobs
        ${whereSql}
        ORDER BY created_at DESC
        LIMIT 100
      `;

        const { results } = await db.db
          .prepare(sql)
          .bind(...binds)
          .all();
        return json({ jobs: results });
      }

      if (method === "POST") {
        let body: unknown;
        try {
          body = await readJsonBody(request);
        } catch {
          return errorJson(415, "Request must be application/json");
        }

        const parsed = createJobBodySchema.safeParse(body);
        if (!parsed.success) {
          return errorJson(400, "Invalid request body", {
            issues: parsed.error.issues.map((i) => ({
              path: i.path.join("."),
              message: i.message,
            })),
          });
        }

        const nowId = genId();
        const data = parsed.data;
        const statusValue = data.status ?? "published";

        if (db.mode === "dev") {
          const nowIso = new Date().toISOString();
          const row: DevJobRow = {
            id: nowId,
            title: data.title,
            company_name: data.company_name,
            description: data.description,
            category: data.category,
            location_text: data.location_text,
            pay_amount: data.pay_amount,
            pay_unit: data.pay_unit,
            schedule_text: data.schedule_text ?? null,
            start_time: data.start_time ?? null,
            end_time: data.end_time ?? null,
            status: statusValue,
            created_at: nowIso,
            updated_at: nowIso,
          };
          db.store.set(nowId, row);
          return json({ job: row }, { status: 201 });
        }

        await db.db
          .prepare(
            `INSERT INTO jobs
          (id, title, company_name, description, category, location_text, pay_amount, pay_unit,
           schedule_text, start_time, end_time, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          )
          .bind(
            nowId,
            data.title,
            data.company_name,
            data.description,
            data.category,
            data.location_text,
            data.pay_amount,
            data.pay_unit,
            data.schedule_text ?? null,
            data.start_time ?? null,
            data.end_time ?? null,
            statusValue,
          )
          .run();

        const { results } = await db.db
          .prepare(
            `SELECT id, title, company_name, description, category, location_text, pay_amount, pay_unit,
                  schedule_text, start_time, end_time, status, created_at, updated_at
           FROM jobs WHERE id = ?`,
          )
          .bind(nowId)
          .all();

        return json({ job: results[0] ?? null }, { status: 201 });
      }

      return methodNotAllowed(["GET", "POST"]);
    }

    // /api/jobs/:id
    const match = path.match(/^\/api\/jobs\/([^/]+)$/);
    if (match) {
      const rawId = match[1];
      const idParsed = uuidSchema.safeParse(rawId);
      if (!idParsed.success) return errorJson(400, "Invalid job id");
      const id = idParsed.data;

      if (method === "GET") {
        if (db.mode === "dev") {
          const row = db.store.get(id);
          if (!row) return errorJson(404, "Job not found");
          return json({ job: row });
        }

        const { results } = await db.db
          .prepare(
            `SELECT id, title, company_name, description, category, location_text, pay_amount, pay_unit,
                  schedule_text, start_time, end_time, status, created_at, updated_at
           FROM jobs WHERE id = ?`,
          )
          .bind(id)
          .all();
        if (!results[0]) return errorJson(404, "Job not found");
        return json({ job: results[0] });
      }

      if (method === "PATCH") {
        let body: unknown;
        try {
          body = await readJsonBody(request);
        } catch {
          return errorJson(415, "Request must be application/json");
        }

        const parsed = patchJobBodySchema.safeParse(body);
        if (!parsed.success) {
          return errorJson(400, "Invalid request body", {
            issues: parsed.error.issues.map((i) => ({
              path: i.path.join("."),
              message: i.message,
            })),
          });
        }

        const data = parsed.data;
        const fields: string[] = [];
        const binds: unknown[] = [];

        for (const [key, value] of Object.entries(data)) {
          if (value === undefined) continue;
          fields.push(`${key} = ?`);
          binds.push(value);
        }

        if (!fields.length) return errorJson(400, "No fields provided");

        if (db.mode === "dev") {
          const existing = db.store.get(id);
          if (!existing) return errorJson(404, "Job not found");
          const updated: DevJobRow = {
            ...existing,
            ...(data as Partial<DevJobRow>),
            updated_at: new Date().toISOString(),
          };
          db.store.set(id, updated);
          return json({ job: updated });
        }

        fields.push(`updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`);

        await db.db
          .prepare(`UPDATE jobs SET ${fields.join(", ")} WHERE id = ?`)
          .bind(...binds, id)
          .run();

        const { results } = await db.db
          .prepare(
            `SELECT id, title, company_name, description, category, location_text, pay_amount, pay_unit,
                  schedule_text, start_time, end_time, status, created_at, updated_at
           FROM jobs WHERE id = ?`,
          )
          .bind(id)
          .all();
        if (!results[0]) return errorJson(404, "Job not found");
        return json({ job: results[0] });
      }

      return methodNotAllowed(["GET", "PATCH"]);
    }

    return errorJson(404, "Not found");
  } catch (error) {
    console.error(error);
    return errorJson(500, "Internal error");
  }
}
