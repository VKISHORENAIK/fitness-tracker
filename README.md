# FitTrack – Fitness & Diet Tracker

A full-stack personal fitness tracker: log workouts, food, calories, and protein; set daily goals; view progress with charts.

## Tech Stack

- **Frontend:** React 18, Vite, TailwindCSS, React Router, Recharts
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Deploy:** Vercel (frontend), Render (backend), Supabase (DB)

---

## Project Structure

```
fitTrack_pro/
├── frontend/                 # React + Vite app
│   ├── public/
│   ├── src/
│   │   ├── api/              # API client and endpoints
│   │   ├── components/       # Layout, forms, shared UI
│   │   ├── pages/            # Dashboard, Workouts, Diet, Progress
│   │   └── main.jsx, App.jsx, index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── backend/                   # Express API
│   ├── prisma/
│   │   ├── schema.prisma     # DB schema
│   │   └── seed.js           # Seed user + default goals
│   ├── src/
│   │   ├── controllers/      # workouts, food, goals, progress, foodsLookup
│   │   ├── routes/           # Express routers
│   │   ├── middleware/       # getUserId (for single-user / future auth)
│   │   ├── lib/              # Prisma client
│   │   └── index.js          # Express app entry
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## Local Development

### 1. Database (Supabase or local PostgreSQL)

Create a PostgreSQL database and set `DATABASE_URL` in `backend/.env` (see backend `.env.example`).

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env: set DATABASE_URL and optionally PORT, USER_ID
npx prisma generate
npx prisma db push
node prisma/seed.js
# Note the printed user id; set VITE_USER_ID in frontend .env to that id
npm run dev
```

API runs at `http://localhost:5000`.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Optional: set VITE_API_URL and VITE_USER_ID (from seed output)
npm run dev
```

App runs at `http://localhost:3000`. Vite proxies `/api` to the backend.

### 4. User identification

The app uses a single “current user” for demo. After seeding, the backend prints the user id. Set that in `frontend/.env` as `VITE_USER_ID=clxxxxxx` so the frontend sends `X-User-Id` and all data is tied to that user.

---

## Features

- **Dashboard:** Today’s calories consumed, remaining calories, total/remaining protein, workout summary.
- **Workout tracker:** Add workout with name, date, notes; add exercises (name, sets, reps, weight).
- **Diet tracker:** Log food (name, quantity, unit, calories, protein, date). Food search auto-fills from a built-in list; changing quantity recalculates calories and protein when the food is in the list.
- **Daily goals:** Set daily calorie and protein goals; dashboard shows remaining.
- **Progress:** Weekly charts (Recharts) for calories, protein, and workout frequency.
- **Food lookup:** Search common foods and auto-fill calories/protein; per-100g and per-unit support.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/progress/daily?date=YYYY-MM-DD` | Daily summary (calories, protein, workouts, food) |
| GET | `/api/progress/weekly` | Last 7 days for charts |
| GET | `/api/workouts?from=&to=` | List workouts |
| POST | `/api/workouts` | Add workout (with exercises) |
| DELETE | `/api/workouts/:id` | Delete workout |
| GET | `/api/food?from=&to=` | List food logs |
| POST | `/api/food` | Add food log |
| DELETE | `/api/food/:id` | Delete food log |
| GET | `/api/goals` | Get current nutrition goals |
| POST | `/api/goals` | Create new goal (dailyCalories, dailyProtein) |
| GET | `/api/foods-lookup/search?q=` | Search foods for auto-fill |
| GET | `/api/foods-lookup/calculate?foodName=&quantity=&unit=` | Get calculated calories/protein for a quantity |

All relevant endpoints expect header `X-User-Id` (or backend `USER_ID` in .env) to scope data to a user.

---

## Deployment

### 1. Database – Supabase

1. Go to [supabase.com](https://supabase.com), create a project.
2. In **Settings → Database** copy the **Connection string** (URI). Use the “URI” format, e.g.  
   `postgresql://postgres:[YOUR-PASSWORD]@db.xxxx.supabase.co:5432/postgres`
3. Replace `[YOUR-PASSWORD]` with your database password.
4. This URI will be your `DATABASE_URL` for the backend (e.g. on Render).

### 2. Backend – Render

1. Go to [render.com](https://render.com), sign in, **New → Web Service**.
2. Connect your repo (e.g. GitHub) and select this project.
3. **Root Directory:** `backend`.
4. **Build command:** `npm install && npx prisma generate`
5. **Start command:** `npx prisma db push && node src/index.js`  
   (Or run migrations separately and use `node src/index.js`.)
6. **Environment:** Add:
   - `DATABASE_URL` = your Supabase connection string
   - `PORT` = 10000 (or leave default)
   - `USER_ID` = (optional) a user id if you want a fixed user; otherwise use header from frontend
   - `FRONTEND_URL` = your Vercel app URL (e.g. `https://your-app.vercel.app`) for CORS
7. Deploy. Note the service URL (e.g. `https://your-api.onrender.com`).

### 3. Frontend – Vercel

1. Go to [vercel.com](https://vercel.com), sign in, **Add New → Project**.
2. Import the same repo. Set **Root Directory** to `frontend`.
3. **Build command:** `npm run build`
4. **Environment variables:**
   - `VITE_API_URL` = your Render backend URL (e.g. `https://your-api.onrender.com`)
   - `VITE_USER_ID` = (optional) same user id you use for the backend, if you rely on a single user
5. Deploy. Your app will be at `https://your-project.vercel.app`.

### 4. Post-deploy

- Run migrations (if not using `db push` in start): from your machine or a one-off script, run `npx prisma migrate deploy` against the same `DATABASE_URL`.
- Seed a user: run `node prisma/seed.js` locally with `DATABASE_URL` pointing to Supabase, then set that user id in `VITE_USER_ID` and optionally `USER_ID` on Render.
- Ensure the backend allows the Vercel origin in CORS (using `FRONTEND_URL` in the backend as in the code).

---

## Environment variables summary

**Backend (`.env` / Render)**  
- `DATABASE_URL` – PostgreSQL connection string (Supabase)  
- `PORT` – Server port (default 5000)  
- `USER_ID` – Optional fixed user id  
- `FRONTEND_URL` – Frontend origin for CORS  

**Frontend (`.env` / Vercel)**  
- `VITE_API_URL` – Backend base URL (empty in dev if using proxy)  
- `VITE_USER_ID` – Optional; sent as `X-User-Id`  

---

## Learning notes (for students)

- **Prisma:** Schema in `prisma/schema.prisma` defines tables; `prisma generate` creates the client; `prisma db push` syncs the DB (no migration history). For production you can switch to `prisma migrate`.
- **Single-user vs auth:** This app uses `X-User-Id` (or `USER_ID`) for one user. For multiple users you’d add sign-up/login (e.g. JWT or sessions) and set `X-User-Id` from the token.
- **Auto nutrition:** When a food is in the lookup list, changing quantity triggers a request to `/api/foods-lookup/calculate` and the form updates calories and protein.
- **Charts:** Progress page uses Recharts (`BarChart`, `LineChart`) with data from `/api/progress/weekly`.
