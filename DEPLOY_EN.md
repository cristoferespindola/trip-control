**[🇧🇷 Ver Versão em Português](./DEPLOY.md)**

# 🚀 Vercel Deployment Guide

This guide will help you deploy TripControl to Vercel quickly and efficiently.

## 📋 Prerequisites

- [ ] [Vercel](https://vercel.com) account
- [ ] [GitHub](https://github.com) account
- [ ] PostgreSQL database (we recommend [Neon](https://neon.tech))

## 🔧 Step by Step

### 1. Prepare the Repository

```bash
# Clone the repository
git clone <your-repository>
cd trip-control

# Make sure everything is committed
git add .
git commit -m "Preparing for deployment"
git push origin main
```

### 2. Configure Database

#### Option A: Neon (Recommended)
1. Go to [neon.tech](https://neon.tech)
2. Create a free account
3. Create a new project
4. Copy the connection URL (format: `postgresql://user:password@host/database`)

#### Option B: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a free account
3. Create a new project
4. Go to Settings > Database
5. Copy the connection string

#### Option C: Vercel Postgres
1. In Vercel, go to Storage
2. Create a new PostgreSQL database
3. Copy the connection URL

### 3. Deploy to Vercel

#### Method 1: Import from GitHub
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your repository from GitHub
4. Configure environment variables:
   ```
   DATABASE_URL=your_postgresql_database_url
   ```
5. Click "Deploy"

#### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Configure environment variables
vercel env add DATABASE_URL
```

### 4. Configure Environment Variables

In Vercel, go to:
1. **Settings** > **Environment Variables**
2. Add:
   ```
   Name: DATABASE_URL
   Value: your_postgresql_database_url
   Environment: Production, Preview, Development
   ```

### 5. Configure Database

After the first deployment:
1. Access your project in Vercel
2. Prisma will create tables automatically
3. For sample data, run:
   ```bash
   # Via Vercel CLI
   vercel env pull .env.local
   npm run seed
   ```

## 🔍 Deployment Verification

### Checklist
- [ ] Build without errors
- [ ] Database connected
- [ ] Tables created
- [ ] Application working
- [ ] SSL active
- [ ] Custom domain (optional)

### Tests
1. Access the project URL
2. Test vehicle registration
3. Test driver registration
4. Test client registration
5. Test trip registration
6. Verify city search

## 🛠️ Troubleshooting

### Error: "Database connection failed"
- Check if `DATABASE_URL` is correct
- Confirm database is accessible
- Test connection locally

### Error: "Prisma client not generated"
- Check if `postinstall` script is in package.json
- Force rebuild in Vercel

### Error: "Build failed"
- Check logs in Vercel
- Confirm all dependencies are in package.json
- Test build locally: `npm run build`

### Error: "API routes not working"
- Check if routes are in `src/app/api/`
- Confirm Next.js is configured correctly

## 📊 Monitoring

### Vercel Analytics
- Enable Vercel Analytics to monitor performance
- Configure error alerts

### Logs
- Monitor logs in Vercel
- Configure build failure alerts

## 🔄 Automatic Deployment

### GitHub Integration
1. Connect your repository to Vercel
2. Configure production branch (usually `main`)
3. Each push will trigger automatic deployment

### Preview Deployments
- Pull requests generate automatic previews
- Test changes before merging

## 🚀 Optimizations

### Performance
- [ ] Optimized images
- [ ] Lazy loading implemented
- [ ] Optimized bundle size

### SEO
- [ ] Configured meta tags
- [ ] Generated sitemap
- [ ] Configured robots.txt

### Security
- [ ] Protected environment variables
- [ ] Configured CORS
- [ ] Implemented rate limiting

## 📞 Support

### Vercel Support
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### Database
- **Neon**: [Documentation](https://neon.tech/docs)
- **Supabase**: [Documentation](https://supabase.com/docs)

### Prisma
- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Discord](https://discord.gg/prisma)

---

🎉 **Congratulations!** Your TripControl is live!

**Project URL**: https://your-project.vercel.app
