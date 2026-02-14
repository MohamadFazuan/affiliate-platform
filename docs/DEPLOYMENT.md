# 🚢 Deployment Guide

Complete guide for deploying AffiliateIQ to Cloudflare's edge network.

## Prerequisites

- Cloudflare account (free tier works)
- Wrangler CLI installed: `npm install -g wrangler`
- Node.js 18+ and npm
- Git (for version control)

## Setup Checklist

- [ ] Cloudflare account created
- [ ] Wrangler CLI authenticated
- [ ] D1 database created
- [ ] Environment variables configured
- [ ] Domain configured (optional)

## Step-by-Step Deployment

### 1. Authenticate Wrangler

```bash
npx wrangler login
```

This opens your browser to authenticate with Cloudflare.

### 2. Create D1 Database

```bash
npx wrangler d1 create affiliate-db
```

**Output Example**:
```
✅ Successfully created DB 'affiliate-db'

[[d1_databases]]
binding = "DB"
database_name = "affiliate-db"
database_id = "your-database-id-here"
```

**Important**: Copy the `database_id` from the output.

### 3. Update wrangler.toml

Open `wrangler.toml` and update the database ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "affiliate-db"
database_id = "your-database-id-here"  # ← Paste your ID here
```

### 4. Set Production Secrets

Set your JWT secret (never commit this to git):

```bash
npx wrangler secret put JWT_SECRET
# Enter a strong random string when prompted
```

### 5. Run Database Migrations

Apply schema to remote database:

```bash
npm run db:migrate:remote
```

Seed with sample data (optional):

```bash
npm run db:seed:remote
```

### 6. Deploy Worker (Backend)

```bash
npm run worker:deploy
```

**Output Example**:
```
✨ Uploaded affiliate-platform-worker (x.xx kB)
✨ Published affiliate-platform-worker
   https://affiliate-platform-worker.your-subdomain.workers.dev
```

**Important**: Copy the Worker URL - you'll need it for the frontend.

### 7. Deploy Frontend (Cloudflare Pages)

#### Option A: Automatic Deployment via Wrangler

```bash
npm run pages:deploy
```

#### Option B: Connect GitHub Repository

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** → **Create a project**
3. Connect your Git repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `/`
   - **Environment variables**:
     - `NEXT_PUBLIC_API_URL`: Your Worker URL from Step 6

### 8. Configure Environment Variables

In Cloudflare Pages dashboard:

1. Go to your Pages project
2. **Settings** → **Environment variables**
3. Add production variables:

| Variable | Value | Example |
|----------|-------|---------|
| `NEXT_PUBLIC_API_URL` | Your Worker URL | `https://affiliate-platform-worker.your-subdomain.workers.dev` |
| `NODE_VERSION` | `18` or higher | `18.17.0` |

### 9. Custom Domain (Optional)

#### For Pages (Frontend):

1. In Pages project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `app.yourdomain.com`)
4. Follow DNS configuration instructions

#### For Worker (API):

1. In Workers → Your worker → **Settings** → **Triggers**
2. Add custom domain
3. Enter domain (e.g., `api.yourdomain.com`)
4. Configure DNS as instructed

### 10. Verify Deployment

Test your deployed application:

**Frontend**:
```bash
curl https://your-pages-url.pages.dev
```

**API Health Check**:
```bash
curl https://your-worker-url.workers.dev/api/health
```

## Configuration Reference

### wrangler.toml

```toml
name = "affiliate-platform-worker"
main = "backend/worker.ts"
compatibility_date = "2024-01-01"

# D1 Database
[[d1_databases]]
binding = "DB"
database_name = "affiliate-db"
database_id = "YOUR_DATABASE_ID"

# R2 Storage (optional)
[[r2_buckets]]
binding = "ASSETS"
bucket_name = "affiliate-assets"

# Environment variables (non-sensitive)
[vars]
ENVIRONMENT = "production"

# Rate limiting
[limits]
cpu_ms = 50
```

### Environment Variables

**.env.local** (Frontend - Development):
```bash
NEXT_PUBLIC_API_URL=http://localhost:8787
```

**.env.production** (Frontend - Production):
```bash
NEXT_PUBLIC_API_URL=https://your-worker.workers.dev
```

**.dev.vars** (Worker - Development):
```bash
JWT_SECRET=your-dev-secret-key
ENVIRONMENT=development
```

**Cloudflare Secrets** (Worker - Production):
```bash
# Set via: npx wrangler secret put JWT_SECRET
JWT_SECRET=your-production-secret-key
```

## Database Management

### View Database

```bash
npx wrangler d1 execute affiliate-db --remote --command "SELECT * FROM users LIMIT 10"
```

### Backup Database

Export data:
```bash
npx wrangler d1 export affiliate-db --remote --output backup.sql
```

### Reset Database

⚠️ **Warning**: This deletes all data!

```bash
# Drop and recreate tables
npx wrangler d1 execute affiliate-db --remote --file database/schema.sql
npx wrangler d1 execute affiliate-db --remote --file database/seed.sql
```

## Rollback & Versioning

### View Deployments

```bash
npx wrangler deployments list
```

### Rollback Worker

```bash
npx wrangler rollback [deployment-id]
```

### Rollback Pages

In Pages dashboard → **Deployments** → Select previous deployment → **Rollback**

## Monitoring & Logs

### View Worker Logs

```bash
npx wrangler tail
```

### Real-time Logs (filtered)

```bash
npx wrangler tail --format pretty
```

### Analytics

View in Cloudflare Dashboard:
- **Workers** → Your worker → **Metrics**
- **Pages** → Your site → **Analytics**

## Troubleshooting

### Issue: Database Not Found

**Error**: `D1_ERROR: no such table: users`

**Solution**:
```bash
npm run db:migrate:remote
```

### Issue: CORS Errors

**Error**: `Access-Control-Allow-Origin` blocked

**Solution**: Verify Worker URL in frontend env variables matches deployed Worker URL.

### Issue: 401 Unauthorized

**Error**: All API calls return 401

**Solution**:
1. Check JWT_SECRET is set in Worker secrets
2. Clear browser localStorage and re-login
3. Verify token expiration (default 30 days)

### Issue: Build Fails

**Error**: `Module not found` during build

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

### Issue: Worker Exceeds CPU Time

**Error**: `Error 1102: Worker exceeded CPU time limit`

**Solution**: Optimize database queries or increase limits in paid plan.

## Performance Optimization

### Enable Caching

Add cache headers in Worker:
```typescript
return new Response(data, {
  headers: {
    'Cache-Control': 'public, max-age=3600',
    'Content-Type': 'application/json'
  }
})
```

### Optimize Database Queries

- Use indexes (already in schema)
- Limit result sets
- Use prepared statements
- Batch operations when possible

### Enable Compression

Cloudflare automatically compresses responses, but ensure large responses are optimized.

## Security Checklist

- [ ] JWT_SECRET is strong (32+ random characters)
- [ ] Secrets stored in Cloudflare, not in code
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] HTTPS enforced (automatic with Cloudflare)
- [ ] Input validation on all endpoints
- [ ] SQL injection protected (parameterized queries)

## Cost Estimation

**Cloudflare Free Tier Includes**:
- 100,000 Worker requests/day
- Unlimited Pages bandwidth
- 5 GB D1 storage
- 5 million D1 reads/day

**Estimated Monthly Cost**: $0 - $5 for small to medium sites

## Support & Resources

- **Cloudflare Workers Docs**: https://developers.cloudflare.com/workers/
- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/
- **D1 Database Docs**: https://developers.cloudflare.com/d1/
- **Wrangler CLI Docs**: https://developers.cloudflare.com/workers/wrangler/

## Next Steps

After deployment:
1. Test all features in production
2. Set up monitoring alerts
3. Configure custom domain
4. Enable Cloudflare Analytics
5. Set up CI/CD pipeline (GitHub Actions)

---

**Need Help?** Open an issue on GitHub or check the Cloudflare Community Forums.
