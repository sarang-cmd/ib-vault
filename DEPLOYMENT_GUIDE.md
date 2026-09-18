# IB Vault - Complete Deployment Guide (Click-by-Click)

> **Stack**: React 19 + TypeScript + Vite + Tailwind CSS + Supabase (Postgres) + Vercel (Hosting)
> **Cost**: $0/month (Free Forever Tiers)
> **Time**: ~15 minutes

---

## 🎯 Why Vercel + Supabase?

| Platform | Free Tier Limits | Best For |
|----------|------------------|----------|
| **Vercel** | 100GB bandwidth, unlimited personal projects, custom domains, SSL, serverless functions | Static hosting + SPA routing |
| **Supabase** | 500MB Postgres, 1GB file storage, 2M auth users, 500MB realtime, Edge Functions | Database + Auth + Realtime |
| **Firebase** | 1GB storage, 10GB bandwidth, Spark plan limits | Alternative (more restrictive) |

**Vercel + Supabase wins** for generous free tiers and seamless DX.

---

## 📋 Prerequisites (Do These First)

- [ ] GitHub account created
- [ ] Node.js 18+ installed (`node --version` should show v18+)
- [ ] Git CLI installed (`git --version` works)
- [ ] Project folder open in terminal: `cd C:\Users\Smriti\Documents\Sarang\IB-Vault_Public`

---

## 🚀 STEP 1: Create Supabase Project (3 minutes)

### 1.1 Sign Up & Create Project

1. Open **https://supabase.com** in browser
2. Click **"Start your project"** → **"Sign in with GitHub"** → Authorize
3. Click **"New project"** button (green, top right)
4. Fill in:
   - **Organization**: Select your GitHub username
   - **Name**: `ib-vault`
   - **Database Password**: Click "Generate" → **COPY AND SAVE THIS** (you need it later)
   - **Region**: Pick closest to you (e.g., `US East (N. Virginia)` or `Europe West`)
   - **Pricing Plan**: Leave as **Free**
5. Click **"Create new project"**
6. Wait 2 minutes for "Your project is ready" green banner

### 1.2 Get API Credentials (Copy These Exactly)

1. In left sidebar, click **Settings** ⚙️ (gear icon, near bottom)
2. Click **API** in the Settings submenu
3. Copy these two values to a temp text file:

   **Project URL** → looks like `https://abcdefghijklmnop.supabase.co`
   ```
   VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
   ```

   **anon public** (under "Project API keys") → long string starting with `eyJ...`
   ```
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 1.3 Run Database Migration (Updated with September 2025 Dates)

1. Left sidebar → **SQL Editor** (icon: database with play button)
2. Click **"New query"** button (top right)
3. In your code editor, open `supabase/migrations/01_resources.sql`
   - This file now has **randomized September 2025 dates** and **Kognity** updated
4. **Select all** (Ctrl+A) → **Copy** (Ctrl+C)
5. Paste into Supabase SQL Editor (Ctrl+V)
6. Click **"Run"** (bottom right of editor)
7. Wait for "Success. No rows returned" (this is normal - `ON CONFLICT DO NOTHING`)
8. Verify: Left sidebar → **Table Editor** → click **`resources`** table → Should show **168 rows** with `added_date` in September 2025

### 1.4 (Optional) Enable Email Auth for Admin Panel

*Only do this if you want real Supabase Auth later*

1. Left sidebar → **Authentication** (user icon) → **Providers**
2. Find **Email** → Toggle **ON**
3. Click **Settings** (top tab in Auth) → Scroll to **"Enable email confirmations"** → Toggle **OFF**
4. Click **Save**

---

## 🚀 STEP 2: Push to GitHub (2 minutes)

Run these commands **in your project terminal**:

```bash
cd C:\Users\Smriti\Documents\Sarang\IB-Vault_Public

git init
git add .
git commit -m "feat: production ready - IB Vault with Supabase backend"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/ib-vault.git
git push -u origin main
```

**Replace `YOUR_GITHUB_USERNAME`** with your actual GitHub username.

Verify: Go to `https://github.com/YOUR_GITHUB_USERNAME/ib-vault` → Should see your files.

---

## 🚀 STEP 3: Deploy to Vercel (5 minutes)

### 3.1 Import Project

1. Open **https://vercel.com** → **"Continue with GitHub"** → Authorize
2. Click **"Add New..."** dropdown (top right) → **"Project"**
3. Find `ib-vault` in list → Click **"Import"**
4. **Configure Project** screen:
   - **Framework Preset**: Should auto-detect **Vite** (if not, select Vite)
   - **Build Command**: `npm run build` (leave as-is)
   - **Output Directory**: `dist` (leave as-is)
   - **Install Command**: `npm install` (leave as-is)
   - **Root Directory**: `./` (leave as-is)
5. Click **"Deploy"** → Wait ~2 minutes

### 3.2 Add Environment Variables (CRITICAL - Do This Before First Deploy Completes)

**While it's deploying or right after:**

1. In Vercel project dashboard → Click **Settings** tab (top)
2. Left sidebar → **Environment Variables**
3. Click **"Add New"** → Add **all three** exactly:

   **Variable 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://YOUR-PROJECT-REF.supabase.co` (from Step 1.2)
   - **Type**: **Config** (NOT "Secret" - this is critical!)
   - Environment: ✅ Production ✅ Preview ✅ Development
   - Click **Save**

   **Variable 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (full anon key from Step 1.2)
   - **Type**: **Config** (NOT "Secret" - this is critical!)
   - Environment: ✅ Production ✅ Preview ✅ Development
   - Click **Save**

   **Variable 3 - Generate First:**
   - Open terminal, run:
     ```bash
     node -e "console.log(require('bcryptjs').hashSync('your-secure-admin-password', 12))"
     ```
     *Replace `your-secure-admin-password` with a strong password you'll remember*
   - Copy the output (starts with `$2a$12$...`)
   - Name: `VITE_ADMIN_PASSWORD_HASH`
   - Value: paste the hash
   - **Type**: **Config** (NOT "Secret" - this is critical!)
   - Environment: ✅ Production ✅ Preview ✅ Development
   - Click **Save**

> ⚠️ **WHY "Config" NOT "Secret"?** Vite only exposes `VITE_*` variables to the browser at build time. "Secret" variables are write-only and never sent to the client. The Supabase anon key is **designed for client-side use** (RLS protects data). The admin hash is checked in-browser for demo mode.

4. **Redeploy to pick up env vars:**
   - Go to **Deployments** tab (top)
   - Click **⋯** (three dots) on latest deployment → **"Redeploy"**
   - Click **"Redeploy"** in confirmation dialog
   - Wait ~2 minutes

### 3.3 Verify Deployment

1. Click **Visit** button (or go to `https://ib-vault.vercel.app` / your assigned URL)
2. Should see IB Vault homepage with 33 categories

---

## 🔐 STEP 4: Test Admin Panel (1 minute)

1. Go to `https://your-app.vercel.app/admin`
2. Enter the **plain password** you used in Step 3.2 (not the hash)
3. Click **Authenticate**
4. Should see:
   - **Pending Submissions** tab with 2 demo entries
   - **All Resources & Link Health** tab with 168 resources
   - Approve/Reject buttons work
   - Toggle Broken/Healthy works
   - Reset Dataset button works

---

## ✅ STEP 5: Full Verification Checklist

Open `https://your-app.vercel.app` and verify each:

| Feature | How to Test | Expected |
|---------|-------------|----------|
| Homepage loads | Visit root URL | 33 category columns visible |
| Search | Press `/` or `Cmd+K` | Modal opens, filters results |
| Submit Resource | Click "+" or "Submit" | Modal opens, submit works |
| Admin Login | Go to `/admin`, enter password | Authenticated badge shows |
| Approve Submission | Admin → Pending → Approve | Moves to All Resources |
| Reject Submission | Admin → Pending → Reject | Removed from pending |
| Flag Broken | Admin → All Resources → Flag Broken | Status changes to red |
| Reset Dataset | Admin → Reset Dataset → Confirm | Back to 168 initial |
| PDF Export | Click printer icon (bottom right) | PDF downloads |
| Favorites | Click star on any resource | Persists after refresh |
| Mobile | Resize browser to phone width | Layout stacks properly |

### Verify Supabase Connection (Real Database Working)

1. Open browser DevTools (F12) → **Console** tab
2. Look for: **No red Supabase errors** (the app auto-detects Supabase when env vars present)
3. Submit a test resource via Submit modal
4. Go to Supabase Dashboard → **Table Editor** → `resources` → Should see new row with `status: pending`
5. Go to `/admin` → Login → Should see your test submission in **Pending** tab
6. Approve it → Refresh homepage → Resource appears globally

---

## 🌐 STEP 6: Favicon Setup (Brand Your Site)

### 6.1 Generate Favicon

Use this prompt in any AI image generator (Midjourney, DALL-E, Ideogram, etc.):

> **Clean, minimal favicon for "IB Vault" - an academic resource directory for International Baccalaureate students. Design: A simple vault/safe icon merged with an open book, using the site's exact color palette. Colors: warm cream background (#F4F2ED), terracotta primary (#8B3A2F) for the vault body, sage accent (#8FAE72) for the book pages, dark charcoal (#1A1A1A) for outlines. Style: Modern flat design with subtle depth (single drop shadow), geometric precision, works at 16x16 through 512x512. No gradients, no 3D effects, no text. Square format with rounded corners (8px radius). Vector/SVG output preferred. Minimalist, scholarly, trustworthy.**

### 6.2 Add Favicon to Project

1. **Save generated favicon** as `favicon.svg` in `public/` folder:
   ```
   IB-Vault_Public/
   └── public/
       └── favicon.svg    ← Add here
   ```

2. **Or use multiple formats** (recommended):
   ```
   public/
   ├── favicon.svg          # Modern browsers (preferred)
   ├── favicon.ico          # Legacy browsers (16x16, 32x32)
   ├── apple-touch-icon.png # iOS home screen (180x180)
   └── android-chrome-192x192.png  # Android
   ```

3. **Generate all sizes** from your SVG using:
   - https://realfavicongenerator.net/ (upload SVG → generates all formats + HTML)
   - Or https://favicon.io/favicon-converter/

4. **Add to `index.html`** (Vite auto-injects from `public/`, but verify):
   ```html
   <!-- In index.html head - Vite copies public/ files automatically -->
   <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
   <link rel="alternate icon" href="/favicon.ico" sizes="16x16 32x32" />
   <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
   <link rel="manifest" href="/site.webmanifest" />
   ```

5. **Verify**: Deploy → Visit site → Check browser tab for favicon

---

## 🛠 Local Development with Real Backend

```bash
# 1. Copy env template
copy .env.example .env.local

# 2. Edit .env.local with your actual values (use Notepad or VS Code)
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key
# VITE_ADMIN_PASSWORD_HASH=your-bcrypt-hash

# 3. Install deps (already done if you followed guide)
npm install

# 4. Run dev server
npm run dev
```

Open `http://localhost:5173` → Now uses **real Supabase** backend.

---

## 🔄 Automatic Deployments (Already Working)

Every `git push origin main` triggers:
1. Vercel detects push → Builds → Deploys to production
2. Pull Requests → Preview deployments (unique URLs)

---

## 💰 Cost: $0/Month Forever

| Service | Free Tier | Your Usage |
|---------|-----------|------------|
| Vercel Hosting | 100 GB/mo bandwidth | ~10 MB build |
| Supabase Postgres | 500 MB | ~5 MB (168 rows) |
| Supabase Auth | 50,000 MAU | Admin only |
| **Total** | | **$0/month** |

---

## 🐛 Troubleshooting (Common Issues)

### "Build Failed" on Vercel
```bash
# Run locally first to see exact error
npm run build
npm run typecheck
```
Fix TypeScript errors, remove unused imports, push again.

### "Supabase Not Working / Shows localStorage Data" → **MOST LIKELY CAUSE**

**The env vars are set to "Secret" instead of "Config" in Vercel.**

**Fix:**
1. Vercel → Settings → Environment Variables
2. Click **each variable** (3 total) → **Edit**
3. Change **Type: "Secret" → "Config"**
4. Ensure all 3 environments checked: ✅ Production ✅ Preview ✅ Development
5. Click **Save** for each
6. **Redeploy**: Deployments → ⋯ → Redeploy

> The app code at `src/lib/supabaseClient.ts` checks `import.meta.env.VITE_SUPABASE_URL` - if Vercel doesn't inject it (because it's "Secret"), the app falls back to localStorage demo mode.

### Admin Login Rejected
1. Verify `VITE_ADMIN_PASSWORD_HASH` in Vercel env vars (Type: Config)
2. Regenerate: `node -e "console.log(require('bcryptjs').hashSync('newpass', 12))"`
3. Update in Vercel → Redeploy

### 404 on Page Refresh (SPA Routing)
Ensure `vercel.json` exists in project root with:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Migration Shows "No Rows Returned"
This is **normal**. Check Table Editor → `resources` → Should show 168 rows. The `ON CONFLICT DO NOTHING` prevents duplicates.

---

## 🌍 How Global Submissions Work (Built In)

| User Action | What Happens |
|-------------|--------------|
| Anyone submits resource | `INSERT` with `status='pending'` → Allowed by RLS policy `Allow public insert pending` |
| You open `/admin` | Reads `SELECT * FROM resources WHERE status='pending'` → Sees ALL global submissions |
| You Approve | `UPDATE status='approved'` → Now visible to all users worldwide |
| You Flag Broken | `UPDATE status='broken'` → Shows warning globally |

**No code changes needed** - the RLS policies in the migration handle this.

---

## 📁 Project Structure

```
IB-Vault_Public/
├── public/
│   └── favicon.svg          # ← Add your favicon here
├── src/
│   ├── components/         # All React components
│   ├── data/               # Categories, resources, types
│   ├── lib/
│   │   ├── supabase.ts     # Hybrid data layer (Supabase + localStorage fallback)
│   │   ├── supabaseClient.ts # Supabase client init
│   │   └── pdfExport.ts    # PDF generation
│   ├── types.ts            # TypeScript interfaces
│   ├── App.tsx             # Main app with routing
│   └── main.tsx            # Entry point
├── supabase/
│   └── migrations/
│       └── 01_resources.sql # Schema + 168 seed rows (Sept 2025 dates)
├── .env.example            # Env template
├── vercel.json             # SPA routing + security headers
├── package.json
└── DEPLOYMENT_GUIDE.md
```

---

## 📞 Support Links

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **Project Issues**: https://github.com/YOUR_USERNAME/ib-vault/issues

---

## ✅ Final Checklist (Copy-Paste to Track)

```
[ ] Supabase project created at supabase.com
[ ] Database password saved
[ ] Migration run (168 rows in Table Editor → resources, Sept 2025 dates)
[ ] API credentials copied (Project URL + anon key)
[ ] GitHub repo created and pushed
[ ] Vercel project imported
[ ] VITE_SUPABASE_URL added in Vercel env vars (Type: Config)
[ ] VITE_SUPABASE_ANON_KEY added in Vercel env vars (Type: Config)
[ ] VITE_ADMIN_PASSWORD_HASH generated and added (Type: Config)
[ ] Vercel redeployed after env vars
[ ] Homepage loads at https://your-app.vercel.app
[ ] Favicon shows in browser tab
[ ] Admin panel works at /admin
[ ] All 11 verification tests pass
[ ] Test submission appears in Supabase Table Editor
[ ] Test submission appears in Admin → Pending
```

---

## 🎉 Done!

Your IB Vault is live with:
- ✅ Real Postgres backend (Supabase)
- ✅ Global CDN + SSL (Vercel)
- ✅ Real-time global submissions visible in admin
- ✅ September 2025 randomized dates
- ✅ Kognity updated
- ✅ Admin auth with bcrypt password hashing
- ✅ Favicon branded
- ✅ Free forever hosting

**Admin URL**: `https://your-app.vercel.app/admin`  
**Admin Password**: The plain password you hashed in Step 3.2