# ATHAR ISTIAQ SHADHIN — Personal Digital Universe

A complete, production-quality static portfolio site. No build step, no dependencies, no framework — just HTML, CSS, and vanilla JS.

## Structure

```
athar-portfolio/
├── index.html            ← the whole site
├── css/style.css         ← all styling
├── js/main.js            ← all interactions (canvas, nav, modals)
└── assets/
    ├── bg-space.jpg      ← pixel-art space background (generated)
    ├── portrait.jpg      ← real portrait (used as-is, not altered)
    └── certificates/     ← all real certificate images
```

## Run locally

```bash
cd athar-portfolio
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy to athar.io (pick ONE)

### Option E — Cloudflare Pages (CHOSEN ✅)

The project is prepped for Cloudflare Pages:
- `CNAME` file (contains `athar.io`) is already in the folder
- `_headers` file adds security + long-asset caching automatically

**Easiest — dashboard drag & drop (~2 min):**
1. Go to https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → **Upload assets**
2. Project name: `athar` (your preview URL becomes `athar.pages.dev`)
3. Drag the **contents** of this folder (or the `athar-portfolio-pages.zip` made for you)
4. **Deploy** → site is live on `athar.pages.dev`
5. **Custom domains** tab → **Set up custom domain** → `athar.io` → done.
   - If athar.io is registered on Cloudflare: it connects automatically.
   - If registered elsewhere: add the CNAME record Cloudflare shows you (or move the domain's nameservers to Cloudflare for free — then it's automatic forever).

**Or via terminal (Wrangler CLI):**
```bash
npm i -g wrangler
wrangler login
cd athar-portfolio
wrangler pages deploy . --project-name=athar
```

> The domain athar.io itself must be registered (Cloudflare Registrar, Namecheap, Porkbun — ~$35/yr). Once pointed at Cloudflare, the site is live at https://athar.io with global CDN, HTTPS included, free.

### Option A — Netlify (easiest, free)
1. Go to https://app.netlify.com/drop
2. Drag the whole `athar-portfolio` folder in.
3. Netlify gives you a URL instantly → then: **Domain settings → Add custom domain → athar.io**
4. Netlify shows the exact DNS records to add at your domain registrar (A record / CNAME).

### Option B — Cloudflare Pages (free, fast)
1. Zip the folder and upload at https://pages.cloudflare.com (or connect a git repo).
2. Build settings: **none** (static). Publish directory: root.
3. **Custom domains → athar.io** → follow the DNS prompt (Cloudflare does it automatically if the domain is on Cloudflare).

### Option C — Vercel (free)
1. https://vercel.com/new → import the folder (or a git repo).
2. Framework: **Other**. No build command. Output: root.
3. **Settings → Domains → athar.io** → add the given CNAME.

### Option D — GitHub Pages (free)
1. Push this folder to a GitHub repo (`<your-username>.github.io` or any repo).
2. Settings → Pages → deploy from branch.
3. Add athar.io as a custom domain in Pages settings + point DNS at GitHub.

> **Note on the domain itself:** athar.io must be registered/owned (a `.io` domain is bought from a registrar like Namecheap, Porkbun, or Cloudflare Registrar, ~$30–40/yr). I can't register or point a real domain from here — the steps above are the last mile, and any of them takes ~10 minutes.

## Content integrity notes

- All 9 uploaded certificate images are used as provided (optimized for web).
- All 7 Coursera verification URLs are the **original** ones from the certificates — unchanged, all open in a new tab.
- The "Extra-Curricular Activities" block lists competitions, bootcamps and forums, with each title linking to the related topic on the site. The 0.1% attendance gag is framed as self-aware humor. The "Wider Field" achievements are presented as real recognition.
- The English "7.5" is labeled **MOCK TEST — NOT AN OFFICIAL IELTS SCORE**.
- The portrait is used as-is — no identity/age/feature changes.

## Deploy via Git — Cloudflare Pages (auto-redeploys on every push)

This folder is a ready Git repository (see `git log`). To go live with Git:

1. On GitHub: **New repository** → name it `athar` → **Private or Public** → do NOT add a README.
2. On your machine (after unzipping this folder, which already contains `.git`):

   ```bash
   cd athar-portfolio
   git remote add origin https://github.com/<YOUR-USERNAME>/athar.git
   git push -u origin main
   ```

3. Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** → authorize GitHub → pick the `athar` repo.
4. Build settings: **Build command: (leave empty)** · **Build output directory: /** (root) · Framework preset: **None**.
5. **Save and Deploy** → your site is live at `https://athar.pages.dev` (free).

From now on, every `git push` to `main` automatically redeploys the site. The `_headers` file (caching rules) and `CNAME` (used only once you attach the custom domain) are picked up automatically from the repo root.
