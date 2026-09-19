# IB Vault - Project Brain

> **Single source of truth** for the IB Vault project. Captures architecture, decisions, deployment, and operational knowledge from the entire development session.

---

## 🎯 Project Overview

| Property | Value |
|----------|-------|
| **Name** | IB Vault |
| **Purpose** | Curated free/freemium study resource directory for IB Diploma Programme students |
| **Stack** | React 19 + TypeScript + Vite + Tailwind CSS + Supabase (Postgres) + Vercel/Cloudflare Pages |
| **Repo** | `https://github.com/sarang-cmd/ib-vault` |
| **Production URL** | `https://ib-vault-six.vercel.app` (Vercel adds suffix when `ib-vault.vercel.app` taken) |
| **Cost** | $0/month (Free Forever Tiers) |

---

## 🏗 Architecture

### Data Layer (Hybrid: Supabase + localStorage Fallback)
```
src/lib/supabaseClient.ts     → Supabase client init (checks VITE_* env vars)
src/lib/supabase.ts           → ALL data operations (Supabase when configured, else localStorage)
src/data/resources.ts         → 168 initial resources (source of truth for migration)
supabase/migrations/01_resources.sql  → DB schema + seed + RLS policies
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Hybrid data layer** | Works in demo mode (localStorage) without Supabase; seamless upgrade to real DB |
| **RLS for auth** | No backend server needed; Supabase handles authz via policies |
| **Vite + Vercel** | Zero-config SPA hosting, auto-deploys on push, free tier generous |
| **bcryptjs in browser** | Admin password hash verification client-side (demo acceptable; production → Supabase Auth) |
| **Single-file build** | `vite-plugin-singlefile` inlines CSS/JS → single HTML for max performance |

### RLS Policies (Critical for Functionality)

```sql
-- Public read approved resources
CREATE POLICY "Allow public read approved" ON public.resources
  FOR SELECT USING (status = 'approved');

-- Public submit pending resources
CREATE POLICY "Allow public insert pending" ON public.resources
  FOR INSERT WITH CHECK (status = 'pending');

-- Public update status (approve/broken toggle) - ADDED LATER
CREATE POLICY "Allow public update status" ON public.resources
  FOR UPDATE USING (true) WITH CHECK (status IN ('approved', 'broken'));

-- Admin full access (when Supabase Auth enabled)
CREATE POLICY "Allow full admin access" ON public.resources
  FOR ALL USING (auth.role() = 'authenticated');
```

> **Key Fix**: `approveSubmission` originally did DELETE+INSERT which failed because INSERT policy only allowed `status='pending'`. Changed to `UPDATE status='approved'` + added UPDATE policy.

---

## 📊 Data Schema

### `public.resources` Table
```sql
id              TEXT PRIMARY KEY
name            TEXT NOT NULL
url             TEXT NOT NULL
description     TEXT NOT NULL
category        TEXT NOT NULL
cost            TEXT CHECK (cost IN ('Free', 'Freemium'))
rank            INTEGER CHECK (rank BETWEEN 1 AND 5)
is_new          BOOLEAN DEFAULT false
added_date      DATE NOT NULL
status          TEXT CHECK (status IN ('approved', 'pending', 'broken')) DEFAULT 'approved'
created_at      TIMESTAMPTZ DEFAULT now()
```

### Resource Categories (33 total)
- Master Hubs & Repositories
- Past Papers & Question Banks
- Mathematics AA HL
- Physics HL
- Chemistry HL
- Geography SL
- English Lang&Lit SL
- German Lang&Lit SL
- IA / EE / TOK Exemplars & Guides
- AI Study Tools
- Grade & Score Calculators
- Flashcards & Active Recall
- YouTube Channels
- Communities
- Document & Paywall Access
- Textbooks & eBooks
- Databases & Research
- University Application & Prep
- + 15 more subcategories

### Initial Data
- **168 resources** seeded via migration
- **Randomized September 2025 dates** (2025-09-01 to 2025-09-30)
- **7 marked `is_new: true`** (last week of September)
- **2 demo pending submissions** for admin testing
- **Kognity** (formerly Cognity) → `https://app.kognity.com`

---

## 🔐 Admin Authentication

### Current Implementation (Demo Mode)
- **Location**: `src/components/AdminView.tsx`
- **Mechanism**: bcryptjs hash comparison in browser
- **Env Var**: `VITE_ADMIN_PASSWORD_HASH` (bcrypt hash, cost 12)
- **Fallback**: `ibvault2025` / `admin` when env var not set
- **Session**: `sessionStorage.setItem('ibvault_admin_auth', 'true')`

### Generate Hash
```bash
node -e "console.log(require('bcryptjs').hashSync('your-password', 12))"
# Output: $2a$12$...
```

### Production Upgrade Path
Replace with Supabase Auth:
1. Enable Email provider in Supabase
2. Create admin user in Dashboard
3. Update `AdminView.tsx` to use `supabase.auth.signInWithPassword()`

---

## 🚀 Deployment

### Vercel (Primary)
| Setting | Value |
|---------|-------|
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| SPA Rewrite | `vercel.json` → `rewrites: [{source: "/(.*)", destination: "/index.html"}]` |

### Required Environment Variables (Type: **Config**, NOT Secret)

| Variable | Source | Purpose |
|----------|--------|---------|
| `VITE_SUPABASE_URL` | Supabase Settings → API → Project URL | Supabase connection |
| `VITE_SUPABASE_ANON_KEY` | Supabase Settings → API → anon public | Client auth (RLS protects data) |
| `VITE_ADMIN_PASSWORD_HASH` | Generated via bcrypt | Admin panel access |

> **Critical**: Must be **Config** type in Vercel. "Secret" = write-only, never sent to browser.

### Vercel Authentication Protection (Blocks Public Access)
**Disable**: Settings → General → Vercel Authentication → **OFF** → Redeploy

### Custom Domain Options
- **Free subdomain**: Cloudflare Pages → `ib-vault.pages.dev`
- **Custom domain**: Vercel/Cloudflare → Add in Domains tab → DNS config
- **GitHub Pages**: `yourusername.github.io` (requires separate repo)

### Cloudflare Pages (Alternative Free Hosting)
- Clean URL: `ib-vault.pages.dev` (no random suffix)
- Same build settings
- Free custom domain at wholesale pricing later

---

## 🛠 Local Development

```bash
# 1. Clone
git clone https://github.com/sarang-cmd/ib-vault
cd ib-vault

# 2. Install
npm install

# 3. Env file
copy .env.example .env.local
# Edit with real values

# 4. Run
npm run dev        # http://localhost:5173
npm run build      # Production build
npm run preview    # Preview build locally
npm run typecheck  # TypeScript check
```

---

## 📁 Project Structure

```
IB-Vault_Public/
├── public/
│   ├── favicon.svg              # Vault+book icon (brand colors)
│   └── (other favicon formats)
├── src/
│   ├── components/              # All React components
│   │   ├── AdminView.tsx        # Admin panel (auth, approve, reject, toggle)
│   │   ├── AboutView.tsx        # Stats, activity log, contribute
│   │   ├── BoardView.tsx        # Main category board
│   │   ├── CategoryView.tsx     # Single category detail
│   │   ├── SubmitModal.tsx      # Resource submission
│   │   └── ... (15+ components)
│   ├── data/
│   │   ├── resources.ts         # 168 resources (SOURCE OF TRUTH)
│   │   ├── resources.json       # Mirror for migration generation
│   │   ├── categories.ts        # 33 category definitions
│   │   └── activityLog.ts       # September 2025 activity entries
│   ├── lib/
│   │   ├── supabase.ts          # Hybrid data layer (Supabase + localStorage)
│   │   ├── supabaseClient.ts    # Supabase client init
│   │   └── pdfExport.ts         # PDF generation
│   ├── types.ts                 # TypeScript interfaces
│   ├── App.tsx                  # Main app, routing, state
│   └── main.tsx                 # Entry point
├── supabase/
│   └── migrations/
│       └── 01_resources.sql     # Schema + 168 seeds + RLS
├── scripts/
│   ├── update_migration_dates.py   # Legacy (randomized dates)
│   └── regenerate_migration.py     # Current: regenerates from resources.ts
├── .env.example               # Env template
├── vercel.json                # SPA routing + headers
├── package.json
├── DEPLOYMENT_GUIDE.md        # Click-by-click deployment
└── PROJECT_BRAIN.md           # This file
```

---

## 🔧 Key Files to Modify

| Task | File(s) |
|------|---------|
| Add/edit resources | `src/data/resources.ts` → run `python scripts/regenerate_migration.py` → run migration in Supabase |
| Add categories | `src/data/categories.ts` + `resources.ts` |
| Update admin auth | `src/components/AdminView.tsx` |
| Change styling | `src/index.css` (Tailwind) + component classes |
| Update About page | `src/components/AboutView.tsx` + `src/data/activityLog.ts` |
| Favicon | `public/favicon.svg` + regenerate at realfavicongenerator.net |

---

## 🐛 Common Issues & Fixes

| Symptom | Cause | Fix |
|---------|-------|-----|
| Shows localStorage data, not Supabase | Vercel env vars = "Secret" | Change to **"Config"** → Redeploy |
| 404 on refresh | SPA routing missing | Verify `vercel.json` has rewrite rule |
| Admin login fails | Wrong hash / env var missing | Regenerate hash → Update Vercel → Redeploy |
| Approve/Reject does nothing | RLS blocks UPDATE | Run updated migration (has UPDATE policy) |
| "Supabase configured: false" in console | Env vars not injected | Vercel: Config type + Redeploy |
| Random URL suffix (`-six`) | `ib-vault.vercel.app` taken | Rename project or add custom domain |
| Can't access in incognito | Vercel Auth Protection ON | Settings → General → Vercel Authentication → OFF |

---

## 📋 Operational Checklist

### After Every Deploy
- [ ] Homepage loads (168 resources)
- [ ] DevTools Console: No red errors
- [ ] Submit resource → Appears in Supabase as `pending`
- [ ] Admin login works
- [ ] Approve pending → Moves to approved
- [ ] Toggle broken/healthy works
- [ ] Favicon shows

### Monthly
- [ ] Check Supabase usage (Dashboard → Reports)
- [ ] Verify Vercel bandwidth (Dashboard → Analytics)
- [ ] Run migration if resources.ts updated

---

## 📈 Scaling Beyond Free Tier

| Need | Upgrade Path | Cost |
|------|--------------|------|
| More DB storage | Supabase Pro | $25/mo (8GB) |
| More bandwidth | Vercel Pro | $20/mo (1TB) |
| Real auth | Supabase Auth | Included |
| Background jobs | Supabase Edge Functions | Included |
| Custom domain | Cloudflare Registrar | ~$8-10/yr (.com) |

---

## 🔗 Important Links

| Service | URL |
|---------|-----|
| **GitHub Repo** | https://github.com/sarang-cmd/ib-vault |
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **Supabase Dashboard** | https://supabase.com/dashboard/project/ib-vault |
| **Vercel Deployment** | https://ib-vault-six.vercel.app |
| **Admin Panel** | https://ib-vault-six.vercel.app/admin |
| **Supabase Table Editor** | https://supabase.com/dashboard/project/ib-vault/editor/resources |
| **Deployment Guide** | `DEPLOYMENT_GUIDE.md` |

---

## 🧠 Session History (Key Decisions)

### 2025-09-19: Production Readiness
1. **Hybrid data layer** implemented (Supabase + localStorage fallback)
2. **Vercel deployment** configured with SPA routing
3. **Environment variables** identified as "Config" not "Secret"
4. **Migration generated** from `resources.ts` (168 resources)
5. **Admin auth** with bcrypt hash verification
6. **RLS policies** for public read/insert/update
7. **Approve/reject fix**: Changed to UPDATE + added UPDATE policy
8. **Kognity rename** (Cognity → Kognity, URL fixed)
9. **September 2025 dates** randomized across resources
10. **Favicon** created matching brand palette
11. **Activity log** updated to September 2025
12. **Pushed to GitHub** → Vercel auto-deploy

### Files Changed This Session
- `src/lib/supabase.ts` - Hybrid data layer, approve uses UPDATE
- `src/lib/supabaseClient.ts` - Supabase client init
- `src/components/AdminView.tsx` - bcrypt auth, removed default password hint
- `src/components/AboutView.tsx` - lastUpdate = 2025-09-15
- `src/data/resources.ts` - Source of truth (168 resources)
- `src/data/resources.json` - Mirror
- `src/data/activityLog.ts` - September activity entries
- `supabase/migrations/01_resources.sql` - Schema + seeds + RLS
- `public/favicon.svg` - Brand icon
- `vercel.json` - SPA routing + security headers
- `DEPLOYMENT_GUIDE.md` - Complete deployment instructions
- `PROJECT_BRAIN.md` - This file

---

## 🎯 Next Steps (If Needed)

1. **Custom domain** via Cloudflare Pages or Vercel
2. **Supabase Auth** for production admin (replace bcrypt)
3. **Analytics** (Vercel Analytics / PostHog)
4. **Automated link checking** (cron job via Supabase Edge Functions)
5. **Search indexing** (Algolia / Meilisearch if needed)
6. **PWA manifest** for installability

---

## 📞 Emergency Contacts

| Issue | Contact |
|-------|---------|
| Vercel down | https://vercel-status.com |
| Supabase down | https://status.supabase.com |
| GitHub issues | https://github.com/sarang-cmd/ib-vault/issues |
| Supabase Discord | https://discord.supabase.com |

---

*Last updated: 2025-09-19 — This document captures all critical knowledge from the development session. Update when architecture, deployment, or data changes.*