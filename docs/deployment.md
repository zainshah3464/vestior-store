# Deployment Guide

> **Audience:** Anyone deploying VESTIOR to production — whether Vercel, Docker, or a VPS.
>
> **Goal:** Zero-downtime deployments with full monitoring and rollback capability.

---

## Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Environment Variables Reference](#environment-variables-reference)
- [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
- [Custom Domain Setup](#custom-domain-setup)
- [Supabase Production Setup](#supabase-production-setup)
- [Stripe Production Setup](#stripe-production-setup)
- [MongoDB Production Setup](#mongodb-production-setup)
- [Upstash Production Setup](#upstash-production-setup)
- [Cron Jobs](#cron-jobs)
- [Docker Deployment](#docker-deployment)
- [VPS Deployment](#vps-deployment)
- [Monitoring & Logs](#monitoring--logs)
- [Rollback Procedure](#rollback-procedure)
- [Post-Deploy Verification](#post-deploy-verification)
- [Scaling Checklist](#scaling-checklist)

---

## Pre-Deployment Checklist

Before you push to production, verify these are done:

### Code
- [ ] `npm run typecheck` — zero errors
- [ ] `npm run lint` — zero errors
- [ ] `npm run test` — all 53 unit tests pass
- [ ] `npm run test:e2e` — all 21 E2E tests pass
- [ ] `npm run build` — succeeds locally

### Database
- [ ] All 7 migrations run in production Supabase
- [ ] RLS verified on every table
- [ ] Storage bucket `product-images` created and public
- [ ] Realtime enabled on `orders` table
- [ ] Indexes created (auto-run in migrations)

### Services
- [ ] Supabase project created (production tier, not dev)
- [ ] MongoDB Atlas cluster created
- [ ] Upstash Redis + QStash created
- [ ] Stripe account in live mode (not test)
- [ ] Gmail App Password generated

### Configuration
- [ ] All env vars documented in `.env.example`
- [ ] Secrets generated with `openssl rand -hex 32` (never reused from dev)
- [ ] `NEXT_PUBLIC_SITE_URL` set to production domain
- [ ] Supabase redirect URLs updated with production domain
- [ ] Stripe webhook endpoint points to production

### Security
- [ ] Different `IP_HASH_SALT` than dev (production isolation)
- [ ] Different `CRON_SECRET` than dev
- [ ] Service-role key never committed
- [ ] `.env.local` in `.gitignore`

---

## Environment Variables Reference

Every variable with: purpose, where to get it, format, dev vs prod difference.

### Supabase

| Variable | Purpose | Where to get | Dev / Prod |
|----------|---------|--------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | API endpoint | Supabase → Settings → API | Same URL (or separate projects) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public client key | Same page | Different per project |
| `SUPABASE_SERVICE_ROLE_KEY` | Bypasses RLS | Same page | **Server-only** |

**Recommendation:** Use **separate Supabase projects** for dev and prod. Prevents accidental data mixing.

### MongoDB

| Variable | Format | Notes |
|----------|--------|-------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true` | Include `retryWrites=true` |
| `MONGODB_DB_NAME` | `vestior` | Same name across envs is fine (different clusters) |

**Tip:** Use different MongoDB databases on the same cluster: `vestior-dev`, `vestior-prod`.

### Upstash Redis

| Variable | Where | Notes |
|----------|-------|-------|
| `UPSTASH_REDIS_REST_URL` | Console → DB → REST API | HTTPS endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Same | Rotatable |

**Important:** Redis state doesn't matter much across envs (rate limits, caches). Same cluster can serve both.

### Upstash QStash

| Variable | Notes |
|----------|-------|
| `QSTASH_URL` | Region-specific: `qstash-us-east-1.upstash.io` or `qstash-eu-central-1.upstash.io` |
| `QSTASH_TOKEN` | Global token |
| `QSTASH_CURRENT_SIGNING_KEY` | Current key (rotates every ~90 days) |
| `QSTASH_NEXT_SIGNING_KEY` | Next key (for rotation grace period) |

### Email (Gmail SMTP)

| Variable | Format |
|----------|--------|
| `GMAIL_USER` | `your-email@gmail.com` |
| `GMAIL_APP_PASSWORD` | 16 chars with spaces: `xxxx xxxx xxxx xxxx` |
| `EMAIL_FROM` | `VESTIOR <your-email@gmail.com>` |

**Why Gmail?** Sends to any recipient without domain verification. Free tier: 500/day.

**Migration path:** Switch to Resend later by changing `mailer.ts`.

### Stripe

| Variable | Where | Notes |
|----------|-------|-------|
| `STRIPE_SECRET_KEY` | Stripe → Developers → API Keys | `sk_test_...` for dev, `sk_live_...` for prod |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Webhooks → endpoint | Per endpoint, different per env |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Same page | `pk_test_...` or `pk_live_...` |

### Security

| Variable | How to generate |
|----------|-----------------|
| `IP_HASH_SALT` | `openssl rand -hex 32` |
| `CRON_SECRET` | `openssl rand -hex 32` |

**Never reuse** across environments. Different salts mean compromised dev keys can't decrypt prod data.

### Site

| Variable | Dev value | Prod value |
|----------|-----------|-----------|
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | `https://your-domain.com` |
| `ADMIN_EMAIL` | Your email | Same or team inbox |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional | GA4 measurement ID |

---

## Vercel Deployment (Recommended)

### Step 1: Import project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Select your GitHub repo (`vestior-store`)
3. Framework preset: **Next.js** (auto-detected)
4. Root directory: `./` (default)
5. Build command: `npm run build` (default)
6. Output directory: `.next` (default)
7. Install command: `npm install` (default)

**Do NOT deploy yet.** Add env vars first.

### Step 2: Add environment variables

**Settings → Environment Variables** → add each var. Vercel lets you scope them:

- **Production** — used on `main` branch
- **Preview** — used on all other branches
- **Development** — used by `vercel dev` locally

**Recommended scoping:**

| Variable | Production | Preview | Development |
|----------|-----------|---------|-------------|
| All Supabase | ✅ | ✅ | ✅ |
| All MongoDB | ✅ | ✅ | ✅ |
| All Redis | ✅ | ✅ | ✅ |
| All QStash | ✅ | ✅ | ✅ |
| All Gmail | ✅ | ✅ | ✅ |
| `STRIPE_SECRET_KEY` | `sk_live_...` | `sk_test_...` | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | prod secret | test secret | — |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | `pk_test_...` | `pk_test_...` |
| `NEXT_PUBLIC_SITE_URL` | prod URL | (Vercel auto) | localhost |

**Tip:** For Preview, Vercel auto-injects `VERCEL_URL` (unique per deploy). You can set `NEXT_PUBLIC_SITE_URL` dynamically to `https://${VERCEL_URL}` in code — but this breaks auth callbacks. Better to leave preview pointing at a stable `staging.your-domain.com`.

### Step 3: Deploy

Click **Deploy**. First build takes ~3 minutes.

### Step 4: Post-deploy

1. Note the deployment URL: `https://vestior-store-abc123.vercel.app`
2. Configure custom domain (next section)
3. Update Supabase + Stripe redirect URLs with the final domain

### Step 5: Enable Vercel cron

Cron jobs are configured in `vercel.json`. On **Hobby plan**, only **1 cron** is allowed. We use a combined cron:

```json
{
  "crons": [
    {
      "path": "/api/cron/daily",
      "schedule": "0 9 * * *"
    }
  ]
}
```

The `/api/cron/daily` route calls both low-stock + abandoned-cart logic sequentially.

**On Pro plan**, you can split into multiple crons:

```json
{
  "crons": [
    { "path": "/api/cron/low-stock-alert", "schedule": "0 */6 * * *" },
    { "path": "/api/cron/abandoned-carts", "schedule": "0 * * * *" },
    { "path": "/api/cron/daily-analytics", "schedule": "0 1 * * *" }
  ]
}
```

### Step 6: Verify deployment

- Open `https://your-domain.com` — homepage loads
- Test signup + login
- Place a test order
- Check Vercel → Functions tab for real-time logs

---

## Custom Domain Setup

### On Vercel

1. **Settings → Domains → Add Domain**
2. Enter your domain (e.g., `vestior.com`)
3. Vercel gives you DNS records to add:

| Type | Name | Value |
|------|------|-------|
| A | `@` | `76.76.21.21` (Vercel's IP) |
| CNAME | `www` | `cname.vercel-dns.com` |

4. Add these in your domain registrar (Cloudflare, Namecheap, GoDaddy, etc.)
5. Wait for propagation (~5-30 min)
6. Verify SSL — Vercel auto-provisions Let's Encrypt certificates

### Update downstream services

**Supabase:**
```
Authentication → URL Configuration:
- Site URL: https://vestior.com
- Redirect URLs:
  - https://vestior.com/auth/callback
  - https://www.vestior.com/auth/callback
```

**Stripe:**
```
Developers → Webhooks → endpoint URL:
- https://vestior.com/api/webhooks/stripe
```

**Vercel env vars:**
```
NEXT_PUBLIC_SITE_URL=https://vestior.com
```

Redeploy for env var change to take effect.

### Google OAuth

**Google Cloud Console → OAuth 2.0 Client:**
```
Authorized JavaScript origins:
- https://vestior.com
- https://www.vestior.com

Authorized redirect URIs:
- https://vestior.com/auth/callback
- https://www.vestior.com/auth/callback
```

**Note:** The callback goes through Supabase first, then bounces back. So Supabase must also whitelist these URLs (Step above).

---

## Supabase Production Setup

### 1. Create production project

- Separate from your dev project (different data)
- Same region as your Vercel deployment (minimizes latency)

### 2. Run migrations

Copy each file from `supabase/migrations/` into SQL Editor and run:

```
20261003_fix_rls_policies.sql
20261004_add_indexes.sql
20261004_dashboard_stats.sql
20261005_add_payment_fields.sql
20261011_add_product_reviews.sql
20261012_add_wishlists.sql
20261013_add_coupons.sql
```

**Verify after each:**
```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
-- All should show rowsecurity = true
```

### 3. Create storage bucket

```sql
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true);
```

Or via Supabase UI: **Storage → New Bucket → Name: `product-images` → Public: ON**.

### 4. Enable Realtime

**Database → Replication → supabase_realtime publication:**

Add tables:
- `orders` (required for admin notifications + customer tracking)

Or:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
```

### 5. Configure auth

**Authentication → Providers:**
- Email: ON (with "Confirm email")
- Google: ON (add client ID + secret)

**Authentication → URL Configuration:**
- Site URL: `https://vestior.com`
- Redirect URLs: as above

**Authentication → Email Templates:**
- Customize confirmation, recovery, magic link templates with VESTIOR branding (optional)

### 6. Add admin user

After first signup in production:
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

### 7. Enable backups

**Settings → Database → Backups:**
- Free tier: daily backups (retained 7 days)
- Pro tier: point-in-time recovery (PITR)

**Recommendation:** Upgrade to Pro when you have real customers.

---

## Stripe Production Setup

### 1. Activate live mode

- Stripe Dashboard → Toggle "Test mode" OFF
- Complete business verification (ID, bank account)
- Note new keys: `sk_live_...`, `pk_live_...`

### 2. Update env vars

Update Vercel production env vars with live keys.

### 3. Add production webhook

**Developers → Webhooks → Add endpoint:**

```
Endpoint URL: https://vestior.com/api/webhooks/stripe
Events to send:
  - payment_intent.succeeded
  - payment_intent.payment_failed
  - charge.refunded
  - charge.dispute.created (optional)
```

Copy the signing secret → `STRIPE_WEBHOOK_SECRET` in Vercel.

### 4. Configure business settings

- **Settings → Business** — Company info, address
- **Settings → Payment methods** — Enable cards (default)
- **Settings → Radar** — Enable fraud detection (free tier: basic rules)
- **Settings → Customer emails** — Turn on Stripe's automatic receipts (or disable if using our emails)

### 5. Test end-to-end

- Place a real order with a real card (small amount)
- Verify webhook hits our endpoint
- Verify order status = `completed`
- Verify MongoDB has `payment_transactions` entry
- Issue a test refund
- Verify refund webhook + order status update

### 6. Compliance

- **PCI:** We never touch raw card data. Stripe Elements hosts the input fields, tokenizes client-side, sends to Stripe. We only store `payment_intent_id`.
- **Tax:** Enable Stripe Tax if selling to multiple jurisdictions (adds ~0.5% per transaction).
- **3D Secure:** Enabled by default in modern Stripe; no code changes needed.

---

## MongoDB Production Setup

### 1. Upgrade cluster (optional)

Free M0 is fine for the first 10K events/day. Upgrade when:
- Storage > 300MB
- Slow query warnings
- Need dedicated IOPS

**Recommended tier:** M2 ($9/mo) for 2GB storage + shared compute.

### 2. Network access

**Security → Network Access → IP Access List:**

**Option A (simple):** Allow `0.0.0.0/0` (any IP). MongoDB Atlas still requires credentials. Fine for low-risk.

**Option B (strict):** Add Vercel's egress IPs. Vercel publishes IP ranges per region.

### 3. Create indexes

Run in MongoDB Atlas → Data Explorer → mongosh:

```javascript
use vestior

// Events: TTL index (auto-delete after 90 days)
db.events.createIndex(
  { timestamp: -1 },
  { expireAfterSeconds: 7776000 }
)
db.events.createIndex({ session_id: 1 })
db.events.createIndex({ user_id: 1, timestamp: -1 })
db.events.createIndex({ event_type: 1, timestamp: -1 })

// Email logs
db.email_logs.createIndex({ email: 1, created_at: -1 })
db.email_logs.createIndex({ status: 1, created_at: -1 })

// Payments
db.payment_transactions.createIndex(
  { provider_txn_id: 1 },
  { unique: true }
)
db.payment_transactions.createIndex({ order_id: 1 })

// Audit
db.audit_logs.createIndex({ timestamp: -1 })
db.audit_logs.createIndex({ target_id: 1 })

// Carts
db.cart_snapshots.createIndex({ user_id: 1 }, { unique: true })
db.cart_snapshots.createIndex({ recovery_token: 1 }, { unique: true })
db.cart_snapshots.createIndex({ updated_at: -1 })
```

### 4. Enable backups

**Backup → Enable Cloud Backup:**
- M0: No backups (free tier limitation)
- M2+: Automated daily backups

**Recommendation:** Set up a manual `mongodump` cron for M0 if you need continuity.

### 5. Connection pooling

MongoDB Atlas supports connection pooling. Our `mongodb.ts` uses:

```typescript
maxPoolSize: 10,      // Per Vercel function instance
minPoolSize: 1,
maxIdleTimeMS: 60000,
```

**Why 10?** Vercel can spin up multiple function instances. With 10 instances × 10 connections = 100 connections. M0 allows 500 total. Safe.

**If you hit limits:** Lower `maxPoolSize` to 5, or upgrade Atlas tier.

---

## Upstash Production Setup

### 1. Redis

**Region:** Choose the region closest to your Vercel region (usually `us-east-1` for North America, `eu-central-1` for Europe).

**Tier:** Free tier (256MB, 500K commands/month) is plenty for MVP.

**Quotas to monitor:**
- Commands per day
- Storage bytes
- Bandwidth

Enable **alerts** in Upstash console if approaching limits.

### 2. QStash

Same account, separate tab.

**Region:** Match Redis region. QStash URLs are region-specific:
- `us-east-1`: `https://qstash-us-east-1.upstash.io`
- `eu-central-1`: `https://qstash-eu-central-1.upstash.io`

**Quotas:**
- 500 messages/day (free)
- 10K messages/month

**For higher volume:** $1 per 100K messages.

### 3. Verify setup

```bash
curl -X POST https://qstash-us-east-1.upstash.io/v2/publish/https://example.com \
  -H "Authorization: Bearer $QSTASH_TOKEN"
```

If you get a success response, QStash is working.

---

## Cron Jobs

### How Vercel cron works

`vercel.json` `crons` array defines schedules. Vercel hits each path with a `Bearer` header containing `CRON_SECRET`... actually no, Vercel uses a header called `x-vercel-cron-secret` OR the `Authorization: Bearer ${CRON_SECRET}` if configured. Our routes check `Authorization: Bearer ${CRON_SECRET}` — Vercel auto-injects this.

Actually to be precise: Vercel's cron sends a request with `user-agent: vercel-cron/1.0`. Our routes verify with `Authorization: Bearer ${CRON_SECRET}` — you must configure Vercel to send this header, OR update our route to check `user-agent` instead. 

**Our current implementation:** Routes check `Authorization: Bearer ${CRON_SECRET}`. Vercel cron by default does NOT send this. So we need either:
1. A Vercel Pro feature: **Cron Secret** (set in Vercel Settings → Environment Variables → `CRON_SECRET` — Vercel auto-injects).
2. Or update routes to allow `user-agent: vercel-cron`.

**Recommendation:** Set `CRON_SECRET` in Vercel env vars. Vercel cron will then send `Authorization: Bearer <CRON_SECRET>` automatically. Our routes will accept it.

### Cron schedule cheatsheet

```
0 9 * * *        Daily at 9:00 AM UTC
0 */6 * * *      Every 6 hours
*/30 * * * *     Every 30 minutes
0 0 * * 0        Weekly on Sunday at midnight
```

### Manual trigger for testing

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://vestior.com/api/cron/daily
```

**Expected response:**
```json
{
  "lowStock": { "sent": 1, "count": 3 },
  "abandonedCarts": { "processed": 5, "sent": 5, "failed": 0 }
}
```

### External cron fallback (Hobby plan)

If Vercel Hobby's single-cron limit is too restrictive:

1. Sign up at [cron-job.org](https://cron-job.org) (free)
2. Create jobs:
   - URL: `https://vestior.com/api/cron/low-stock-alert`
   - Schedule: `0 */6 * * *`
   - Header: `Authorization: Bearer <CRON_SECRET>`
3. Repeat for other cron endpoints

---

## Docker Deployment

### Building locally

```bash
# Enable standalone output
export NEXT_OUTPUT=standalone

# Build
docker build -f Dockerfile.vercel -t vestior .

# Run
docker run -p 3000:3000 --env-file .env.local vestior
```

### Dockerfile highlights

- **Multi-stage build** — deps → builder → runner
- **Alpine base** — ~150MB final image (vs ~900MB naive)
- **Non-root user** — `nextjs:nodejs`
- **Standalone output** — only production deps in final image

### Deploying to other hosts

**Railway:**
```bash
railway init
railway up
```
Set env vars in Railway dashboard. Railway auto-detects the Dockerfile.

**Render:**
- Create a Web Service
- Build Command: (empty, Dockerfile used)
- Set `NEXT_OUTPUT=standalone` env var

**Fly.io:**
```bash
fly launch --dockerfile Dockerfile.vercel
fly deploy
```

---

## VPS Deployment

For full control (Ubuntu 22.04 example).

### 1. Install Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Install PM2

```bash
sudo npm install -g pm2
```

### 3. Clone and build

```bash
cd /var/www
git clone https://github.com/zainshah3464/vestior-store.git
cd vestior-store
npm install
NEXT_OUTPUT=standalone npm run build
```

### 4. Create `.env.local`

```bash
cp .env.example .env.local
nano .env.local
# paste all production values
```

### 5. Start with PM2

```bash
pm2 start .next/standalone/server.js --name vestior
pm2 save
pm2 startup  # follow output to enable auto-start
```

### 6. Nginx reverse proxy

```nginx
server {
    listen 80;
    server_name vestior.com www.vestior.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/vestior /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. SSL with Certbot

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d vestior.com -d www.vestior.com
```

Auto-renewal is configured by default.

### 8. Cron for background jobs

Add to crontab:

```bash
crontab -e

# Add:
0 9 * * * curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://vestior.com/api/cron/daily > /dev/null 2>&1
```

---

## Monitoring & Logs

### Vercel

- **Dashboard → Logs** — Real-time function logs
- **Dashboard → Analytics** — Traffic, Web Vitals
- **Dashboard → Deployments → [deploy] → Build Logs** — Past builds

**Filter by:**
- Project
- Environment (Production / Preview)
- Status (Error / Warning)
- Time range

### Supabase

- **Logs → Auth** — Login attempts, signups, failures
- **Logs → Postgres** — Slow queries
- **Logs → Edge Functions** — N/A (we don't use)
- **Database → Query Performance** — Top slow queries

### MongoDB Atlas

- **Metrics** — Operations, connections, network
- **Performance Advisor** — Index suggestions
- **Real-Time Performance Panel** — Live queries

### Upstash

- **Redis → Usage** — Commands, storage
- **QStash → Logs** — Messages, retries, DLQ
- **QStash → Analytics** — Delivery rate, latency

### Stripe

- **Dashboard → Payments** — All transactions
- **Dashboard → Webhooks** — Delivery attempts
- **Dashboard → Logs** — API requests (last 30 days on free tier)

### Alerts setup (recommended)

- **Vercel:** Configure alerts for failed builds
- **Supabase:** Enable email alerts for DB size, failed logins
- **MongoDB:** Enable performance alerts
- **Upstash:** Enable quota alerts (80% usage)
- **Stripe:** Enable fraud alerts

---

## Rollback Procedure

### Vercel instant rollback

1. **Deployments** tab
2. Find last known-good deployment
3. Click **⋯ → Promote to Production**

**Time to recovery:** ~30 seconds.

### Rollback code changes

```bash
git revert <commit-sha>
git push origin main
```

Vercel auto-deploys the revert.

### Rollback database migration

Supabase migrations are **not automatically reversible**. To roll back:

1. Write a new migration that undoes changes
2. Test in staging first
3. Deploy

**Example** — to undo `20261013_add_coupons.sql`:
```sql
DROP TABLE IF EXISTS public.coupon_redemptions CASCADE;
DROP TABLE IF EXISTS public.coupons CASCADE;
ALTER TABLE public.orders DROP COLUMN IF EXISTS coupon_code;
ALTER TABLE public.orders DROP COLUMN IF EXISTS discount_amount;
```

**Never drop tables in production without a backup.**

### Rollback Stripe

- Disable webhook endpoint
- Revert to previous API keys
- Issue refunds for affected transactions

---

## Post-Deploy Verification

### Smoke tests (run in order)

```bash
# 1. Homepage
curl -s https://vestior.com | grep -q "VESTIOR" && echo "✓ Homepage"

# 2. Products
curl -s https://vestior.com/products | grep -q "products" && echo "✓ Products"

# 3. Sitemap
curl -s https://vestior.com/sitemap.xml | grep -q "<urlset" && echo "✓ Sitemap"

# 4. Robots
curl -s https://vestior.com/robots.txt | grep -q "User-Agent" && echo "✓ Robots"

# 5. Auth guard
curl -s -o /dev/null -w "%{http_code}" https://vestior.com/admin
# Should redirect (3xx) → login
```

### Manual tests

- [ ] Sign up → receive verification email
- [ ] Verify email → login works
- [ ] Google OAuth login
- [ ] Browse products, filter, sort
- [ ] Add to cart
- [ ] Checkout with COD
- [ ] Checkout with Stripe test card
- [ ] View orders, order detail, invoice
- [ ] Write a review (pending moderation)
- [ ] Add to wishlist
- [ ] Admin: login, view dashboard
- [ ] Admin: update order status
- [ ] Admin: create coupon
- [ ] Admin: export CSV
- [ ] Admin: view analytics

### Performance verification

Run Lighthouse on production URL:
- Desktop Performance ≥ 90
- Mobile Performance ≥ 80
- Accessibility = 100
- Best Practices = 100
- SEO = 100

### SEO verification

- `https://vestior.com/robots.txt` loads
- `https://vestior.com/sitemap.xml` loads
- [Rich Results Test](https://search.google.com/test/rich-results) on product URL → valid Product + Review + Breadcrumb
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) → correct OG image
- [Twitter Card Validator](https://cards-dev.twitter.com/validator) → correct card

---

## Scaling Checklist

As traffic grows, these are the levers to pull.

### At 10K orders/month

- [ ] Upgrade Vercel to Pro (for commercial use)
- [ ] Upgrade Supabase to Pro (backups + no pause)
- [ ] Review MongoDB performance advisor
- [ ] Check Upstash quotas

### At 100K orders/month

- [ ] Supabase Pro → Team tier
- [ ] MongoDB M0 → M10
- [ ] Add Redis caching layer for product queries
- [ ] Add Sentry error tracking
- [ ] Add Codecov for coverage trending
- [ ] Add real-time admin dashboard (WebSocket)

### At 1M orders/month

- [ ] Migrate from Vercel to AWS ECS / Kubernetes
- [ ] Self-hosted Postgres with read replicas
- [ ] Sharded MongoDB or migrate to ClickHouse
- [ ] CDN caching for product pages
- [ ] Split admin panel from storefront (separate deployment)
- [ ] Background workers on dedicated queue (BullMQ, SQS)

### Code changes required (minimal)

- Add read replica connection strings in `supabase/server.ts`
- Swap `mongodb.ts` connection string to sharded
- Update Redis client if moving from Upstash to self-hosted
- Add Sentry SDK initialization in `layout.tsx` and error handlers

**None of the core business logic changes.**

---

## Further Reading

- [Architecture Deep Dive](./architecture.md)
- [Security Deep Dive](./security.md)
- [Vercel deployment docs](https://vercel.com/docs/deployments/overview)
- [Supabase production guide](https://supabase.com/docs/guides/platform/going-into-prod)
- [Stripe production checklist](https://stripe.com/docs/development/checklist)

---

<p align="center">
  <em>Last updated: 2026-10-12 · Maintained by <a href="https://github.com/zainshah3464">@zainshah3464</a></em>
</p>
```