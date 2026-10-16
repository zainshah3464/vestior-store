# Deployment Guide (v3.2)

> **Audience:** Anyone deploying VESTIOR to production — whether Vercel, Docker, or a VPS.
>
> **Goal:** Zero-downtime deployments with full monitoring and rollback capability.
>
> **Version:** This document reflects **v3.2.0** (Editorial redesign + PDF export + cron hardening).

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
- [AI Setup (Groq)](#ai-setup-groq)
- [Cron Jobs](#cron-jobs)
- [Docker Deployment](#docker-deployment)
- [VPS Deployment](#vps-deployment)
- [Monitoring & Logs](#monitoring--logs)
- [Rollback Procedure](#rollback-procedure)
- [Post-Deploy Verification](#post-deploy-verification)
- [Scaling Checklist](#scaling-checklist)
- [What's New in v3.2](#whats-new-in-v32)
- [Further Reading](#further-reading)

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
- [ ] All 13 migrations run in production Supabase (see [Supabase Production Setup](#supabase-production-setup))
- [ ] RLS verified on every table
- [ ] Storage bucket `product-images` created and public
- [ ] Realtime enabled on `orders` table
- [ ] **v3.2:** Realtime enabled on `order_items` table (for real-time item updates)
- [ ] Indexes created (auto-run in migrations)

### Services
- [ ] Supabase project created (production tier, not dev)
- [ ] MongoDB Atlas cluster created
- [ ] Upstash Redis + QStash created
- [ ] Stripe account in live mode (not test)
- [ ] Gmail App Password generated
- [ ] Groq API key generated (for AI chatbot)

### Configuration
- [ ] All env vars documented in `.env.example`
- [ ] Secrets generated with `openssl rand -hex 32` (never reused from dev)
- [ ] `NEXT_PUBLIC_SITE_URL` set to production domain
- [ ] Supabase redirect URLs updated with production domain
- [ ] **v3.2:** Supabase redirect URLs include `/auth/reset-password` (for `token_hash` flow)
- [ ] Stripe webhook endpoint points to production
- [ ] Groq API key added to Vercel env vars

### Security
- [ ] Different `IP_HASH_SALT` than dev (production isolation)
- [ ] Different `CRON_SECRET` than dev
- [ ] Service-role key never committed
- [ ] `.env.local` in `.gitignore`
- [ ] Groq key is server-only (never exposed to client)

### v3.2-specific
- [ ] **No new migrations required** — v3.2 had no schema changes
- [ ] **No new env vars required** — v3.2 reuses all v3.1 vars
- [ ] **Cron throttle behavior verified** — throttle only set on real success
- [ ] **PDF print export tested** — `/admin/exports/print/orders` renders correctly
- [ ] **Editorial UI verified** — all pages use the new design system
- [ ] **Password reset tested** — `token_hash` flow creates a session
- [ ] **Stripe checkout tested** — `order_placed` event fires in MongoDB

---

## Environment Variables Reference

Every variable with: purpose, where to get it, format, dev vs prod difference.

**v3.2 note:** No new environment variables were added in v3.2. All v3.1 variables remain unchanged.

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

**v3.2 note:** Two new Redis keys used: `throttle:cron:abandoned-carts` and `throttle:alert:low-stock`. No config change needed — they're created automatically on first cron run.

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

**v3.2 note:** All 10 email templates redesigned with editorial style. No env var changes.

### AI (Groq)

| Variable | Format | Notes |
|----------|--------|-------|
| `GROQ_API_KEY` | `gsk_...` | Server-only. Powers `/api/chat`. |

**Where to get:** [console.groq.com](https://console.groq.com) → API Keys → Create Key.

**Free tier limits:**
- 1,000 requests/day (any model)
- 8,000 tokens/minute
- 200,000 tokens/day

**Dev vs Prod:** Same key is fine for both — chat requests are rate-limited per-IP, and the free tier cap is global. If you hit the cap, upgrade to paid.

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
| `GROQ_API_KEY` | ✅ | ✅ | ✅ |
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
4. **v3.2:** Verify password reset link works (redirects to `/auth/reset-password` with session)

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

**v3.2 note:** The combined cron now returns structured responses with **throttle info**:

```json
{
  "success": true,
  "timestamp": "2026-10-16T09:00:00.000Z",
  "lowStock": { "sent": true, "count": 4 },
  "abandonedCarts": { "processed": 1, "sent": 1, "failed": 0 }
}
```

If a run is throttled:

```json
{
  "lowStock": { "skipped": true, "reason": "throttled", "minutesSince": 11 }
}
```

### Step 6: Verify deployment

- Open `https://your-domain.com` — homepage loads
- Test signup + login
- **v3.2:** Test password reset flow (session should be created)
- Place a test order (COD + Stripe)
- **v3.2:** Verify `order_placed` event fires in MongoDB for both paths
- Test AI chatbot ("Show me suits under ₹25,000")
- Test PWA install prompt (mobile browser)
- **v3.2:** Test PDF print export (`/admin/exports` → click Print)
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
  - https://vestior.com/auth/reset-password   ← v3.2
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

### PWA considerations

- **HTTPS required.** PWA install prompt only works over HTTPS. Vercel provides this automatically.
- **Domain change = service worker invalidation.** When you switch domains, users' old service workers reference the old origin. They'll auto-update after the new SW is registered.
- **Manifest `start_url` is relative.** No changes needed when the domain changes.

---

## Supabase Production Setup

### 1. Create production project

- Separate from your dev project (different data)
- Same region as your Vercel deployment (minimizes latency)

### 2. Run migrations

Copy each file from `supabase/migrations/` into SQL Editor and run **in this exact order**:

| # | File | Purpose |
|---|------|---------|
| 1 | `20261003_fix_rls_policies.sql` | RLS + `is_admin()` helper |
| 2 | `20261004_add_indexes.sql` | Performance indexes |
| 3 | `20261004_dashboard_stats.sql` | `get_dashboard_stats()` RPC |
| 4 | `20261005_add_payment_fields.sql` | Payment columns on `orders` |
| 5 | `20261011_add_product_reviews.sql` | Reviews table + RPC |
| 6 | `20261012_add_wishlists.sql` | Wishlist table + RLS |
| 7 | `20261013_add_coupons.sql` | Coupons + redemptions + RPCs |
| 8 | `20261014_add_last_login.sql` | Login tracking columns |
| 9 | `20261015_add_super_admin.sql` | `is_super_admin` + role-change RPC |
| 10 | `20261016_normalize_user_roles.sql` | Role whitelist + backup table |
| 11 | `20261017_sales_report_rpc.sql` | Sales analytics RPC |
| 12 | `20261018_product_analytics_rpc.sql` | Product analytics RPC |
| 13 | `20261019_place_order_atomic_v2.sql` | **Enhanced atomic order RPC** |

⚠️ **Migration #13 is critical** — it replaces the original `place_order_atomic` with a v2 that combines stock, coupon, and payment provider in one transaction. If you're upgrading from an earlier deployment, you **must** run this.

**v3.2 note:** No new migrations were required for v3.2. Migration #13 is the last migration.

**Verify after all migrations:**
```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
-- All should show rowsecurity = true

SELECT proname FROM pg_proc
WHERE proname IN ('place_order_atomic', 'admin_change_user_role', 'get_sales_report', 'get_product_sales_stats');
-- All four should be present
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
- **v3.2:** `order_items` (for real-time item updates on customer order detail page)

Or:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;
```

### 5. Configure auth

**Authentication → Providers:**
- Email: ON (with "Confirm email")
- Google: ON (add client ID + secret)

**Authentication → URL Configuration:**
- Site URL: `https://vestior.com`
- Redirect URLs:
  - `https://vestior.com/auth/callback`
  - `https://www.vestior.com/auth/callback`
  - **v3.2:** `https://vestior.com/auth/reset-password` (for `token_hash` flow)

**Authentication → Email Templates:**
- Customize confirmation, recovery, magic link templates with VESTIOR branding (optional)
- **v3.2:** Ensure the reset email link uses `{{ .TokenHash }}` (not legacy `{{ .ConfirmationURL }}`)

### 6. Add admin user

After first signup in production:
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

To create a **super admin** (can change other users' roles):
```sql
UPDATE public.profiles
SET role = 'admin', is_super_admin = true
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
- Verify **only one** `payment-confirmed` email is sent (v3.1 fix)
- **v3.2:** Verify `order_placed` event fires in MongoDB (check `events` collection)
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

// ─────────────────────────────────────────────
// Events: TTL index (auto-delete after 90 days)
// ─────────────────────────────────────────────
db.events.createIndex(
  { timestamp: -1 },
  { expireAfterSeconds: 7776000 }
)
db.events.createIndex({ session_id: 1 })
db.events.createIndex({ user_id: 1, timestamp: -1 })
db.events.createIndex({ event_type: 1, timestamp: -1 })

// ─────────────────────────────────────────────
// Sessions: TTL index (auto-delete after 90 days)
// ─────────────────────────────────────────────
db.sessions.createIndex(
  { session_id: 1 },
  { unique: true, name: 'session_id_unique' }
)
db.sessions.createIndex(
  { user_id: 1, last_seen_at: -1 },
  { sparse: true, name: 'user_recent' }
)
db.sessions.createIndex(
  { ip_hash: 1, last_seen_at: -1 },
  { name: 'ip_recent' }
)
db.sessions.createIndex(
  { visitor_type: 1, last_seen_at: -1 },
  { name: 'type_recent' }
)
db.sessions.createIndex(
  { last_seen_at: 1 },
  { expireAfterSeconds: 7776000, name: 'session_ttl_90d' }
)

// ─────────────────────────────────────────────
// Email logs
// ─────────────────────────────────────────────
db.email_logs.createIndex({ email: 1, created_at: -1 })
db.email_logs.createIndex({ status: 1, created_at: -1 })
db.email_logs.createIndex({ template: 1, created_at: -1 })  // v3.2

// ─────────────────────────────────────────────
// Payments
// ─────────────────────────────────────────────
db.payment_transactions.createIndex(
  { provider_txn_id: 1 },
  { unique: true }
)
db.payment_transactions.createIndex({ order_id: 1 })

// ─────────────────────────────────────────────
// Audit
// ─────────────────────────────────────────────
db.audit_logs.createIndex({ timestamp: -1 })
db.audit_logs.createIndex({ actor_id: 1, timestamp: -1 })
db.audit_logs.createIndex({ target_type: 1, target_id: 1 })
db.audit_logs.createIndex({ action: 1, timestamp: -1 })

// ─────────────────────────────────────────────
// Carts
// ─────────────────────────────────────────────
db.cart_snapshots.createIndex({ user_id: 1 }, { unique: true })
db.cart_snapshots.createIndex({ recovery_token: 1 }, { unique: true })
db.cart_snapshots.createIndex({ updated_at: -1 })
db.cart_snapshots.createIndex(
  { recovered_at: 1, last_reminder_at: 1 },
  { sparse: true }
)
```

**Note:** Application code (`ensureSessionIndexes()` and `ensureCartIndexes()`) creates most of these automatically on cold start. Manual creation via mongosh is only needed if you want to guarantee they exist *before* the first request.

**v3.2 note:** The `template` index on `email_logs` was added in v3.2 (for the redesigned email dashboard filters).

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

### 4. v3.2: Throttle keys

v3.2 introduced two new Redis keys for cron throttling:
- `throttle:cron:abandoned-carts`
- `throttle:alert:low-stock`

These are created automatically on the first successful cron run. No configuration needed.

**Debug commands** (via Upstash console or redis-cli):
```bash
GET throttle:cron:abandoned-carts     # View timestamp
DEL throttle:cron:abandoned-carts     # Force reset
DEL throttle:alert:low-stock          # Force reset
```

**v3.2 pattern:** Throttle is set **only on real success**. Failed runs leave the throttle unset → next cron tick retries automatically.

---

## AI Setup (Groq)

The AI Shopping Assistant is powered by Groq's LPU inference. It requires a `GROQ_API_KEY`.

### 1. Sign up

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up with email or Google
3. Free tier activates immediately — no credit card required

### 2. Create API key

1. **API Keys** → **Create Key**
2. Name it `VESTIOR`
3. Copy the key (starts with `gsk_`)

### 3. Add to env vars

**Local (`.env.local`):**
```
GROQ_API_KEY=gsk_...
```

**Vercel (Settings → Environment Variables):**
- Add `GROQ_API_KEY` to **Production + Preview + Development**

### 4. Verify access

```bash
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer $GROQ_API_KEY"
```

Expected: JSON list of available models. If you see `openai/gpt-oss-120b`, you're good.

### 5. Free tier limits

| Limit | Value |
|-------|-------|
| Requests per day | 1,000 |
| Tokens per minute | 8,000 |
| Tokens per day | 200,000 |

**What this means:** At ~500 tokens per chat, you get ~400 chats/day safely. Rate limiting (20/min/IP) prevents abuse.

**When to upgrade:** If you consistently hit 1,000 req/day, upgrade to Groq's paid tier (~$0.05–0.10 per 1K requests).

### 6. Model availability

Model names vary by region and account tier. Our default is `openai/gpt-oss-120b`.

If you get a 404 "model does not exist" error:

1. Run the `/models` curl above
2. Pick an available model from the list
3. Update `AI_MODELS.QUALITY` in `src/lib/ai/groq.ts`

**As of Oct 2026, DMM-region accounts** have access to `openai/gpt-oss-*` instead of `llama-*`.

### 7. Monitoring AI usage

- **Groq Dashboard** → Usage tab shows request/token counts
- **Our logs** → Vercel Functions → `/api/chat` — search for `[chat] groq stream failed`
- **Rate limit hits** → Vercel logs → search for `429` in `/api/chat`

---

## Cron Jobs

### How Vercel cron works

Vercel cron hits each configured path with an `Authorization: Bearer ${CRON_SECRET}` header — **only if** `CRON_SECRET` is set in your Vercel environment variables.

**Setup:**

1. Generate a secret: `openssl rand -hex 32`
2. Add to Vercel → Environment Variables → `CRON_SECRET`
3. Our routes verify with:
   ```typescript
   if (auth !== `Bearer ${env.CRON_SECRET}`) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
   }
   ```

Vercel cron automatically sends this header once `CRON_SECRET` is set. No extra configuration needed.

### Cron schedule cheatsheet

```
0 9 * * *        Daily at 9:00 AM UTC
0 */6 * * *      Every 6 hours
*/30 * * * *     Every 30 minutes
0 0 * * 0        Weekly on Sunday at midnight
0 * * * *        Hourly
```

### Manual trigger for testing

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://vestior.com/api/cron/daily
```

**Expected response:**
```json
{
  "success": true,
  "timestamp": "2026-10-16T09:00:00.000Z",
  "lowStock": { "sent": true, "count": 3 },
  "abandonedCarts": { "processed": 5, "sent": 5, "failed": 0 }
}
```

**v3.2 throttled response:**
```json
{
  "success": true,
  "timestamp": "2026-10-16T09:11:52.066Z",
  "lowStock": { "skipped": true, "reason": "throttled", "minutesSince": 11 },
  "abandonedCarts": { "skipped": true, "reason": "throttled", "minutesSince": 11 }
}
```

### Testing individual crons

```bash
# Low-stock alert only
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://vestior.com/api/cron/low-stock-alert

# Abandoned carts only
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://vestior.com/api/cron/abandoned-carts

# Keep-alive (pings Supabase + MongoDB)
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://vestior.com/api/cron/keep-alive
```

### v3.2: Force Reset Throttle

If you need to force a cron to run immediately:

```bash
# Via Upstash console or redis-cli
DEL throttle:cron:abandoned-carts
DEL throttle:alert:low-stock
```

Then trigger the cron manually. Or programmatically:

```typescript
import { redis } from '@/lib/redis'
await redis.del('throttle:cron:abandoned-carts')
```

**Security note:** Deleting throttle keys only allows the next cron run to execute immediately. It doesn't bypass auth or expose data.

### v3.2: Throttle-on-Success Pattern

The v3.2 cron pattern:

```typescript
const logId = await queueEmail(...)
if (!logId) {
  // Do NOT set throttle — v3.2 pattern
  return NextResponse.json({ error: '...' }, { status: 500 })
}
await redis.set(THROTTLE_KEY, Date.now())  // ← Only on success
```

**Verify this works:**

1. Temporarily break SMTP (e.g., wrong app password)
2. Trigger cron → should return 500, throttle should NOT be set
3. Fix SMTP
4. Trigger cron again → should succeed, throttle should be set

**Why it matters:** Failed runs auto-retry on next tick. No silent failures.

### External cron fallback (Hobby plan)

If Vercel Hobby's single-cron limit is too restrictive:

1. Sign up at [cron-job.org](https://cron-job.org) (free)
2. Create jobs:
   - URL: `https://vestior.com/api/cron/low-stock-alert`
   - Schedule: `0 */6 * * *`
   - Header: `Authorization: Bearer <CRON_SECRET>`
3. Repeat for other cron endpoints

### GitHub Actions for DB keep-alive

Free-tier databases pause after inactivity:
- Supabase Free: pauses after 7 days
- MongoDB M0: pauses after 60 days

The repo includes `.github/workflows/keep-alive.yml` which pings `/api/cron/keep-alive` twice daily. Set these GitHub secrets:

- `SITE_URL` = `https://vestior.com`
- `CRON_SECRET` = (same as Vercel)

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

**v3.2 note:** PDF print export uses browser-native rendering, so no Chromium dependency is needed in the Docker image. The `Dockerfile.vercel` is unchanged.

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

**PWA note:** Service workers require HTTPS. Certbot enables this automatically.

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

**AI-specific logs:** Search for `[chat]` in function logs to see AI chatbot activity.

**v3.2 logs to watch:**
- `[cron] throttled` — cron throttle skip
- `[print] unauthorized redirect` — non-admin trying to access print routes
- `[email] marked failed` — QStash publish failure

### Supabase

- **Logs → Auth** — Login attempts, signups, failures
- **Logs → Postgres** — Slow queries
- **Logs → Edge Functions** — N/A (we don't use)
- **Database → Query Performance** — Top slow queries

### MongoDB Atlas

- **Metrics** — Operations, connections, network
- **Performance Advisor** — Index suggestions
- **Real-Time Performance Panel** — Live queries
- **Collection Stats** — Document counts per collection (events, sessions, etc.)

### Upstash

- **Redis → Usage** — Commands, storage
- **QStash → Logs** — Messages, retries, DLQ
- **QStash → Analytics** — Delivery rate, latency

### Groq

- **Dashboard → Usage** — Requests/day, tokens/minute
- **Dashboard → API Keys** — Key status, last used

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
- **Groq:** Monitor dashboard daily for the first week (free tier caps quietly)

### v3.2 specific monitoring

**Cron health:**
- Watch for repeated `500` responses from `/api/cron/daily`
- If a cron is failing repeatedly, throttle is NOT set (v3.2 pattern) — it will retry every tick
- Check Vercel logs for `[cron] queue failed` messages

**Print route health:**
- Watch for `[print] unauthorized` — indicates an authorization issue
- Check rate limit hits on `/admin` tier (60/min)

**Editorial UI health:**
- Check Lighthouse scores periodically (target: 97/91)
- Watch for CLS regressions (target: 0)

**Email delivery:**
- Watch for `status: 'failed'` in `email_logs`
- If failures spike, check Gmail app password validity
- v3.2 templates are redesigned — verify no rendering errors in `[email] render failed` logs

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

**Special case: `place_order_atomic_v2` rollback**

If v2 causes problems, you can restore v1 by re-running the original RPC definition. But note: **v1 has known consistency bugs** (coupon + provider in separate transactions). Roll back only to buy time, not as a permanent solution.

**Special case: role normalization**

The `20261016_normalize_user_roles.sql` migration is reversible via:

```sql
UPDATE public.profiles p
SET role = b.old_role
FROM public._role_normalization_backup b
WHERE p.id = b.id;
```

This is why the backup table exists.

### Rollback Stripe

- Disable webhook endpoint
- Revert to previous API keys
- Issue refunds for affected transactions

### Rollback AI chatbot

If Groq is causing issues:
1. Remove `GROQ_API_KEY` from Vercel env vars
2. Redeploy
3. `/api/chat` will return 503 ("AI chatbot is not configured")
4. Rest of the site works normally

### v3.2: Rollback editorial redesign

**Short answer:** You can't easily. The redesign replaced 120 files in place.

**Options:**

1. **Revert commits** — `git revert <commit-hash>` for the redesign commit. May cause merge conflicts.
2. **Fork from v3.1** — Check out the v3.1 tag. You'll lose v3.2 bug fixes.
3. **Cherry-pick v3.2 fixes** — Revert the UI commit, then cherry-pick the cron/auth/checkout fixes.

**Recommendation:** Don't roll back. The v3.2 redesign was tested, Lighthouse-audited (97/91), and 100+ admin actions verified. Bugs (if any) should be fixed forward.

### v3.2: Rollback PDF print export

If print routes cause issues:

**Option A — Disable the feature:**
1. Remove the Print buttons from `/admin/exports` (or comment them out)
2. Redeploy
3. The `/admin/exports/print/*` routes still exist but are unreachable

**Option B — Block the routes:**
Add a redirect in `next.config.ts`:

```typescript
async redirects() {
  return [
    {
      path: '/admin/exports/print/:type',
      destination: '/admin/exports',
      permanent: false,
    },
  ]
}
```

**Data safety note:** Print routes are read-only. They can't corrupt data. Rolling back is purely a UX concern.

### v3.2: Rollback cron throttle-on-success

If you need to revert to the v3.1 throttle behavior (set before work):

**⚠️ Warning:** This reintroduces the silent failure bug. Only use as a temporary measure.

Edit the cron endpoints:

```typescript
// Old (v3.1 — broken)
await redis.set(THROTTLE_KEY, Date.now())
const logId = await queueEmail(...)

// Revert to (still broken):
await redis.set(THROTTLE_KEY, Date.now())  // ← BEFORE work
const logId = await queueEmail(...)
```

**Recommendation:** Don't roll back. The v3.2 pattern is correct. If crons are failing, fix the underlying issue (SMTP, QStash).

### v3.2: Rollback token_hash auth flow

If `token_hash` flow causes issues:

1. Update `/auth/callback` to use `exchangeCodeForSession` instead of `verifyOtp`
2. Update Supabase email templates to use `{{ .ConfirmationURL }}` instead of `{{ .TokenHash }}`

**⚠️ Warning:** This reintroduces the session-loss bug. Only use as a temporary measure.

**Recommendation:** Don't roll back. The `token_hash` flow is more reliable. If issues arise, verify Supabase URL config includes `/auth/reset-password`.

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

# 6. PWA manifest
curl -s https://vestior.com/manifest.json | grep -q "VESTIOR" && echo "✓ Manifest"

# 7. Service worker
curl -s https://vestior.com/sw.js | grep -q "CACHE_VERSION" && echo "✓ Service Worker"

# 8. Offline page
curl -s https://vestior.com/offline.html | grep -q "offline" && echo "✓ Offline Page"

# 9. Cron (with secret)
curl -s -H "Authorization: Bearer $CRON_SECRET" https://vestior.com/api/cron/keep-alive | grep -q '"ok":true' && echo "✓ Cron Auth"

# 10. v3.2: Print route guard (should redirect for non-admin)
curl -s -o /dev/null -w "%{http_code}" https://vestior.com/admin/exports/print/orders
# Should redirect (3xx) → login
```

### Manual tests

**Auth:**
- [ ] Sign up → receive verification email
- [ ] Verify email → login works
- [ ] Google OAuth login
- [ ] **v3.2:** Forgot password → receive reset email → click link → **session created** → reset form loads
- [ ] Password strength meter shows correct level
- [ ] Existing email detection shows friendly error

**Storefront:**
- [ ] Browse products, filter, sort
- [ ] Add to cart
- [ ] Wishlist toggle + navbar badge
- [ ] Product search (navbar)
- [ ] Product detail page with reviews
- [ ] **v3.2:** Homepage uses new editorial design (parallax orbs, brand mark, bento category grid)
- [ ] **v3.2:** Cart empty state shows rotating messages
- [ ] **v3.2:** Cart page has sharp scroll boundaries (no edge fades)

**Checkout:**
- [ ] Checkout with COD
- [ ] Checkout with Stripe test card
- [ ] Coupon apply at checkout
- [ ] Order confirmation email received (only once for Stripe)
- [ ] **v3.2:** `order_placed` event fires in MongoDB for both COD and Stripe
- [ ] **v3.2:** Checkout stepper shows animated checkmarks + pulse rings

**Customer area:**
- [ ] View orders, order detail
- [ ] Order status real-time update
- [ ] Invoice download (Print → Save as PDF)
- [ ] Write a review (pending moderation)
- [ ] Profile update

**AI Chatbot:**
- [ ] Chat widget appears (bottom-right, hidden on /admin)
- [ ] Suggested prompts work
- [ ] "Show me suits under ₹25,000" → returns products
- [ ] "What categories do you have?" → lists categories
- [ ] "Where is my order?" (not logged in) → asks to sign in
- [ ] Rate limit: send 21 messages fast → 429 error
- [ ] Clear conversation works

**PWA:**
- [ ] Install prompt appears on Chrome desktop (after 20s)
- [ ] Manifest loads without errors (DevTools → Application → Manifest)
- [ ] Service worker registers (DevTools → Application → Service Workers)
- [ ] Offline mode: DevTools → Network → Offline → page still loads from cache

**Admin:**
- [ ] Login as admin → dashboard loads
- [ ] Action Center shows pending items
- [ ] Live Users widget auto-refreshes
- [ ] Update order status
- [ ] Create coupon
- [ ] Export CSV (orders, payments, emails, users, audit)
- [ ] Analytics dashboard loads
- [ ] Product Analytics table sorts by column
- [ ] Visitors page shows sessions
- [ ] Session drill-down loads
- [ ] Audit log shows recent actions
- [ ] **v3.2:** All admin pages use editorial design (bento cards, glass morphism, grouped sidebar)
- [ ] **v3.2:** Admin notifications use editorial toast (left accent bar, View action)

**v3.2 PDF Print Export:**
- [ ] Go to `/admin/exports`
- [ ] Set filters (From / To / Status / Provider)
- [ ] Click **Print** on Orders card
- [ ] New tab opens with print-optimized view
- [ ] Verify white background (not dark theme)
- [ ] Verify A4 landscape orientation
- [ ] Verify column headers repeat on page 2+ (with 100+ rows)
- [ ] Verify no rows split across pages
- [ ] Verify currency symbols render correctly (₹)
- [ ] Click **Print / Save as PDF**
- [ ] Save PDF → verify it looks correct
- [ ] Repeat for Payments, Emails, Users, Audit

**v3.2 Cron:**
- [ ] Trigger `/api/cron/daily` with curl
- [ ] Verify response includes `timestamp` + `lowStock` + `abandonedCarts`
- [ ] Wait 11 minutes, trigger again
- [ ] Verify response shows `skipped: true, reason: 'throttled', minutesSince: 11`
- [ ] Force reset throttle (DEL keys in Redis)
- [ ] Trigger again → verify it runs

**v3.2 Email Templates:**
- [ ] Sign up → check welcome email (blue accent, editorial style)
- [ ] Place order → check order-placed email (blue accent)
- [ ] Complete payment → check payment-confirmed email (emerald accent)
- [ ] Update order status to shipped → check order-shipped email (violet accent)
- [ ] Update order status to delivered → check order-delivered email (emerald accent)
- [ ] Abandon cart → check abandoned-cart email (violet accent with recovery coupon)

### Performance verification

Run Lighthouse on production URL:
- Desktop Performance ≥ 90
- Mobile Performance ≥ 80
- Accessibility = 100
- Best Practices = 100
- SEO = 100

**PWA-specific checks:**
- Manifest has `name`, `short_name`, `icons`, `start_url`, `display`
- All icon files exist (192x192, 512x512, maskable variants)
- Service worker registers without console errors

**v3.2 additions:**
- Print routes should load in <1s (Server Component, no client hydration)
- Editorial UI should have zero CLS (target: 0)
- Bento cards should render without layout shifts

### SEO verification

- `https://vestior.com/robots.txt` loads
- `https://vestior.com/sitemap.xml` loads
- [Rich Results Test](https://search.google.com/test/rich-results) on product URL → valid Product + Review + Breadcrumb
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) → correct OG image
- [Twitter Card Validator](https://cards-dev.twitter.com/validator) → correct card
- [PageSpeed Insights](https://pagespeed.web.dev) → PWA installable badge

---

## Scaling Checklist

As traffic grows, these are the levers to pull.

### At 10K orders/month

- [ ] Upgrade Vercel to Pro (for commercial use + multiple crons)
- [ ] Upgrade Supabase to Pro (backups + no pause)
- [ ] Review MongoDB performance advisor
- [ ] Check Upstash quotas
- [ ] Monitor Groq daily request count

### At 100K orders/month

- [ ] Supabase Pro → Team tier
- [ ] MongoDB M0 → M10
- [ ] Add Redis caching layer for product queries
- [ ] Add Sentry error tracking
- [ ] Add Codecov for coverage trending
- [ ] Add real-time admin dashboard (WebSocket)
- [ ] Migrate Groq to paid tier if hitting free limits
- [ ] Consider adding Resend for transactional email

### At 1M orders/month

- [ ] Migrate from Vercel to AWS ECS / Kubernetes
- [ ] Self-hosted Postgres with read replicas
- [ ] Sharded MongoDB or migrate to ClickHouse
- [ ] CDN caching for product pages
- [ ] Split admin panel from storefront (separate deployment)
- [ ] Background workers on dedicated queue (BullMQ, SQS)
- [ ] Self-hosted AI inference (vLLM, Ollama)
- [ ] Server-side PDF generation (Puppeteer-as-a-service) if emailing PDFs is needed

### Code changes required (minimal)

- Add read replica connection strings in `supabase/server.ts`
- Swap `mongodb.ts` connection string to sharded
- Update Redis client if moving from Upstash to self-hosted
- Add Sentry SDK initialization in `layout.tsx` and error handlers
- Swap `getGroq()` in `src/lib/ai/groq.ts` for a self-hosted endpoint
- Add `server-side PDF generation` if emailing PDFs (see Developer FAQ)

**None of the core business logic changes.**

---

## What's New in v3.2

This section documents v3.2-specific deployment changes.

### No New Migrations

v3.2 was a **UI/UX + reliability release**, not a schema release. No new tables, columns, or indexes.

### No New Env Vars

v3.2 reuses all v3.1 environment variables. No configuration changes needed.

### Database Changes

| Change | Required Action |
|--------|-----------------|
| No new tables | None |
| No new columns | None |
| No new RPCs | None |
| No new indexes | None |
| **Realtime: `order_items`** | Run: `ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;` |

### Redis Changes

| Key | Purpose | Created By |
|-----|---------|-----------|
| `throttle:cron:abandoned-carts` | Cron throttle timestamp | Auto on first successful run |
| `throttle:alert:low-stock` | Cron throttle timestamp | Auto on first successful run |

### Cron Behavior Changes

**v3.2 pattern:** Throttle is set **only on real success**. Failed runs leave the throttle unset → next cron tick retries automatically.

**Impact on deployment:** None. The pattern is code-only. But verify after deploy:

```bash
# Trigger cron, should succeed and set throttle
curl -H "Authorization: Bearer $CRON_SECRET" https://vestior.com/api/cron/daily

# Trigger again, should be throttled
curl -H "Authorization: Bearer $CRON_SECRET" https://vestior.com/api/cron/daily
# → { "skipped": true, "reason": "throttled", "minutesSince": N }
```

### Auth Flow Changes

**v3.2 pattern:** Password reset uses `token_hash` flow (was `code`).

**Impact on deployment:**

1. Add `/auth/reset-password` to Supabase redirect URLs:
   ```
   Authentication → URL Configuration → Redirect URLs:
   - https://vestior.com/auth/reset-password
   ```

2. Verify Supabase email templates use `{{ .TokenHash }}`:
   ```
   Authentication → Email Templates → Reset Password:
   - Use {{ .TokenHash }} instead of legacy {{ .ConfirmationURL }}
   - Or ensure ConfirmationURL points to /auth/callback
   ```

3. Test password reset end-to-end:
   - Forgot password → email → click link → **session created** → reset form loads

### Editorial UI Changes

**v3.2 pattern:** All pages redesigned with editorial design system.

**Impact on deployment:**

- No config changes
- No database changes
- Verify visually: all admin pages use bento cards, glass morphism, grouped sidebar
- Verify performance: Lighthouse Desktop 97, Mobile 91 (unchanged)

### PDF Print Export

**New routes:** `/admin/exports/print/[type]`

**Impact on deployment:**

- No config changes
- No new dependencies
- Verify after deploy: `/admin/exports` → click Print on any card

### Email Template Changes

**v3.2 pattern:** All 10 templates redesigned with editorial style.

**Impact on deployment:**

- No config changes
- No DB changes
- Verify after deploy: trigger each email, check styling

### Checkout Fix

**v3.2 fix:** `order_placed` event now fires on both COD and Stripe success paths.

**Impact on deployment:**

- No config changes
- Verify after deploy: place COD order → check MongoDB `events`; place Stripe order → check MongoDB `events`

### Rollback Procedures

**v3.2-specific rollbacks:**

| Feature | Rollback Method |
|---------|-----------------|
| Editorial redesign | `git revert` (may conflict); or don't roll back |
| PDF print export | Comment out Print buttons; or add redirect in `next.config.ts` |
| Cron throttle-on-success | Revert code (⚠️ reintroduces bug) |
| Token_hash auth flow | Revert to `exchangeCodeForSession` (⚠️ reintroduces bug) |

**See [Rollback Procedure](#rollback-procedure) for details.**

### Verification Checklist (v3.2-specific)

After deploying v3.2:

- [ ] Password reset works (session created)
- [ ] PDF print export works (all 5 types)
- [ ] Cron throttle only sets on success
- [ ] `order_placed` event fires on both COD + Stripe
- [ ] All 10 email templates render with new design
- [ ] Editorial UI visible on all admin pages
- [ ] Admin notifications use editorial toast
- [ ] Cart empty state shows rotating messages
- [ ] Homepage has parallax orbs + bento categories
- [ ] No layout shifts (CLS = 0)

---

## Further Reading

- [Architecture Deep Dive](./architecture.md) — Includes PDF Print Export Pipeline + Editorial Design System
- [Security Deep Dive](./security.md) — Includes Print Route Security + Cron Job Security
- [API Reference](./api-reference.md) — Includes Print Routes section
- [Database Design](./database.md) — Includes Redis Keys section
- [Developer FAQ](./faq-developer.md) — Includes Print Export & Editorial UI section
- [Vercel deployment docs](https://vercel.com/docs/deployments/overview)
- [Supabase production guide](https://supabase.com/docs/guides/platform/going-into-prod)
- [Stripe production checklist](https://stripe.com/docs/development/checklist)
- [Groq API docs](https://console.groq.com/docs)
- [PWA deployment best practices](https://web.dev/pwa-checklist/)

---

<p align="center">
  <em>Last updated: 2026-10-16 · Maintained by <a href="https://github.com/zainshah3464">@zainshah3464</a></em>
</p>

---