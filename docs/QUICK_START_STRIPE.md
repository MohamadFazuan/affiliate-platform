# 🎉 Stripe Billing Integration - Quick Start Guide

## ✅ What's Been Implemented

Complete Stripe billing system with:

- **Pricing page** with 3 tiers (Free/Pro/Enterprise)
- **Checkout flow** with 14-day free trial
- **Billing management** page with subscription details
- **Invoice history** with PDF downloads
- **Stripe Customer Portal** for self-service
- **Webhook handling** for subscription events
- **Database integration** with Stripe customer/subscription IDs

---

## 🚀 Quick Setup (5 minutes)

### 1. Install Stripe (Already Done ✅)

```bash
npm install stripe @stripe/stripe-js
```

### 2. Create Stripe Account

1. Go to https://stripe.com/
2. Sign up (free test mode available instantly)
3. Complete your account setup

### 3. Get Your API Keys

From https://dashboard.stripe.com/test/apikeys

```bash
# Copy these to .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...
```

### 4. Create Products in Stripe

**Pro Plan:**

1. Go to Products → Add Product
2. Name: "AffiliateIQ Pro"
3. Price: $29 recurring/month
4. Save and copy the **Price ID** (starts with `price_`)

**Enterprise Plan:**

1. Add another product
2. Name: "AffiliateIQ Enterprise"
3. Price: $99 recurring/month
4. Save and copy the **Price ID**

### 5. Set Up Webhook

1. Go to Developers → Webhooks → Add endpoint
2. URL: `http://localhost:8787/api/stripe/webhook` (for local testing)
3. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the **Webhook Secret** (starts with `whsec_`)

### 6. Update Environment Variables

Create/update `.env.local`:

```bash
# Frontend (Next.js)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID=price_yyy

# Backend (Cloudflare Worker via wrangler.toml)
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...
APP_URL=http://localhost:3000
```

### 7. Update Database Schema

```bash
# Run the migration
npm run db:migrate

# Or manually:
wrangler d1 execute affiliate-db --local --file=database/migrate_stripe.sql
```

### 8. Test It!

```bash
# Start both services
npm run dev          # Terminal 1
npm run worker:dev   # Terminal 2
```

**Test flow:**

1. Navigate to http://localhost:3000/pricing
2. Click "Upgrade Now" on Pro plan
3. Use test card: `4242 4242 4242 4242`
4. Any future expiry date, any CVC
5. Complete checkout
6. You'll be redirected to success page
7. Check /billing to see your subscription

---

## 💳 Stripe Test Cards

```
✅ Success:          4242 4242 4242 4242
❌ Declined:         4000 0000 0000 0002
🔐 3D Secure:        4000 0025 0000 3155
💰 Insufficient:     4000 0000 0000 9995
```

Use any:

- Future expiry date (e.g., 12/34)
- 3-digit CVC
- Any postal code

---

## 📖 Testing Webhooks Locally

Use Stripe CLI to forward webhooks to localhost:

```bash
# Install Stripe CLI
# Windows: scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe
# Or download from: https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to your local worker
stripe listen --forward-to localhost:8787/api/stripe/webhook

# In another terminal, trigger test events:
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
```

---

## 🔧 Production Deployment

### Cloudflare Workers Setup

```bash
# Add secrets (don't commit these!)
wrangler secret put STRIPE_SECRET_KEY
# Enter: sk_live_...

wrangler secret put STRIPE_WEBHOOK_SECRET
# Enter: whsec_...
```

Update `wrangler.toml`:

```toml
[vars]
APP_URL = "https://your-app.pages.dev"
```

### Stripe Production Setup

1. Switch to Live Mode in Stripe Dashboard
2. Create live versions of your products
3. Copy live API keys (start with `sk_live_` and `pk_live_`)
4. Create production webhook pointing to your deployed worker
5. Update environment variables with live keys

---

## 📄 Key Files

| File                                           | Purpose                |
| ---------------------------------------------- | ---------------------- |
| `backend/services/stripe.ts`                   | Stripe API integration |
| `backend/worker.ts`                            | Billing API endpoints  |
| `src/app/(dashboard)/pricing/page.tsx`         | Pricing page           |
| `src/app/(dashboard)/billing/page.tsx`         | Billing management     |
| `src/app/(dashboard)/billing/success/page.tsx` | Checkout success       |
| `database/migrate_stripe.sql`                  | Schema migration       |
| `.env.example`                                 | Environment template   |

---

## 🎯 Feature Checklist

- [x] Pricing page with 3 tiers
- [x] Stripe Checkout integration
- [x] 14-day free trial
- [x] Subscription status tracking
- [x] Billing history with invoices
- [x] PDF invoice downloads
- [x] Customer portal (payment method update)
- [x] Cancel subscription
- [x] Webhook event processing
- [x] Database schema updates
- [x] Navigation links

---

## 💡 Common Issues

**"STRIPE_SECRET_KEY not configured"**

- Add the secret key to wrangler.toml or use `wrangler secret put`

**"Webhook signature verification failed"**

- Make sure you're using the correct webhook secret
- For local testing, use Stripe CLI with `stripe listen`

**"Cannot find module 'stripe'"**

- Run `npm install` again
- Check that stripe is in package.json dependencies

**Checkout redirects but no subscription created**

- Check webhook is properly configured
- Verify webhook secret is correct
- Look at webhook logs in Stripe Dashboard

---

## 📞 Support Resources

- **Stripe Docs:** https://stripe.com/docs
- **Test Mode:** Always use test keys (pk*test*/sk*test*) during development
- **API Reference:** https://stripe.com/docs/api
- **Webhook Events:** https://stripe.com/docs/webhooks

---

## ✨ What Users See

### Pricing Page (`/pricing`)

- Professional 3-column layout
- Clear feature comparison
- "Most Popular" badge on Pro
- Instant checkout with one click
- FAQ section

### Billing Page (`/billing`)

- Current subscription status
- Billing period and trial info
- "Manage in Stripe" button
- Invoice history with downloads
- Cancel subscription option

### Success Page (`/billing/success`)

- Congratulations message
- Feature recap
- Auto-redirect to dashboard
- Quick links to billing/settings

---

**Need help?** Check [STRIPE_SETUP.md](STRIPE_SETUP.md) for detailed documentation.

**Ready to test!** 🚀
