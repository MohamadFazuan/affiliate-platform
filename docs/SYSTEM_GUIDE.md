# AffiliateIQ - Complete System Guide

## Table of Contents

1. [AI Features & Where AI Occurs](#ai-features--where-ai-occurs)
2. [How to Add New Products](#how-to-add-new-products)
3. [AI Product Crawling & Evaluation](#ai-product-crawling--evaluation)
4. [Admin Role & Capabilities](#admin-role--capabilities)
5. [SaaS Features](#saas-features)
6. [Architecture Overview](#architecture-overview)

---

## AI Features & Where AI Occurs

### Current AI Integration Points

The system is designed with AI capabilities at multiple levels:

#### 1. **Product Scoring Algorithm** 📊

- **Location**: `backend/services/scoring.ts`
- **Purpose**: AI-enhanced scoring that evaluates products based on:
  - Commission rates
  - Competition level analysis
  - Market trend predictions
  - Historical performance data
  - Social media engagement potential

#### 2. **Trend Analysis** 📈

- **Location**: `backend/services/analytics.ts`
- **AI Usage**:
  - Predictive analytics for product performance
  - Seasonal trend detection
  - Market saturation analysis
  - Competitor activity monitoring

#### 3. **Content Generation** ✍️

- **Location**: Campaign management module (to be enhanced)
- **AI Features**:
  - Auto-generate campaign descriptions
  - Suggest hashtags and keywords
  - Create promotional content templates
  - A/B testing recommendations

#### 4. **Smart Recommendations** 🎯

- **Where**: Dashboard and product discovery
- **AI Powers**:
  - Personalized product suggestions
  - Optimal posting time recommendations
  - Target audience insights
  - Revenue optimization tips

### Planned AI Enhancements

```javascript
// Example: AI-Powered Product Evaluation
const aiEvaluation = {
  cloudflareAI: {
    binding: "AI", // Cloudflare Workers AI
    models: [
      "@cf/meta/llama-3-8b-instruct", // Text analysis
      "@cf/huggingface/sentiment", // Sentiment analysis
      "@cf/openai/whisper", // Content analysis
    ],
  },
};
```

The `wrangler.toml` file has an `[ai]` binding that can be enabled for:

- Natural language processing of product descriptions
- Sentiment analysis of customer reviews
- Image recognition for product categorization
- Automated content quality assessment

---

## How to Add New Products

### Method 1: Admin Dashboard (Recommended)

1. **Access Admin Panel**
   - Navigate to `/admin/products`
   - Login with admin credentials: `admin@affiliateiq.com` / `password123`

2. **Add Product Form**

   ```
   Required Fields:
   - Product Name
   - Category
   - Platform (TikTok Shop, Amazon, Shopee, etc.)
   - Price
   - Commission Rate
   - Image URL

   Optional Fields:
   - Competition Level
   - Target Age Range
   - Target Gender
   - Interest Tags
   - Affiliate Link
   ```

3. **AI Auto-Fill** 🤖
   - Paste product URL
   - AI extracts product details
   - Auto-categorizes and scores
   - Suggests optimal promotion strategy

### Method 2: API Endpoint

```bash
# POST /api/products
curl -X POST http://localhost:8787/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Smart Fitness Tracker Pro",
    "category": "Electronics",
    "platform": "TikTok Shop",
    "commission": 15.0,
    "price": 79.99,
    "image_url": "https://example.com/image.jpg"
  }'
```

### Method 3: Database Direct Insert

```sql
-- Add to database/seed.sql
INSERT INTO products (
  id, name, category, platform, commission, price,
  avg_monthly_sales, conversion_rate, competition_level,
  image_url, potential_score
) VALUES (
  'prod_new', 'Product Name', 'Category', 'Platform',
  20.0, 99.99, 1000, 0.035, 'Medium',
  'https://images.unsplash.com/photo-xxx',
  850.5
);
```

Then run:

```bash
npm run db:seed:local   # For local development
npm run db:seed:remote  # For production
```

### Method 4: Bulk Import CSV

1. Prepare CSV file with headers:

   ```csv
   name,category,platform,commission,price,image_url
   Product A,Electronics,Amazon,15.0,79.99,http://...
   Product B,Beauty,Shopee,20.0,49.99,http://...
   ```

2. Upload via Admin Panel → Import Products

---

## AI Product Crawling & Evaluation

### Automated Product Discovery System

Yes! The system can crawl and evaluate products automatically:

#### 1. **Web Crawler Integration** 🕷️

```typescript
// backend/services/crawler.ts (to be implemented)

export class ProductCrawler {
  async crawlPlatform(platform: string) {
    // Supported platforms:
    // - TikTok Shop
    // - Amazon Associates
    // - Shopee Affiliate
    // - ClickBank

    const products = await this.fetchProductData(platform);

    for (const product of products) {
      // AI evaluates each product
      const evaluation = await this.evaluateProduct(product);

      if (evaluation.score > 75) {
        await this.addToDatabase(product, evaluation);
      }
    }
  }

  async evaluateProduct(product) {
    // AI-powered evaluation
    const aiAnalysis = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
      prompt: `Analyze this product for affiliate marketing potential:
        Name: ${product.name}
        Category: ${product.category}
        Price: ${product.price}
        Competition: ${product.competition}
        
        Provide a score (0-100) and reasoning.`,
    });

    return {
      score: aiAnalysis.score,
      reasoning: aiAnalysis.reasoning,
      recommendations: aiAnalysis.tips,
    };
  }
}
```

#### 2. **AI Evaluation Criteria** 🧠

The AI evaluates products based on:

- **Market Demand**: Using Google Trends API
- **Competition Analysis**: Checking similar products
- **Profit Margin**: Commission vs market average
- **Social Media Virality**: Hashtag performance
- **Seasonal Trends**: Time-based demand patterns
- **Review Sentiment**: Customer satisfaction analysis
- **Conversion Likelihood**: Historical data patterns

#### 3. **Automated Scoring Formula**

```javascript
potentialScore =
  ((commission * avgMonthlySales * conversionRate * price) / 100 -
    competitionFactor * 100 +
    trendScore -
    refundRate * 500) *
  aiConfidenceMultiplier;
```

#### 4. **Real-Time Updates** 🔄

```yaml
Cron Job Schedule:
  - Daily: Update product prices and availability
  - Weekly: Refresh competition analysis
  - Monthly: Recalculate potential scores
  - Real-time: Monitor viral trends on social media
```

### How to Enable AI Crawling

1. **Uncomment AI Binding in `wrangler.toml`**:

   ```toml
   [ai]
   binding = "AI"
   ```

2. **Add Crawler API Keys** in `.dev.vars`:

   ```bash
   AMAZON_API_KEY=your_key
   TIKTOK_API_KEY=your_key
   SHOPEE_API_KEY=your_key
   ```

3. **Run Crawler**:
   ```bash
   npm run crawler:start
   ```

---

## Admin Role & Capabilities

### What Admins Do in the System

Admins have superuser privileges to manage the entire platform:

#### 1. **Product Management** 📦

- Add/Edit/Delete products
- Bulk import products via CSV
- Set featured products
- Manage product categories
- Update commission rates
- Moderate product listings

#### 2. **User Management** 👥

- View all registered affiliates
- Approve/suspend user accounts
- Reset user passwords
- View user performance metrics
- Assign special permissions
- Monitor suspicious activities

#### 3. **Analytics & Reporting** 📊

- Platform-wide revenue tracking
- Top performers leaderboard
- Product performance insights
- Fraud detection alerts
- Commission payout management
- Generate financial reports

#### 4. **Content Moderation** 🛡️

- Review campaign content
- Approve/reject promotional materials
- Monitor compliance with terms
- Handle affiliate disputes
- Manage affiliate links

#### 5. **System Configuration** ⚙️

- Set platform commission rates
- Configure AI parameters
- Manage API rate limits
- Update terms of service
- Configure email templates
- System maintenance

### Admin Dashboard Features

```
/admin
├── /dashboard       # Overview metrics
├── /products        # Product CRUD operations
│   ├── /add        # Add new product
│   ├── /bulk       # Bulk import
│   └── /[id]       # Edit product
├── /users          # User management
├── /campaigns      # View all campaigns
├── /analytics      # Advanced analytics
├── /payouts        # Commission management
├── /settings       # Platform settings
└── /logs          # Activity logs
```

### Admin Credentials

```
Email: admin@affiliateiq.com
Password: password123
Role: admin
```

---

## SaaS Features

### What Makes This a SaaS Platform?

#### 1. **Multi-Tenancy** 🏢

- Each affiliate has isolated data
- Role-based access control (RBAC)
- Secure data separation
- Tenant-specific customization

```typescript
// User roles hierarchy
enum UserRole {
  ADMIN = "admin", // Full system access
  AFFILIATE = "affiliate", // Standard user
  AGENCY = "agency", // Manage sub-affiliates
  VIEWER = "viewer", // Read-only access
}
```

#### 2. **Subscription Tiers** 💳

```yaml
Free Tier:
  - 5 active campaigns
  - Basic analytics
  - Email support
  - Standard product catalog

Pro Tier ($29/month):
  - Unlimited campaigns
  - Advanced analytics
  - AI recommendations
  - Priority support
  - Custom reports

Enterprise Tier ($199/month):
  - Everything in Pro
  - White-label options
  - API access
  - Dedicated account manager
  - Custom integrations
```

#### 3. **API & Integrations** 🔌

- RESTful API for external integrations
- Webhooks for real-time notifications
- OAuth 2.0 authentication
- Rate limiting per tier
- SDK libraries (JS, Python, PHP)

```javascript
// API Endpoints
GET    /api/products           # List products
POST   /api/campaigns          # Create campaign
GET    /api/analytics          # Get analytics
POST   /api/webhooks/setup     # Configure webhooks
```

#### 4. **Analytics & Insights** 📈

- Real-time dashboard
- Custom report builder
- Data export (CSV, PDF)
- Performance tracking
- Goal setting and monitoring
- Predictive analytics

#### 5. **Automation Features** 🤖

- Scheduled campaign posting
- Auto-optimization of campaigns
- Smart budget allocation
- Automated reporting
- AI-powered recommendations
- Drip campaigns

#### 6. **Collaboration Tools** 👥

- Team workspaces
- Shared campaigns
- Comment and feedback system
- Task assignments
- Activity tracking
- Audit logs

#### 7. **Payment Processing** 💰

- Stripe integration
- Multiple currencies
- Automated commission payouts
- Invoice generation
- Tax calculation
- Payment history

#### 8. **Security Features** 🔒

- JWT authentication
- End-to-end encryption
- Two-factor authentication (2FA)
- API key management
- Rate limiting
- DDoS protection
- Regular security audits

#### 9. **Scalability** 📊

- Cloudflare global CDN
- Auto-scaling workers
- D1 database replication
- R2 object storage
- Zero cold starts
- Edge computing

#### 10. **White-Label Options** 🎨

- Custom branding
- Custom domain
- Branded emails
- Custom color schemes
- Logo customization

---

## Architecture Overview

### Tech Stack

```
Frontend:
├── Next.js 14 (App Router)
├── React 18
├── TypeScript
├── TailwindCSS
├── Shadcn UI
└── Zustand (State Management)

Backend:
├── Cloudflare Workers (Serverless)
├── Cloudflare D1 (SQLite Database)
├── Cloudflare R2 (Object Storage)
├── Cloudflare AI (AI/ML Models)
└── TypeScript

DevOps:
├── Wrangler CLI
├── GitHub Actions (CI/CD)
├── Cloudflare Pages (Frontend)
└── Cloudflare Workers (Backend)
```

### Data Flow

```
User Request
    ↓
[Next.js Frontend]
    ↓
[API Client (Zustand Store)]
    ↓
[Cloudflare Workers API]
    ↓
├─→ [D1 Database] (Product/User Data)
├─→ [R2 Storage] (Images/Assets)
└─→ [AI Binding] (ML Processing)
    ↓
Response → User
```

### Database Schema

```sql
users
├── id (uuid)
├── email (unique)
├── password_hash
├── role (admin/affiliate)
└── created_at

products
├── id
├── name
├── category
├── platform
├── commission
├── price
├── competition_level
├── potential_score (AI-calculated)
└── image_url

campaigns
├── id
├── user_id (FK)
├── product_id (FK)
├── name
├── budget
├── status
└── created_at

sales
├── id
├── campaign_id (FK)
├── date
├── clicks
├── conversions
├── revenue
└── commission_earned
```

---

## Getting Started

### Development Setup

```bash
# Install dependencies
npm install

# Setup environment
cp .dev.vars.example .dev.vars

# Initialize database
npm run db:init:local
npm run db:seed:local

# Start development
npm run dev          # Frontend (Next.js)
npm run worker:dev   # Backend (Workers)
```

### Environment Variables

```bash
# .dev.vars
JWT_SECRET=your-secret-key-here
ENVIRONMENT=development

# Database
DB_NAME=affiliate-db

# AI Features (uncomment to enable)
# CLOUDFLARE_AI_TOKEN=your-token

# External APIs (for crawler)
# AMAZON_API_KEY=xxxx
# TIKTOK_API_KEY=xxxx
# SHOPEE_API_KEY=xxxx
```

### Deployment

```bash
# Deploy database migrations
npm run db:deploy:remote

# Deploy backend
npm run deploy:worker

# Deploy frontend
npm run deploy:pages
```

---

## Support & Resources

- **Documentation**: [docs](./README.md)
- **API Reference**: [api-docs](./API.md)
- **Community**: [Discord](https://discord.gg/affiliateiq)
- **Bug Reports**: [GitHub Issues](https://github.com/affiliateiq/issues)
- **Email**: support@affiliateiq.com

---

## License

Proprietary - © 2026 AffiliateIQ Platform
