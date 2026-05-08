-- Profiles table to store user roles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role TEXT CHECK (role IN ('employer', 'worker')) NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Jobs table to store job listings
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  pay TEXT NOT NULL,
  pay_unit TEXT NOT NULL,
  shift TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Applications table to store worker replies to jobs
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs ON DELETE CASCADE NOT NULL,
  worker_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(job_id, worker_id)
);

-- RLS (Row Level Security) - Basic setup
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Jobs: Everyone can view open jobs, employers manage their own
CREATE POLICY "Jobs are viewable by everyone" ON jobs FOR SELECT USING (true);
CREATE POLICY "Employers can insert their own jobs" ON jobs FOR INSERT WITH CHECK (auth.uid() = employer_id);
CREATE POLICY "Employers can update their own jobs" ON jobs FOR UPDATE USING (auth.uid() = employer_id);

-- Applications: Workers manage their own, employers view applications for their jobs
CREATE POLICY "Workers can view their own applications" ON applications FOR SELECT USING (auth.uid() = worker_id);
CREATE POLICY "Employers can view applications for their jobs" ON applications FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM jobs 
    WHERE jobs.id = applications.job_id 
    AND jobs.employer_id = auth.uid()
  )
);
CREATE POLICY "Workers can apply to jobs" ON applications FOR INSERT WITH CHECK (auth.uid() = worker_id);
