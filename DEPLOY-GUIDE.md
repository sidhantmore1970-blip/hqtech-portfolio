# HQTech — Deployment Files

## What's in this ZIP

```
HQTech-Deploy/
├── server/                  ← Node.js Express API
│   ├── index.js
│   ├── db.js
│   └── package.json
├── web/                     ← React + Vite Frontend
│   ├── src/
│   ├── dist/                ← Pre-built production bundle
│   ├── package.json
│   └── vite.config.js
├── DEPLOY-GUIDE.md          ← THIS file — full instructions
└── .env.example             ← Environment variable templates
```

---

## Recommended Hosting Strategy

| Part | Where to host | Why |
|------|--------------|-----|
| **React Frontend** (`web/`) | **Vercel** | Automatic deploys, CDN, free |
| **Node.js API** (`server/`) | **Railway / Render / Fly.io** | Persistent filesystem for SQLite |

> ⚠️ **Why not both on Vercel?** Vercel Serverless Functions use an ephemeral (read-only) filesystem. SQLite needs to write to disk to persist data. The safest free option is to host the API on **Railway** or **Render** (both have free tiers) and the frontend on Vercel.

---

## STEP 1 — Deploy the Node.js API on Railway (Free)

### 1.1 Push to GitHub

```bash
cd HQTech
git init
git add .
git commit -m "initial: HQTech portfolio"
git remote add origin https://github.com/YOUR_USERNAME/hqtech-portfolio.git
git push -u origin main
```

### 1.2 Create a Railway project

1. Go to **[railway.app](https://railway.app)** and sign in with GitHub.
2. Click **"New Project"** → **"Deploy from GitHub repo"**.
3. Select your `hqtech-portfolio` repository.
4. When asked for the root directory, type: `server`
5. Railway auto-detects it's a Node.js project and runs `npm start`.

### 1.3 Set environment variables on Railway

In Railway → your service → **Variables** tab, add:

| Key | Value |
|-----|-------|
| `PORT` | `3001` |
| `HQADMIN_PASSWORD` | `your-strong-password` |
| `JWT_SECRET` | `a-long-random-secret-string` |
| `FRONTEND_URL` | *(leave blank for now — add after Step 2)* |

### 1.4 Get your API URL

After deploy, Railway gives you a URL like:
```
https://hqtech-api-production.up.railway.app
```
**Copy it** — you need it for Step 2.

---

## STEP 2 — Deploy the Frontend on Vercel

### 2.1 Create a `.env.production` file in `web/`

```bash
# web/.env.production
VITE_API_URL=https://hqtech-api-production.up.railway.app/api
```
Replace the URL with your actual Railway URL from Step 1.4.

### 2.2 Rebuild the frontend with the production API URL

```bash
cd web
npm install
npm run build
```

### 2.3 Push the updated build to GitHub

```bash
cd ..          # back to root HQTech/
git add .
git commit -m "chore: set production API URL"
git push
```

### 2.4 Connect to Vercel

1. Go to **[vercel.com](https://vercel.com)** → **"New Project"**.
2. Import your GitHub repository.
3. Under **"Configure Project"**:
   - **Root Directory**: `web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Add environment variable:
   - `VITE_API_URL` = `https://hqtech-api-production.up.railway.app/api`
5. Click **"Deploy"**.

Vercel will give you a URL like: `https://hqtech-portfolio.vercel.app`

### 2.5 Update CORS on the API

Go back to Railway → Variables → add:
```
FRONTEND_URL=https://hqtech-portfolio.vercel.app
```
Redeploy or Railway will auto-restart.

---

## STEP 3 — Configure the Admin Password

Change your admin password from the default `123`:
- In Railway Variables: `HQADMIN_PASSWORD=your-strong-password`
- In Vercel (no change needed — the frontend calls the API for auth)

Access the admin panel at: `https://hqtech-portfolio.vercel.app/hqadmin`

---

## STEP 4 — Optional: Connect a Custom Domain

### On Vercel (Frontend)
1. Dashboard → your project → **Domains** tab
2. Add your domain e.g. `hqtech.dev`
3. Follow DNS instructions (add CNAME/A records at your registrar)

### On Railway (API)
1. Go to your service → **Settings** → **Domains**
2. Add a custom API subdomain e.g. `api.hqtech.dev`

---

## STEP 5 — Local Development

### Backend
```bash
cd server
npm install
node index.js
# API runs at http://localhost:3001
```

### Frontend
```bash
cd web
npm install
npm run dev
# Site runs at http://localhost:5173
```

---

## Environment Variables Reference

### `server/` (Railway)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3001` | Server port |
| `HQADMIN_PASSWORD` | **Yes** | `123` | Admin panel password |
| `JWT_SECRET` | **Yes** | *(insecure default)* | JWT signing secret |
| `FRONTEND_URL` | **Yes** | — | Your Vercel URL for CORS |

### `web/` (Vercel)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | **Yes** | `http://localhost:3001/api` | Full URL to the API |

---

## Quick Checklist

- [ ] Pushed code to GitHub
- [ ] Deployed API on Railway with environment variables
- [ ] Got Railway API URL
- [ ] Set `VITE_API_URL` in `web/.env.production`
- [ ] Rebuilt frontend (`npm run build`)
- [ ] Deployed frontend on Vercel
- [ ] Got Vercel URL
- [ ] Added `FRONTEND_URL` to Railway variables
- [ ] Changed `HQADMIN_PASSWORD` from `123` to something strong
- [ ] Changed `JWT_SECRET` to a long random string
- [ ] Tested admin login at `/hqadmin`
- [ ] Tested contact form on the live site

---

## Troubleshooting

### "Failed to fetch" on the live site
- Check `VITE_API_URL` is set in Vercel environment variables
- Make sure `FRONTEND_URL` is set in Railway and matches the Vercel URL exactly

### Admin login says "Invalid password"
- Check `HQADMIN_PASSWORD` is correctly set in Railway Variables
- Try redeploying the Railway service after changing variables

### Railway shows build error with `better-sqlite3`
- Make sure `"engines": { "node": ">=18.0.0" }` is in `server/package.json`
- Railway should auto-build native modules

### Contact form submissions disappear after Railway restart
- On Railway's free Hobby tier, the disk is **ephemeral** — data resets on restart
- To persist SQLite: upgrade to Railway's **Starter plan** ($5/month) which includes a persistent volume
- Or migrate to **Turso** (free SQLite-compatible cloud DB) — see the PRD section 6.4

---

## Support

Admin Panel: `/hqadmin` | Password set via `HQADMIN_PASSWORD` env var  
Built with: React + Vite + Framer Motion (frontend) | Node.js + Express + SQLite (backend)
