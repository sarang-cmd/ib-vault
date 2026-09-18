#!/usr/bin/env python3
"""
Generate updated migration SQL with randomized September 2025 dates.
"""
import random
from datetime import date, timedelta

# Read the current migration to get the resource data
with open('supabase/migrations/01_resources.sql', 'r') as f:
    content = f.read()

# Extract the INSERT values section
import re
# Find all VALUES tuples
pattern = r"\(\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*(\d+)\s*,\s*(TRUE|FALSE)\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*\)"
matches = re.findall(pattern, content)

# September 2025 date range: 2025-09-01 to 2025-09-30
start_date = date(2025, 9, 1)
end_date = date(2025, 9, 30)

resources = []
for m in matches:
    resources.append({
        'id': m[0],
        'name': m[1],
        'url': m[2],
        'description': m[3],
        'category': m[4],
        'cost': m[5],
        'rank': int(m[6]),
        'is_new': m[7] == 'TRUE',
        'added_date': m[8],
        'status': m[9]
    })

# Generate random September dates for each resource
# Keep some as "is_new" = TRUE with recent dates (last week of Sept)
september_dates = []
for i in range(len(resources)):
    random_days = random.randint(0, 29)
    new_date = start_date + timedelta(days=random_days)
    september_dates.append(new_date.isoformat())

# Shuffle to randomize
random.shuffle(september_dates)

# Assign dates - keep is_new resources with later dates
for i, r in enumerate(resources):
    if r['is_new']:
        # Assign a date in the last week of September (23-30)
        r['added_date'] = f"2025-09-{random.randint(23, 30):02d}"
    else:
        r['added_date'] = september_dates[i]

# Update Kognity URL
for r in resources:
    if 'cognity' in r['id'].lower():
        r['name'] = 'Kognity'
        r['url'] = 'https://app.kognity.com'

# Generate the new SQL
sql_header = """-- Supabase SQL Migration: 01_resources.sql
-- Create resources table for IB Vault
CREATE TABLE IF NOT EXISTS public.resources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  cost TEXT NOT NULL CHECK (cost IN ('Free', 'Freemium')),
  rank INTEGER NOT NULL DEFAULT 3 CHECK (rank BETWEEN 1 AND 5),
  is_new BOOLEAN NOT NULL DEFAULT false,
  added_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'broken')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read for approved resources
CREATE POLICY "Allow public read approved" ON public.resources
  FOR SELECT USING (status = 'approved');

-- Allow anonymous submission with pending status
CREATE POLICY "Allow public insert pending" ON public.resources
  FOR INSERT WITH CHECK (status = 'pending');

-- Allow admin full access
CREATE POLICY "Allow full admin access" ON public.resources
  FOR ALL USING (auth.role() = 'authenticated');

-- Seed data insertion
INSERT INTO public.resources (id, name, url, description, category, cost, rank, is_new, added_date, status) VALUES
"""

sql_values = []
for r in resources:
    # Escape single quotes
    name = r['name'].replace("'", "''")
    url = r['url'].replace("'", "''")
    desc = r['description'].replace("'", "''")
    cat = r['category'].replace("'", "''")
    is_new = 'TRUE' if r['is_new'] else 'FALSE'
    sql_values.append(f"  ('{r['id']}', '{name}', '{url}', '{desc}', '{cat}', '{r['cost']}', {r['rank']}, {is_new}, '{r['added_date']}', '{r['status']}')")

sql_footer = "ON CONFLICT (id) DO NOTHING;"

new_sql = sql_header + ",\n".join(sql_values) + "\n" + sql_footer

with open('supabase/migrations/01_resources.sql', 'w') as f:
    f.write(new_sql)

print(f"Generated migration with {len(resources)} resources")
print(f"Date range: {min(r['added_date'] for r in resources)} to {max(r['added_date'] for r in resources)}")
print(f"is_new resources: {sum(1 for r in resources if r['is_new'])}")