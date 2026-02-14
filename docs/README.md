# 📚 AffiliateIQ Documentation

Complete documentation for setting up, developing, and managing the AffiliateIQ platform - an AI-powered video script generator with credit-based monetization.

**Last Updated:** February 14, 2026

---

## 📖 Documentation Index

### 🚀 Getting Started

- **[README.md](../README.md)** - Project overview and quick start guide
- **[QUICK_START_STRIPE.md](QUICK_START_STRIPE.md)** - Stripe payment integration guide

### 🛠️ Setup & Configuration

- **[AI_API_SETUP.md](AI_API_SETUP.md)** ⭐ **NEW** - Complete guide to set up Cloudflare AI or OpenAI
  - AI provider selection (Cloudflare vs OpenAI)
  - Environment variable configuration
  - API key setup and security
  - Implementation examples
  - Testing and troubleshooting
  - Cost optimization tips

- **[STRIPE_SETUP.md](STRIPE_SETUP.md)** - Detailed Stripe integration setup
  - Payment processing
  - Webhook configuration
  - Credit purchase flows

### 👨‍💼 Admin & Management

- **[ADMIN_TRACKING.md](ADMIN_TRACKING.md)** ⭐ **NEW** - Admin dashboard and user tracking
  - Database schema for tracking
  - User management
  - Usage analytics
  - Billing & revenue tracking
  - Credit management
  - Reports & exports
  - Monitoring & alerts

### 🏗️ Architecture & Design

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture overview
  - Tech stack
  - Database schema
  - API structure
  - Security model

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment guide for Cloudflare
  - Cloudflare Pages setup
  - Workers configuration
  - D1 database deployment
  - Environment variables
  - Production checklist

### 📋 Development Guides

- **[SYSTEM_GUIDE.md](SYSTEM_GUIDE.md)** - System features and capabilities
  - User management
  - Product discovery
  - AI content generation
  - Credit system

### 📝 Project Management

- **[MVP_TASKS.md](../MVP_TASKS.md)** - Feature task list and roadmap
  - Completed features
  - In progress work
  - TODO items
  - Known issues

### 📊 Updates & Summaries

- **[FEATURE_UPDATE.md](FEATURE_UPDATE.md)** - Recent feature additions
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Implementation notes
- **[SIMPLIFICATION_SUMMARY.md](SIMPLIFICATION_SUMMARY.md)** - Platform simplification details
- **[RESTRUCTURE_SUMMARY.md](RESTRUCTURE_SUMMARY.md)** - Code restructuring notes
- **[PERFORMANCE_OPTIMIZATION_SUMMARY.md](PERFORMANCE_OPTIMIZATION_SUMMARY.md)** - Performance improvements
- **[BUG_FIX_SAAS_SUMMARY.md](BUG_FIX_SAAS_SUMMARY.md)** - Bug fixes log

### 🔐 Testing & Credentials

- **[TEST_CREDENTIALS.md](TEST_CREDENTIALS.md)** - Test accounts and API keys

---

## 🎯 Quick Links by Role

### For Developers

1. Start with [README.md](../README.md) for project setup
2. Read [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system
3. Follow [AI_API_SETUP.md](AI_API_SETUP.md) to configure AI services
4. Check [MVP_TASKS.md](../MVP_TASKS.md) for current priorities

### For Administrators

1. Read [ADMIN_TRACKING.md](ADMIN_TRACKING.md) for admin features
2. Set up monitoring and analytics
3. Configure user management tools
4. Review [STRIPE_SETUP.md](STRIPE_SETUP.md) for payment management

### For DevOps

1. Follow [DEPLOYMENT.md](DEPLOYMENT.md) for deployment
2. Configure [AI_API_SETUP.md](AI_API_SETUP.md) environment variables
3. Set up [STRIPE_SETUP.md](STRIPE_SETUP.md) webhooks
4. Review [ARCHITECTURE.md](ARCHITECTURE.md) for infrastructure

---

## 💰 Pricing Configuration

### Current Credit Tiers (Malaysian Ringgit)

| Package     | Price    | Credits  | Rate per Credit | Bonus |
| ----------- | -------- | -------- | --------------- | ----- |
| **Starter** | RM 5     | 50       | RM 0.10         | -     |
| **Popular** | RM 20    | 250      | RM 0.08         | 20%   |
| **Pro**     | RM 100   | 1,500    | RM 0.067        | 33%   |
| **Custom**  | RM 5-500 | Variable | RM 0.10 base    | -     |

**Free Credits:** New users receive 100 free credits on signup

**Usage:** 1 credit = 1 AI video script generation

---

## 🔧 Environment Variables Reference

### Required for AI

```env
# Option 1: Cloudflare AI (recommended)
AI_PROVIDER=cloudflare
# No API key needed - configure in wrangler.toml

# Option 2: OpenAI
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=1500
```

### Required for Payments

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Required for Auth

```env
JWT_SECRET=your-secret-key
```

See [AI_API_SETUP.md](AI_API_SETUP.md) for detailed configuration instructions.

---

## 🚀 Common Tasks

### Setting Up AI Provider

```bash
# 1. Choose provider (Cloudflare AI recommended)
# 2. Follow AI_API_SETUP.md guide
# 3. Configure environment variables
# 4. Test with sample request
```

### Adding Admin User

```sql
-- Update existing user to admin
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

### Viewing Platform Stats

```bash
# Access admin dashboard at /admin
# Or query directly:
npx wrangler d1 execute affiliate-db --local --command="SELECT COUNT(*) FROM users"
```

### Exporting User Data

```bash
# From admin dashboard, click "Export CSV"
# Or use API: GET /api/admin/export/users
```

---

## 📊 Key Metrics to Monitor

1. **User Growth**
   - New signups per day
   - Active users (7-day window)
   - User retention rate

2. **Revenue**
   - Daily/monthly revenue
   - Average revenue per user
   - Conversion rate (free → paid)

3. **Usage**
   - AI generations per day
   - Credits consumed
   - Average generations per user

4. **Performance**
   - API response times
   - Error rates
   - AI generation success rate

See [ADMIN_TRACKING.md](ADMIN_TRACKING.md) for implementation details.

---

## 🐛 Troubleshooting

### AI Generation Not Working

- ✅ Check [AI_API_SETUP.md](AI_API_SETUP.md) troubleshooting section
- ✅ Verify environment variables are set
- ✅ Check Cloudflare AI binding in wrangler.toml
- ✅ Review API logs for errors

### Payment Issues

- ✅ Verify Stripe keys in [STRIPE_SETUP.md](STRIPE_SETUP.md)
- ✅ Check webhook configuration
- ✅ Review payment logs in Stripe dashboard

### Database Errors

- ✅ Run migrations: `npx wrangler d1 execute affiliate-db --local --file=./database/schema.sql`
- ✅ Check database connection
- ✅ Verify D1 binding in wrangler.toml

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Update relevant documentation
4. Submit pull request
5. Update [MVP_TASKS.md](../MVP_TASKS.md) checklist

---

## 📞 Support

For issues or questions:

1. Check relevant documentation above
2. Review [MVP_TASKS.md](../MVP_TASKS.md) known issues
3. Check [TEST_CREDENTIALS.md](TEST_CREDENTIALS.md) for test accounts
4. Review error logs in Cloudflare dashboard

---

## 📅 Documentation Updates

| Date       | Document          | Update                                      |
| ---------- | ----------------- | ------------------------------------------- |
| 2026-02-14 | AI_API_SETUP.md   | Created comprehensive AI setup guide        |
| 2026-02-14 | ADMIN_TRACKING.md | Created admin tracking and management guide |
| 2026-02-14 | MVP_TASKS.md      | Updated pricing to RM currency              |
| 2026-02-14 | All docs          | Moved to /docs folder                       |

---

**Platform Status:** Active Development  
**Current Version:** MVP  
**Target Launch:** March 15, 2026

For the most up-to-date information, check [MVP_TASKS.md](../MVP_TASKS.md).
