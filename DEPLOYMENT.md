# FitTrack – Step-by-Step Deployment Guide

This guide walks you through deploying the fitness tracker so it runs on the internet: database on **Supabase**, backend on **Render**, and frontend on **Vercel**.

---

## Prerequisites

- A GitHub (or GitLab) account and your FitTrack code pushed to a repository
- Accounts: [Supabase](https://supabase.com), [Render](https://render.com), [Vercel](https://vercel.com)

---

## Part 1: Database on Supabase

1. **Create a Supabase project**
   - Go to [supabase.com](https://supabase.com) and sign in
   - Click **New Project**
   - Choose your organization, set a **Project name** (e.g. `fittrack`), set a **Database password** (save it somewhere safe), and pick a region
   - Click **Create new project** and wait until the project is ready

2. **Get the connection string**
   - In the Supabase dashboard, open **Project Settings** (gear icon in the left sidebar)
   - Go to **Database**
   - Under **Connection string**, select **URI**
   - Copy the URI. It looks like:
     ```
     postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
     ```
   - Replace `[YOUR-PASSWORD]` with the database password you set
   - For Prisma we usually use the **direct** connection on port **5432** (not 6543). In the same Database settings, check if there is a “Direct connection” or “Session mode” URI and use that if you see it; otherwise the pooler URI often works too. If you see a URI with port `5432`, prefer that for migrations

3. **Run migrations from your machine (first time)**
   - On your computer, open the project and go to the `backend` folder
   - Create `backend/.env` with:
     ```
     DATABASE_URL="postgresql://postgres.[ref]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres"
     ```
     (paste your real URI and password)
   - Run:
     ```bash
     cd backend
     npm install
     npx prisma generate
     npx prisma db push
     node prisma/seed.js
     ```
   - The seed will print a **user id** (e.g. `clxxxxxx`). Copy it; you will use it as `VITE_USER_ID` and optionally `USER_ID` later

Your database is now live on Supabase and has the schema plus one demo user.

---

## Part 2: Backend on Render

1. **Create a Web Service**
   - Go to [render.com](https://render.com) and sign in
   - Click **New +** → **Web Service**
   - Connect your GitHub (or GitLab) account and select the repository that contains FitTrack
   - Use these settings:
     - **Name:** e.g. `fittrack-api`
     - **Region:** choose one close to you or your users
     - **Root Directory:** `backend`
     - **Runtime:** Node
     - **Build Command:** `npm install && npx prisma generate`
     - **Start Command:** `npx prisma db push && node src/index.js`
       - This applies the schema and then starts the server. For production you can later switch to `npx prisma migrate deploy && node src/index.js` if you use migrations

2. **Environment variables**
   - In the same form, open **Environment** or **Environment Variables**
   - Add:
     - **Key:** `DATABASE_URL`  
       **Value:** the same Supabase connection string you used in Part 1 (paste the full URI)
     - **Key:** `PORT`  
       **Value:** `10000` (Render sets this; you can leave it if Render already provides PORT)
     - **Key:** `FRONTEND_URL`  
       **Value:** leave empty for now; you will set it in Part 3 to your Vercel URL (e.g. `https://your-app.vercel.app`)
     - **Key:** `USER_ID` (optional)  
       **Value:** the user id from the seed (so the API uses this user when no header is sent)

3. **Deploy**
   - Click **Create Web Service**
   - Wait until the build and deploy finish. The log should show “Listening on port ...” without errors
   - Copy your service URL, e.g. `https://fittrack-api.onrender.com`

4. **Optional: set FRONTEND_URL**
   - After you deploy the frontend (Part 3), go back to Render → your service → **Environment**
   - Set `FRONTEND_URL` to your Vercel URL (e.g. `https://fittrack-pro.vercel.app`)
   - Redeploy if needed so CORS allows your frontend

Your API is now live on Render.

---

## Part 3: Frontend on Vercel

1. **Import the project**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click **Add New** → **Project**
   - Import the same GitHub repository
   - Set **Root Directory** to `frontend` (click **Edit** next to the root and type `frontend`)

2. **Build settings**
   - **Framework Preset:** Vite (or leave auto)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist` (default for Vite)

3. **Environment variables**
   - Open **Environment Variables**
   - Add:
     - **Key:** `VITE_API_URL`  
       **Value:** your Render backend URL, e.g. `https://fittrack-api.onrender.com`  
       (no trailing slash)
     - **Key:** `VITE_USER_ID` (optional)  
       **Value:** the same user id from the seed (so the frontend sends it in the header)

4. **Deploy**
   - Click **Deploy**
   - Wait for the build to finish. Vercel will give you a URL like `https://your-project.vercel.app`

5. **Connect frontend and backend**
   - In Render, set `FRONTEND_URL` to this Vercel URL (see Part 2, step 4)
   - In the frontend, ensure `VITE_API_URL` points to the Render URL so all API calls go to your backend

Your app is now live: Vercel (UI) → Render (API) → Supabase (database).

---

## Quick checklist

- [ ] Supabase project created and `DATABASE_URL` copied
- [ ] `backend/.env` has `DATABASE_URL`; `npx prisma db push` and `node prisma/seed.js` run; user id copied
- [ ] Render Web Service: root `backend`, build `npm install && npx prisma generate`, start `npx prisma db push && node src/index.js`
- [ ] Render env: `DATABASE_URL`, `FRONTEND_URL` (Vercel URL), optional `USER_ID`
- [ ] Vercel project: root `frontend`, env `VITE_API_URL` (Render URL), optional `VITE_USER_ID`
- [ ] After first deploy, set `FRONTEND_URL` on Render to your Vercel URL

---

## Troubleshooting

- **“User not identified”:** Set `VITE_USER_ID` in Vercel to the user id from the seed, and optionally `USER_ID` on Render.
- **CORS errors in browser:** Set `FRONTEND_URL` on Render to your exact Vercel URL (including `https://`).
- **Database connection failed on Render:** Double-check `DATABASE_URL` (no extra spaces, correct password). Supabase sometimes offers a “Transaction” vs “Session” mode; if one fails, try the other.
- **Frontend shows “Failed to fetch”:** Ensure `VITE_API_URL` is the Render URL and that the Render service is not sleeping (free tier may spin down after inactivity).
