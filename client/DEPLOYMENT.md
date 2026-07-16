# 🚀 CareLine Client - Vercel Deployment Guide

This guide will help you deploy the CareLine customer portal to Vercel.

---

## 📋 Prerequisites

- Vercel account (sign up at https://vercel.com)
- GitHub repository access
- Backend API deployed and accessible (optional for initial deployment)

---

## 🔧 Pre-Deployment Checklist

### 1. **Build Test Locally**

Before deploying, make sure the app builds successfully:

```bash
cd client
npm install
npm run build
```

If the build succeeds, you'll see a `dist` folder created.

### 2. **Environment Variables**

You'll need to configure these environment variables in Vercel:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API endpoint | `https://api.careline.com/api` |
| `VITE_SOCKET_URL` | WebSocket server URL | `https://api.careline.com` |
| `VITE_RAZORPAY_KEY_ID` | Razorpay key for payments | `rzp_live_xxxxx` |

---

## 🚀 Deployment Methods

### **Method 1: Deploy via Vercel Dashboard (Recommended)**

1. **Login to Vercel**
   - Go to https://vercel.com
   - Click "Login" and sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository: `careline763/CareLine`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `client` ⚠️ **IMPORTANT: Set this to "client"**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   - Scroll down to "Environment Variables"
   - Add each variable from the table above:
     ```
     VITE_API_URL = https://your-backend-url.com/api
     VITE_SOCKET_URL = https://your-backend-url.com
     VITE_RAZORPAY_KEY_ID = your_razorpay_key_id
     ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build and deployment
   - You'll get a URL like: `https://careline-client.vercel.app`

---

### **Method 2: Deploy via Vercel CLI**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Navigate to Client Folder**
   ```bash
   cd client
   ```

4. **Deploy**
   ```bash
   vercel
   ```

5. **Follow Prompts**
   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N`
   - Project name: `careline-client`
   - Directory: `./` (current directory)
   - Override settings: `N`

6. **Add Environment Variables**
   ```bash
   vercel env add VITE_API_URL
   vercel env add VITE_SOCKET_URL
   vercel env add VITE_RAZORPAY_KEY_ID
   ```

7. **Deploy to Production**
   ```bash
   vercel --prod
   ```

---

## 🔒 Environment Variables Setup in Vercel

### Via Dashboard:

1. Go to your project in Vercel
2. Click "Settings" → "Environment Variables"
3. Add each variable:

**VITE_API_URL**
```
Production: https://your-production-api.com/api
Preview: https://your-staging-api.com/api
Development: http://localhost:4000/api
```

**VITE_SOCKET_URL**
```
Production: https://your-production-api.com
Preview: https://your-staging-api.com
Development: http://localhost:4000
```

**VITE_RAZORPAY_KEY_ID** (Optional)
```
Production: rzp_live_xxxxxxxxxxxxx
Preview: rzp_test_xxxxxxxxxxxxx
Development: rzp_test_xxxxxxxxxxxxx
```

---

## ✅ Post-Deployment Verification

After deployment, verify these features:

### 1. **Basic Functionality**
- [ ] Home page loads correctly
- [ ] Navigation works (Home, Services, Plans, Support)
- [ ] Images and assets load properly
- [ ] Luxury dark theme is applied

### 2. **API Connection**
- [ ] Login/Register works (if backend is deployed)
- [ ] Plans page loads data
- [ ] Services page displays correctly
- [ ] Booking flow is accessible

### 3. **Responsive Design**
- [ ] Mobile view (375px - 768px)
- [ ] Tablet view (768px - 1024px)
- [ ] Desktop view (1024px+)

### 4. **Performance**
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s

---

## 🔄 Automatic Deployments

Vercel automatically deploys on every push to GitHub:

- **Production**: Deploys from `main` branch
- **Preview**: Deploys from other branches (PR previews)

To disable auto-deploy:
1. Go to Project Settings → Git
2. Uncheck "Automatic Deployments"

---

## 🌐 Custom Domain Setup

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Click "Add"
   - Enter your domain: `app.careline.com`

2. **Configure DNS**

   Add these DNS records at your domain provider:

   **For Root Domain** (careline.com):
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

   **For Subdomain** (app.careline.com):
   ```
   Type: CNAME
   Name: app
   Value: cname.vercel-dns.com
   ```

3. **Wait for Verification**
   - DNS propagation takes 24-48 hours
   - Vercel auto-issues SSL certificate

---

## 🐛 Common Issues & Fixes

### **Issue 1: Build Fails**

**Error**: `Cannot find module 'vite'`

**Fix**:
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

### **Issue 2: Environment Variables Not Working**

**Error**: API calls fail with 404

**Fix**:
1. Check variable names start with `VITE_`
2. Redeploy after adding variables
3. Clear browser cache

---

### **Issue 3: 404 on Page Refresh**

**Error**: Refreshing `/services` shows 404

**Fix**: Already fixed with `vercel.json` rewrites config

---

### **Issue 4: Images Not Loading**

**Error**: 404 on asset files

**Fix**:
1. Check images are in `public` folder or imported
2. Use relative paths: `/images/hero.png`
3. Verify build includes all assets

---

## 📊 Monitoring & Analytics

### **Vercel Analytics** (Built-in)

1. Go to Project → Analytics
2. View:
   - Real User Monitoring (RUM)
   - Web Vitals scores
   - Traffic analytics

### **Enable Analytics**:
```bash
npm install @vercel/analytics
```

Add to `main.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

// Add to root component
<Analytics />
```

---

## 🔐 Security Best Practices

1. **Never commit `.env` file**
   - Already in `.gitignore`
   - Use `.env.example` as template

2. **Use Environment Variables**
   - All API keys via Vercel env vars
   - No hardcoded secrets

3. **Enable HTTPS Only**
   - Automatic with Vercel
   - Force HTTPS redirects

4. **Set Security Headers**
   - Already configured in `vercel.json`

---

## 📈 Performance Optimization

Already implemented:

✅ **Code Splitting**: Automatic with Vite
✅ **Tree Shaking**: Remove unused code
✅ **Asset Caching**: 1 year cache for static files
✅ **Compression**: Gzip/Brotli enabled
✅ **Image Optimization**: Use modern formats
✅ **Lazy Loading**: Route-based code splitting

---

## 🔄 Rollback Deployment

If something goes wrong:

1. Go to Deployments in Vercel
2. Find previous working deployment
3. Click "..." → "Promote to Production"

Or via CLI:
```bash
vercel rollback
```

---

## 📝 Deployment Checklist

Before deploying to production:

- [ ] Test build locally: `npm run build`
- [ ] Update environment variables
- [ ] Test API endpoints are accessible
- [ ] Verify Razorpay keys (use live keys for production)
- [ ] Check all routes work
- [ ] Test responsive design
- [ ] Verify luxury theme is applied
- [ ] Test payment flow (if backend is ready)
- [ ] Check browser console for errors
- [ ] Test on multiple devices

---

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Vite Docs**: https://vitejs.dev/guide/
- **GitHub Issues**: https://github.com/careline763/CareLine/issues

---

## 🎉 Success!

Once deployed, your CareLine customer portal will be live at:

**Production URL**: `https://your-project.vercel.app`

You can now share this link with users to start booking car washes! 🚗✨

---

**Made with ❤️ by the CareLine Team**
