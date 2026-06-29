PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS profiles (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  target_role TEXT NOT NULL DEFAULT '',
  major TEXT NOT NULL DEFAULT '',
  graduation TEXT NOT NULL DEFAULT '',
  weekly_hours INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected')),
  deadline TEXT,
  link TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS certifications (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  target TEXT,
  link TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  stack TEXT NOT NULL,
  stage TEXT NOT NULL CHECK (stage IN ('Planning', 'Building', 'Published', 'Improving')),
  link TEXT,
  impact TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Data', 'AI', 'Software', 'Cloud', 'Business')),
  level INTEGER NOT NULL DEFAULT 0 CHECK (level BETWEEN 0 AND 100),
  evidence TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS networking (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  organization TEXT,
  status TEXT NOT NULL CHECK (status IN ('To contact', 'Messaged', 'Met', 'Follow up')),
  next TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS interviews (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  company TEXT,
  type TEXT NOT NULL CHECK (type IN ('Behavioral', 'Technical', 'Case', 'Portfolio review')),
  date TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS goals (
  id TEXT PRIMARY KEY,
  goal TEXT NOT NULL,
  category TEXT,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  due TEXT,
  next_step TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resume_notes (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  body TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity (
  id TEXT PRIMARY KEY,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO profiles (id) VALUES (1);
INSERT OR IGNORE INTO resume_notes (id) VALUES (1);
