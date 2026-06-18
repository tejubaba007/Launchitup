# LaunchItUp — MVP

Find your first 100 users in 60 seconds. A working React app: landing page → 4-question quiz → personalised, ranked launch plan from 100 channels.

The scoring engine and all 100 channels are embedded — it runs with **no backend**. Everything you need to connect Supabase + Stripe later is marked in the code with `// 👉 PLUG-IN POINT`.

---

## Run it locally (5 minutes)

You need Node.js installed. Then:

```bash
# 1. Create a fresh Vite + React app
npm create vite@latest launchitup -- --template react
cd launchitup
npm install

# 2. Replace the default app with LaunchItUp
#    Copy LaunchItUp.jsx into src/ and rename it App.jsx
#    (overwrite the existing src/App.jsx)

# 3. Run
npm run dev
```

Open the localhost URL it prints. Done.

---

## Deploy it free (10 minutes)

**Option A — Vercel (recommended)**
1. Push your project to a GitHub repo.
2. Go to vercel.com → New Project → import the repo.
3. Vercel auto-detects Vite. Click Deploy.
4. You get a live URL. Add a custom domain in Settings if you want.

**Option B — GitHub Pages** (same as you used for CorePoker)
1. `npm install --save-dev gh-pages`
2. In `vite.config.js` add `base: '/launchitup/'`
3. In `package.json` scripts: `"deploy": "vite build && gh-pages -d dist"`
4. `npm run deploy`

---

## How the scoring works

Each channel scores: `(traffic × 0.5) + (ease × 0.3) + (relevance × 0.2)`

- **Relevance** changes by product type — an AI tool uses `rel_ai`, a SaaS uses `rel_saas`. That's why r/MachineLearning ranks high for AI but low for SaaS.
- **Budget** filters out paid channels when "Free only" is selected.
- **Stage** boosts pre-launch channels (BetaList, PH Upcoming) for waitlist-stage products, and directories for established ones.
- **Audience** nudges dev/SMB/enterprise/consumer channels up when matched.

All of it lives in the `buildPlan()` function at the top of the file. Tweak the weights there.

---

## Going live: the 2 integrations

### 1. Supabase (move channels to a database)
Right now channels are a hardcoded array. To make them editable without redeploying:
- Create the `channels` table (schema in your Build Framework doc, Section 3).
- Import `launchitup_database_v1.csv`.
- Replace the embedded `CHANNELS` array with a fetch:
  ```js
  const { data } = await supabase.from('channels').select('*');
  ```
- Find the `// 👉 PLUG-IN POINT` note near the data.

### 2. Stripe (charge €9 to unlock)
- Create a €9 payment link in Stripe (Build doc, Section 9).
- Find the unlock button's `// 👉 PLUG-IN POINT` in the results section.
- Replace `setUnlocked(true)` with `window.location.href = "your_stripe_link"`.
- On success, Stripe redirects back with `?paid=true` — read that param and call `setUnlocked(true)`.

---

## What's intentionally NOT built yet

Per your "validate before building" rule:
- **No auth** — add Supabase magic link only once people are paying.
- **No tracker** — that's Phase 2, after validation.
- **No analytics dashboard** — Phase 3.

Ship this. Get 10 people to pay €9. Then build the next phase.
