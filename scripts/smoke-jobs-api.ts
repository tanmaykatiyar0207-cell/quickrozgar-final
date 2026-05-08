import { handleJobsApi } from "../src/server/jobs";

function makeMockDb() {
  const store = new Map<string, any>();
  return {
    prepare(sql: string) {
      return {
        bind: (...values: unknown[]) => ({
          async all() {
            if (/FROM jobs WHERE id = \?/.test(sql)) {
              const id = values[0] as string;
              const row = store.get(id);
              return { results: row ? [row] : [] };
            }
            if (/FROM jobs/.test(sql)) {
              return { results: Array.from(store.values()) };
            }
            return { results: [] };
          },
          async run() {
            if (/INSERT INTO jobs/.test(sql)) {
              const [
                id,
                title,
                company_name,
                description,
                category,
                location_text,
                pay_amount,
                pay_unit,
                schedule_text,
                start_time,
                end_time,
                status,
              ] = values as any[];
              store.set(id, {
                id,
                title,
                company_name,
                description,
                category,
                location_text,
                pay_amount,
                pay_unit,
                schedule_text,
                start_time,
                end_time,
                status,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });
            }
            if (/UPDATE jobs SET/.test(sql)) {
              const id = values[values.length - 1] as string;
              const existing = store.get(id);
              if (!existing) return {};
              store.set(id, { ...existing, updated_at: new Date().toISOString() });
            }
            return {};
          },
        }),
      };
    },
  };
}

async function mustJson(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Expected JSON, got: ${text.slice(0, 200)}`);
  }
}

async function main() {
  const env = { DB: makeMockDb() };

  const createRes = await handleJobsApi(
    new Request("https://example.com/api/jobs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: "Evening Server",
        company_name: "Café Bloom",
        description: "Serve customers",
        category: "Food & Café",
        location_text: "Bandra West",
        pay_amount: 350,
        pay_unit: "shift",
        schedule_text: "Today · 6–10 PM",
      }),
    }),
    env,
  );
  if (!createRes || createRes.status !== 201) throw new Error("Create job failed");
  const created = await mustJson(createRes);
  const id = created?.job?.id as string | undefined;
  if (!id) throw new Error("Create job did not return id");

  const listRes = await handleJobsApi(new Request("https://example.com/api/jobs"), env);
  if (!listRes || listRes.status !== 200) throw new Error("List jobs failed");
  const listed = await mustJson(listRes);
  if (!Array.isArray(listed.jobs) || listed.jobs.length < 1) throw new Error("List jobs empty");

  const getRes = await handleJobsApi(new Request(`https://example.com/api/jobs/${id}`), env);
  if (!getRes || getRes.status !== 200) throw new Error("Get job failed");
  const got = await mustJson(getRes);
  if (got?.job?.id !== id) throw new Error("Get job returned wrong id");

  // Invalid ID path
  const badIdRes = await handleJobsApi(new Request("https://example.com/api/jobs/not-a-uuid"), env);
  if (!badIdRes || badIdRes.status !== 400) throw new Error("Bad id should be 400");

  console.log("OK: smoke-jobs-api");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

