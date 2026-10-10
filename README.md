# MERN Todo App

A todo app with a React (Vite) frontend and an Express + MongoDB (Mongoose) backend, set up to deploy both folders to Vercel as two projects from this one repository.

```
backend/    Express API   -> deploy with Root Directory "backend"
frontend/   React (Vite)  -> deploy with Root Directory "frontend"
```

## Run it locally

1. Create a free MongoDB database at [MongoDB Atlas](https://www.mongodb.com/atlas) (M0 free tier), add a database user, and allow network access from anywhere (`0.0.0.0/0`).
2. Copy `backend/.env.example` to `backend/.env` and paste your connection string into `MONGO_URI`.
3. Start the backend:

```bash
cd backend
npm install
npm run dev        # runs on http://localhost:5000
```

4. In a second terminal, start the frontend:

```bash
cd frontend
npm install
npm run dev        # opens on http://localhost:5173
```

## Deploy to Vercel

Both folders deploy as **two separate Vercel projects** pointing at this same repository — each project reads the `vercel.json` inside its own folder.

1. Push this repo to GitHub.
2. **Backend**: on [vercel.com](https://vercel.com) go to **Add New → Project** → import the repo → set **Root Directory** to `backend` → add the environment variable `MONGO_URI` (your Atlas connection string) → **Deploy**. Open the deployed URL — it should show `{"status":"Todo API is running"}`.
3. **Frontend**: **Add New → Project** → import the same repo again → set **Root Directory** to `frontend` → add the environment variable `VITE_API_URL` = your backend URL from step 2 (no trailing slash) → **Deploy**.

| Project | Root Directory | Environment variable |
|---|---|---|
| todo-api | `backend` | `MONGO_URI` |
| todo-web | `frontend` | `VITE_API_URL` |

## Notes

- `VITE_` variables are baked in at **build time** — after changing one, redeploy the frontend.
- `frontend/vercel.json` rewrites every route to `index.html` so React owns the URL.
- `backend/vercel.json` runs `server.js` as a Vercel serverless function; the MongoDB connection is created once per instance and reused.
- CORS is currently open to all origins. For production, restrict it: `app.use(cors({ origin: 'https://your-frontend.vercel.app' }))`.
