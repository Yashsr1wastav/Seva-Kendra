# Seva Kendra Deployment & Fix Walkthrough

## What Was Fixed

I have comprehensively investigated and resolved the data loading and configuration issues preventing the Seva Kendra application from working correctly in production. Here is a summary of the fixes applied:

### 1. Data Structure Unwrapping (`Dashboard.jsx`)
- **Issue**: The `Dashboard` component was expecting urgent alerts data to be at `urgentAlertsResult.value.data.data`. However, the Axios interceptor (`Frontend/src/lib/api.js`) automatically unwraps the `response.data` object. This resulted in a "double unwrap" bug where it tried to access `.data` on an array.
- **Fix**: Updated `Dashboard.jsx` to correctly access `urgentAlertsResult.value.data` instead of `urgentAlertsResult.value.data.data`.

### 2. Date Filtering in Analytics (`analytics.service.js`)
- **Issue**: The "Last Year" filter in the dashboard did not work because the `last_year` case was missing from the date filter `switch` statement in the backend service, causing it to fall through to the default "all time" behavior.
- **Fix**: Added the `last_year` switch case in `analytics.service.js` to correctly filter the last 12 months.

### 3. Critical Production CORS Configuration (`.env`)
- **Issue**: The backend `.env` file had `WHITELIST=https://seva-kendra-backend.vercel.app` (its own backend URL). This would completely block the frontend from communicating with the backend in production because the frontend origin would be rejected by CORS policy.
- **Fix**: Changed the `.env` and `.env.example` `WHITELIST` variables to `http://localhost:5173,https://seva-kendra.vercel.app`. **Important:** You will need to replace `https://seva-kendra.vercel.app` with the actual Vercel URL of your frontend once it is deployed.

### 4. API Endpoint Mismatch (`api.js`)
- **Issue**: The frontend `userAPI` object in `Frontend/src/services/api.js` was sending requests to `/users`. However, the backend router was actually mounted at `/user` in `index.js`.
- **Fix**: Updated `userAPI` to correctly point to `/user`.

### 5. Verified Data Loading Structures
- Verified that modules like `StudyCenters.jsx` correctly use the unwrapped `{ data: [...], pagination: {...} }` format returned by the backend controllers and the Axios interceptor.
- The build process (`npm run build`) runs successfully with 0 errors.

---

## Production Deployment Guide

Before you launch the product for hosting, follow these exact steps to ensure a smooth deployment on Vercel:

### 1. Backend Deployment (Vercel)
1. Import the `sevaKendra-backend` folder into Vercel.
2. Under "Environment Variables", add the following required variables (do NOT use `.env` dummy values):
   - `NODE_ENV`: `production`
   - `MONGO_URL`: Your actual MongoDB Atlas connection string.
   - `JWT_SECRET`: Generate a secure, random string (e.g., using `openssl rand -hex 32`) and paste it here.
   - `WHITELIST`: Start with `*` or leave blank momentarily until the frontend is deployed. Then, **come back and change this** to your exact frontend Vercel URL (e.g., `https://my-frontend.vercel.app`).
3. Deploy the backend. Copy the generated Vercel URL (e.g., `https://my-backend.vercel.app`).

### 2. Frontend Deployment (Vercel)
1. Import the `Frontend` folder into Vercel.
2. Under "Environment Variables", add:
   - `VITE_API_URL`: Set this to your backend Vercel URL with `/api/v1` appended (e.g., `https://my-backend.vercel.app/api/v1`).
3. Deploy the frontend. Copy the generated frontend URL.

### 3. Final CORS Setup (Critical)
1. Go back to your **Backend Vercel Project Settings > Environment Variables**.
2. Update the `WHITELIST` variable to include your newly generated frontend URL (e.g., `https://my-frontend.vercel.app`). Do not include a trailing slash `/`.
3. **Redeploy the backend** so the new environment variable takes effect.

> [!WARNING]
> Ensure you remove any dummy user/admin credentials in production and use the real registration/login flow or database seeding. The backend has a safeguard that blocks `dummyLogin` when `NODE_ENV=production`.
