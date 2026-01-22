# Seva Kendra CRM - Deployment Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account
- Vercel account
- Git installed

## Local Development Setup

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd sevaKendra-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-secret-key
   ADMIN_EMAIL=admin@seva.com
   ADMIN_PASSWORD=admin123
   FRONTEND_URL=http://localhost:5173
   ```

4. Start backend:
   ```bash
   npm run dev
   ```
   Backend will run on http://localhost:5000

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

4. Start frontend:
   ```bash
   npm run dev
   ```
   Frontend will run on http://localhost:5173

## Vercel Deployment

### IMPORTANT: MongoDB Atlas Setup (Do This First!)

Before deploying to Vercel, you MUST configure MongoDB Atlas to allow Vercel connections:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Select your cluster
3. Click **"Network Access"** in the left sidebar
4. Click **"Add IP Address"**
5. Click **"Allow Access from Anywhere"**
6. Enter `0.0.0.0/0` in the IP field
7. Click **"Confirm"**

⚠️ **Without this step, Vercel deployment will fail with timeout errors!**

### Get Your MongoDB Connection String

1. In MongoDB Atlas, click **"Database"** in left sidebar
2. Click **"Connect"** button on your cluster
3. Select **"Connect your application"**
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/...`)
5. Replace `<password>` with your actual database password
6. Save this connection string - you'll need it for Vercel

### Deploy Backend to Vercel
1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure Project:
   - **Framework Preset:** Other
   - **Root Directory:** `sevaKendra-backend`
   - **Build Command:** Leave empty (Node.js automatically detected)
   - **Output Directory:** Leave empty
   - **Install Command:** `npm install`

6. Add Environment Variables in Vercel:
   ```
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/seva-kendra?retryWrites=true&w=majority
   JWT_SECRET=your-secure-random-secret-key-min-32-characters
   NODE_ENV=production
   ADMIN_EMAIL=admin@sevakendra.com
   ADMIN_PASSWORD=Admin@123
   ```
   
   **CRITICAL:** 
   - Replace the entire MONGODB_URI with YOUR actual MongoDB connection string
   - Make sure JWT_SECRET is at least 32 characters long
   - Use a strong password for ADMIN_PASSWORD

7. Click "Deploy"
8. Wait for deployment to complete
9. Click on the deployment URL to open your backend
10. You should see: `{"status":"success","message":"Server is running"}`
11. Copy your backend URL (e.g., `https://seva-kendra-backend-xyz.vercel.app`)

### Deploy Frontend to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import the same GitHub repository
4. Configure Project:
   - **Framework Preset:** Vite
   - **Root Directory:** `Frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.vercel.app/api/v1
   ```
   Replace with your actual backend URL from step 8 above

6. Click "Deploy"

## Post-Deployment

### Test Your Deployment
1. Visit your frontend URL
2. Try logging in with:
   - Email: admin@seva.com
   - Password: admin123 (or your custom password)

### Troubleshooting

#### "Route does not exist" Error
- Check that VITE_API_URL includes `/api/v1` at the end
- Verify backend is deployed and accessible
- Check Vercel function logs for errors

#### Login not working
- Verify MongoDB connection string is correct
- Check that JWT_SECRET is set in backend environment variables
- Ensure CORS is configured correctly in backend

#### 404 on page refresh
- Frontend: Already configured in `vercel.json` with rewrites
- Backend: Should work automatically with Vercel serverless functions

### Environment Variables Summary

#### Backend (.env)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
ADMIN_EMAIL=admin@seva.com
ADMIN_PASSWORD=secure-password
FRONTEND_URL=https://your-frontend.vercel.app
```

#### Frontend (.env)
```env
VITE_API_URL=https://your-backend.vercel.app/api/v1
```

## Important Notes
1. Never commit `.env` files to Git (they're in `.gitignore`)
2. Use `.env.example` files as templates
3. Change default admin credentials in production
4. Keep JWT_SECRET secure and never expose it
5. Use MongoDB Atlas for production database
6. Enable MongoDB IP whitelist: Allow all (0.0.0.0/0) for Vercel

## Support
For issues, check:
- Browser console for frontend errors
- Vercel function logs for backend errors
- MongoDB Atlas logs for database issues
