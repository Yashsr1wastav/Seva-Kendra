# Vercel Deployment Guide: Fixing Network Errors

If you are seeing "Network Error" or "CORS Error" on your deployed site, follow these steps to ensure your Frontend and Backend are communicating correctly.

## 1. Get your actual URLs
First, go to your Vercel Dashboard and find the production URLs for both projects:
- **Backend URL**: e.g., `https://seva-kendra-backend-abc.vercel.app`
- **Frontend URL**: e.g., `https://seva-kendra-frontend-xyz.vercel.app`

## 2. Configure Backend Environment Variables
In your **Backend** project on Vercel:
1.  Go to **Settings** > **Environment Variables**.
2.  Add/Update the following:
    - `FRONTEND_URL`: Set this to your actual Frontend URL (e.g., `https://seva-kendra-frontend-xyz.vercel.app`).
    - `MONGO_URL`: Ensure your MongoDB connection string is correct.
    - `NODE_ENV`: Set to `production`.

## 3. Configure Frontend Environment Variables
In your **Frontend** project on Vercel:
1.  Go to **Settings** > **Environment Variables**.
2.  Add/Update the following:
    - `VITE_API_URL`: Set this to your Backend URL **followed by `/api/v1`**.
      - Example: `https://seva-kendra-backend-abc.vercel.app/api/v1`

## 4. Redeploy
After updating the environment variables:
1.  Go to the **Deployments** tab in each project.
2.  Click the three dots `...` on the latest deployment and select **Redeploy**.
3.  Wait for the builds to finish.

## Why this fixes the error:
- **`VITE_API_URL`**: Tells the browser exactly where your server is. Without this, it might be looking at a default URL that doesn't exist.
- **`FRONTEND_URL`**: Tells the server that requests coming from your frontend are safe and should not be blocked by "CORS" security.

> [!TIP]
> I have updated the code to automatically allow any origin ending in `.vercel.app`, so even if you don't set `FRONTEND_URL` perfectly, it should work as long as both are on Vercel!
