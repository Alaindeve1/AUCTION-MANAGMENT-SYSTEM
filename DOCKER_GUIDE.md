# 🐳 Docker Containerization Guide

## 📋 What is Docker?

Docker packages your application into containers:
- **Isolated**: Each app runs in its own container
- **Consistent**: Works the same everywhere (local, staging, production)
- **Portable**: Easy to deploy to any platform
- **Free**: Open source, free to use

---

## 🎯 How It Works

### Architecture:
```
┌─────────────────────────────────────────┐
│         Docker Compose (Local)         │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────┐    ┌──────────────┐  │
│  │  Frontend   │    │   Backend    │  │
│  │  (Nginx)    │───▶│  (Spring)    │  │
│  │  Port 3000  │    │  Port 8080   │  │
│  └─────────────┘    └──────┬───────┘  │
│                            │           │
│                    ┌───────▼────────┐  │
│                    │  PostgreSQL   │  │
│                    │  Port 5432    │  │
│                    └────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 📦 Files Created

### 1. Backend Dockerfile (`auction-system/Dockerfile`)
- Multi-stage build for Spring Boot
- Uses Maven to build
- Creates optimized JAR
- Runs on Java 17

### 2. Frontend Dockerfile (`auction-frontend/Dockerfile`)
- Multi-stage build for React
- Uses Node.js to build
- Serves with Nginx
- Optimized for production

### 3. Nginx Config (`auction-frontend/nginx.conf`)
- SPA routing support
- Gzip compression
- Static asset caching
- Security headers

### 4. Docker Compose (`docker-compose.yml`)
- Orchestrates all services
- Database + Backend + Frontend
- Local development setup

### 5. .dockerignore Files
- Excludes unnecessary files
- Smaller images
- Faster builds

---

## 🚀 Local Development

### Start Everything:
```bash
docker-compose up -d
```

This starts:
- PostgreSQL database
- Spring Boot backend
- React frontend

### Access Your App:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080
- **Database**: localhost:5432

### Stop Everything:
```bash
docker-compose down
```

### View Logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Rebuild After Changes:
```bash
docker-compose up -d --build
```

---

## ☁️ Deploying to Render

### Why Render with Docker?
- ✅ Free tier available
- ✅ Supports Docker
- ✅ PostgreSQL included
- ✅ Automatic HTTPS
- ✅ Easy environment variables

### Architecture on Render:
```
┌─────────────────────────────────────────┐
│           Render Platform               │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐                      │
│  │  Frontend    │  (Web Service)       │
│  │  (Docker)    │                      │
│  │  Port 80     │                      │
│  └──────┬───────┘                      │
│         │                              │
│  ┌──────▼────────┐                      │
│  │   Backend     │  (Web Service)      │
│  │   (Docker)    │                      │
│  │   Port 8080   │                      │
│  └──────┬────────┘                      │
│         │                              │
│  ┌──────▼──────────────┐               │
│  │   PostgreSQL        │  (Database)   │
│  │   (Managed)         │               │
│  └─────────────────────┘               │
└─────────────────────────────────────────┘
```

---

## 📝 Deployment Steps

### Step 1: Prepare Repository

Make sure your Docker files are committed:
```bash
git add .
git commit -m "Add Docker configuration"
git push
```

### Step 2: Deploy Backend to Render

1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   ```
   Name: auction-backend
   Region: US East
   Branch: main
   Root Directory: auction-system
   Environment: Docker
   Docker Command: (auto-detected)
   ```
5. Add PostgreSQL database:
   - Click **"New +"** → **"PostgreSQL"**
   - Name: `auction-db`
6. Set Environment Variables:
   ```
   DB_HOST=${{Postgres.PGHOST}}
   DB_PORT=${{Postgres.PGPORT}}
   DB_NAME=${{Postgres.PGDATABASE}}
   DB_USERNAME=${{Postgres.PGUSER}}
   DB_PASSWORD=${{Postgres.PGPASSWORD}}
   JWT_SECRET=bXktc3VwZXItc2VjcmV0LWtleS1mb3ItanVzdC1hdWN0aW9uLXN5c3RlbQ==
   CORS_ORIGINS=https://your-frontend.onrender.com
   ```
7. Deploy!

**Get your backend URL**: `https://your-backend.onrender.com`

---

### Step 3: Deploy Frontend to Render

1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   ```
   Name: auction-frontend
   Region: US East
   Branch: main
   Root Directory: auction-frontend
   Environment: Docker
   Docker Command: (auto-detected)
   ```
5. Set Environment Variables:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   VITE_WS_URL=https://your-backend.onrender.com
   ```
6. Deploy!

**Get your frontend URL**: `https://your-frontend.onrender.com`

---

### Step 4: Update CORS

1. Go to your backend service on Render
2. Add environment variable:
   ```
   CORS_ORIGINS=https://your-frontend.onrender.com
   ```
3. Redeploy backend

---

## ✅ Benefits of Docker

### Consistency:
- ✅ Same environment everywhere
- ✅ No "works on my machine" issues
- ✅ Predictable deployments

### Efficiency:
- ✅ Faster builds with caching
- ✅ Smaller images
- ✅ Resource efficient

### Deployment:
- ✅ Easy to deploy to any platform
- ✅ Render supports Docker natively
- ✅ One-click deployments

### Free Tier:
- ✅ Docker is completely free
- ✅ Render free tier supports Docker
- ✅ No additional costs

---

## 🔧 Troubleshooting

### Issue: Container won't start
**Solution**: Check logs
```bash
docker-compose logs backend
```

### Issue: Database connection failed
**Solution**: Ensure postgres is healthy
```bash
docker-compose ps
```

### Issue: Frontend can't connect to backend
**Solution**: Check environment variables
```bash
docker-compose exec frontend env | grep VITE_API_URL
```

### Issue: Port already in use
**Solution**: Stop other services or change ports
```bash
# Stop everything
docker-compose down

# Change port in docker-compose.yml
ports:
  - "3001:80"  # Instead of 3000
```

---

## 📊 Docker Commands Cheat Sheet

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose up -d --build backend

# Execute command in container
docker-compose exec backend sh
docker-compose exec frontend sh

# Remove everything including volumes
docker-compose down -v

# Check status
docker-compose ps
```

---

## 🎯 Production Considerations

### 1. Environment Variables
- Use Render's environment variables
- Never hardcode secrets
- Use different values for production

### 2. Database Backups
- Render PostgreSQL includes automatic backups
- Test restore procedures

### 3. Monitoring
- Monitor logs in Render dashboard
- Set up alerts
- Check resource usage

### 4. Updates
- Update dependencies regularly
- Test in staging first
- Use Git tags for versions

---

## 🎉 Summary

### What You Have Now:
✅ Dockerfiles for backend and frontend
✅ Docker Compose for local development
✅ Nginx configuration for frontend
✅ Ready for Render deployment
✅ Free and open source

### Next Steps:
1. Test locally with `docker-compose up`
2. Push to GitHub
3. Deploy to Render
4. Set environment variables
5. Test production

**Your app is now containerized and ready for deployment!** 🚀

