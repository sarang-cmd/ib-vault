#!/usr/bin/env python3
"""
Regenerate migration SQL from resources.ts (source of truth - 168 resources).
"""
import re
import random
from datetime import date, timedelta

# Read resources.ts
with open('src/data/resources.ts', 'r') as f:
    content = f.read()

# Extract all resource objects
pattern = r'\{\s*"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"url":\s*"([^"]+)",\s*"description":\s*"([^"]+)",\s*"category":\s*"([^"]+)",\s*"cost":\s*"([^"]+)",\s*"rank":\s*(\d+),\s*"is_new":\s*(true|false),\s*"added_date":\s*"([^"]+)",\s*"status":\s*"([^"]+)"\s*\}'
matches = re.findall(pattern, content)

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
        'is_new': m[7] == 'true',
        'added_date': m[8],
        'status': m[9]
    })

print(f"Found {len(resources)} resources in resources.ts")

# Fix Kognity
for r in resources:
    if 'cognity' in r['id'].lower():
        r['name'] = 'Kognity'
        r['url'] = 'https://app.kognity.com'

# Generate random September 2026 dates
start_date = date(2026, 9, 1)
end_date = date(2026, 9, 30)

september_dates = []
for i in range(len(resources)):
    random_days = random.randint(0, 29)
    new_date = start_date + timedelta(days=random_days)
    september_dates.append(new_date.isoformat())

random.shuffle(september_dates)

for i, r in enumerate(resources):
    if r['is_new']:
        r['added_date'] = f"2026-09-{random.randint(23, 30):02d}"
    else:
        r['added_date'] = september_dates[i]

# Generate SQL
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