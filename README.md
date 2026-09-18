# IB Vault — Curated Free IB Diploma Programme Study Resources

**IB Vault** is a personal, static-first web link-hub for International Baccalaureate (IB) Diploma candidates. It organizes high-yield, free revision assets covering:
- **Mathematics Analysis & Approaches (AA) HL**
- **Physics HL**
- **Chemistry HL**
- **Geography SL**
- **English Language & Literature SL**
- **German Language & Literature SL**
- Plus cross-subject tools: Past Paper archives, Question Banks, Exemplars (IA / EE / TOK), AI revision tools, Grade Calculators, Anki Flashcard decks, Textbooks, Research Databases, and University prep.

---

## 🎨 Visual Design Spec & Design Language

- **Aesthetic:** Clean, slightly retro "index-card board" (Trello/Pinterest-style) with pastel header pills.
- **Background:** Warm off-white / cream `#F4F2ED`.
- **Text:** Near-black `#1A1A1A` for headings, dark gray `#333333` for body text.
- **Links:** Plain black, underlined text (no buttons, no icons inside list bodies).
- **Column Header Pills:** Solid pastel color bars with rounded top corners only (flat where they meet the list body):
  - Coral/dusty red `#C97064` (Trending This Week / featured)
  - Magenta/pink `#B85C8A` (Favorites)
  - Terracotta `#D98B5F`
  - Peach `#E0A96D`
  - Mustard/olive `#C9B458`
  - Sage green `#8FAE72`
  - Teal `#5FA39A`
  - Light cyan `#7FC4C4`
  - Periwinkle/lavender `#8E8CC7`
  - Slate blue-gray `#6E7A99` (New Tools / meta)
- **Pinned Columns:**
  1. *Trending This Week* — Top 5 highest-utility resources across the catalog.
  2. *Favorites* — Stored in `localStorage` with "+ Add to favorites" selector.
  3. *New Tools* — Recently indexed tools with `NEW` badge and `Added <date>` sub-lines.
- **Excluded by Spec:** Dark mode / glassmorphism / neon glow / monospace tags / large thumbnail cards.

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- Node.js 18+ or 20+
- npm or pnpm
- Python 3.10+ (for parser and link checker scripts)

### 2. Install & Run
```bash
# Clone the repository
git clone https://github.com/your-username/ib-vault.git
cd ib-vault

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Build for Production
```bash
npm run build
npm run preview
```

---

## 🗄️ Supabase Schema & Migration

The project is designed to operate with Supabase Postgres for community submissions and administrative approval, with an automatic transparent local-storage fallback for offline/client preview.

Run `supabase/migrations/01_resources.sql` in your Supabase SQL editor:

```sql
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

-- Allow community submissions with status: "pending"
CREATE POLICY "Allow public insert pending" ON public.resources
  FOR INSERT WITH CHECK (status = 'pending');

-- Allow authenticated admin full access
CREATE POLICY "Allow full admin access" ON public.resources
  FOR ALL USING (auth.role() = 'authenticated');
```

---

## ☁️ Vercel Deployment

1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Set the build settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Configure Environment Variables (optional, for real Supabase and custom Admin pass):
   - `VITE_ADMIN_PASSWORD`: Your secret admin portal password (defaults to `ibvault2025` if omitted)
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon public API key
6. Click **Deploy**.

---

## 🔗 Monthly Link-Checker & Mirror Health

In compliance with Part 3.4 of the build spec:
- Dead links are **never deleted**; instead, they are flagged with `status: "broken"` and an alert badge is displayed to users.
- Run manually:
  ```bash
  python3 scripts/link_checker.py
  ```
- GitHub Action: `.github/workflows/link_checker.yml` runs automatically at `00:00` on the 1st day of every month, performs HTTP verification across mirrors, and pushes status updates to git.

---

## 📁 Repository Structure

```text
├── index.html                   # HTML entry point with Fraunces & Inter fonts
├── package.json
├── resources.json               # Seed dataset JSON (~168 verified resources)
├── scripts/
│   ├── parse_resources.py       # One-time table parser script
│   └── link_checker.py          # Automated HTTP mirror status checker
├── supabase/
│   └── migrations/
│       └── 01_resources.sql     # Supabase Postgres schema & initial seed
├── .github/
│   └── workflows/
│       └── link_checker.yml     # Monthly automated link-checker action
└── src/
    ├── App.tsx                  # Main app controller with routing & state
    ├── index.css                # Tailwind styling, cream theme, print CSS
    ├── types.ts                 # TypeScript types (Resource, Category, Route)
    ├── data/
    │   ├── resources.json       # Canonical resource list
    │   ├── resources.ts         # TypeScript resource dataset
    │   ├── categories.ts        # Category palette, metadata & icons
    │   └── activityLog.ts       # Reverse-chronological activity entries
    ├── lib/
    │   ├── supabase.ts          # Database adapter & submission manager
    │   └── pdfExport.ts         # Printable PDF generator & printer
    └── components/
        ├── TopBar.tsx           # Sticky header with search, logo, settings
        ├── Sidebar.tsx          # Nav drawer, category list & PDF export icon
        ├── BoardView.tsx        # Trello/masonry column grid
        ├── Column.tsx           # Index-card column with colored header pill
        ├── ResourceItem.tsx     # Underlined black link + hover tooltip
        ├── CategoryView.tsx     # Single category expanded page (/category/:slug)
        ├── AboutView.tsx        # /about page with 4 stats boxes & activity
        ├── SubmitModal.tsx      # /submit form for community links
        ├── AdminView.tsx        # Password-protected /admin manager
        ├── SearchModal.tsx      # Global ⌘K search dialog
        ├── SettingsModal.tsx    # Density, favorites export & admin trigger
        ├── ResourceDetailModal.tsx # Full resource info & rating modal
        ├── ReportModal.tsx      # Broken mirror reporting modal
        └── AddFavoriteModal.tsx # Quick shortlist selector
```

---

## 🛡️ Admin Portal

- Route: `/admin` (or click "Admin Portal" in the sidebar)
- Default Password: `ibvault2025` (or set `VITE_ADMIN_PASSWORD`)
- Capabilities:
  - Approve pending user submissions (immediately adds them to the board)
  - Reject spam or duplicate submissions
  - Toggle broken/healthy mirror status across all 168+ resources
  - One-click dataset reset
