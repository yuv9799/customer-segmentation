# Deployment Guide

Your Customer Segmentation app has been successfully pushed to:
**https://github.com/yuv9799/customer-segmentation**

## 🚀 Quick Deployment Options

### Option 1: Railway (Recommended - Easiest)

1. **Install Railway CLI:**
```bash
npm i -g @railway/cli
```

2. **Login and Deploy:**
```bash
railway login
railway init
railway up
```

3. **Add Environment Variables in Railway Dashboard:**
   - Go to your project settings
   - Add: `VITE_API_URL` = `https://your-backend-url.railway.app`

### Option 2: Render.com

1. **Backend Service:**
   - Go to https://render.com
   - Create new Web Service
   - Connect your GitHub repo
   - Select the backend folder
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

2. **Frontend Service:**
   - Create another Web Service
   - Connect your GitHub repo
   - Select the frontend folder
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
   - Add environment variable: `VITE_API_URL` = `https://your-backend-url.onrender.com`

### Option 3: VPS (DigitalOcean, AWS, etc.)

1. **Clone the repo:**
```bash
git clone https://github.com/yuv9799/customer-segmentation.git
cd customer-segmentation
```

2. **Start with Docker Compose:**
```bash
docker-compose up -d
```

3. **Configure Nginx reverse proxy** (optional for production)

### Option 4: GitHub Pages (Frontend) + Render (Backend)

1. **Deploy Frontend to GitHub Pages:**
   - Go to repo Settings → Pages
   - Select "GitHub Actions" or "Deploy from a branch"
   - Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Frontend
on:
  push:
    branches: [master]
    paths: ['frontend/**']
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 20
      - name: Build
        run: |
          cd frontend
          npm ci
          npm run build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: frontend/dist
```

2. **Backend on Render** (see Option 2)

## 📋 Post-Deployment Checklist

- [ ] Backend API is running and accessible
- [ ] Frontend loads correctly
- [ ] API calls from frontend work (no CORS errors)
- [ ] Test single prediction feature
- [ ] Test batch segmentation feature
- [ ] Visualizations load properly

## 🔧 Environment Variables

Create `.env` file for local development:

```env
# Backend (.env in backend folder)
PYTHONUNBUFFERED=1

# Frontend (.env in frontend folder)
VITE_API_URL=http://localhost:8000
```

## 📊 Monitoring

- Check application logs regularly
- Monitor API response times
- Track model prediction accuracy
- Update clustering model as new data arrives

## 🔄 Updates

To update your deployed application:

```bash
git add .
git commit -m "Update description"
git push origin master
```

If using Railway/Render, they will automatically redeploy on push.