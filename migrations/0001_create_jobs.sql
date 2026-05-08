-- Jobs table for QuickRozgar (D1 / SQLite)
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location_text TEXT NOT NULL,
  pay_amount INTEGER NOT NULL,
  pay_unit TEXT NOT NULL, -- shift | hour | order | day | job | event (flexible, validated in API)
  schedule_text TEXT, -- human readable (e.g. "Today · 6–10 PM")
  start_time TEXT, -- ISO8601 string (optional)
  end_time TEXT, -- ISO8601 string (optional)
  status TEXT NOT NULL DEFAULT 'published', -- draft | published | closed
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_jobs_status_created_at ON jobs (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs (category);
