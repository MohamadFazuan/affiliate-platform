# 🚀 AI-Powered Product Content Generator

## Cloudflare-Native, Credit-Based Platform

## 🎯 Objective

Build a simple, scalable platform optimized for **Cloudflare edge deployment** that helps content creators generate engaging video scripts for affiliate products.

The platform helps social media creators:

- Browse and discover products (no login required)
- Save favorite products for later
- Generate AI-powered video scripts and content ideas (requires credits)
- Get compelling hooks, storytelling angles, and CTA scripts

UI must be **minimal, clean, and data-focused**.

# 1️⃣ Product Vision

A lightweight, high-performance content generation tool with:

- Direct product browsing (homepage = product explorer, like Shopee)
- Card-based product grid
- AI-powered video script generation
- Credit-based monetization (100 free credits)
- Saved/favorite products system
- Edge-first architecture

# 2️⃣ Core Features

## A. Authentication & Access Control

### Requirements

- Email + password login
- OAuth-ready structure (Google/TikTok optional)
- JWT-based authentication
- HttpOnly secure cookies
- Role-based system:
  - Affiliate
  - Admin

### Security

- bcrypt password hashing
- Input validation
- CSRF protection
- XSS sanitization
- Rate limiting (Cloudflare native)
- Cloudflare Turnstile bot protection

### Architecture

- Auth handled in Cloudflare Workers
- D1 for user storage

## B. Product Discovery & Evaluation

### Product Fields

**Core Fields:**

- id
- name
- category
- platform (Shopee / TikTok Shop / Amazon / etc.)
- commission_percent
- price
- avg_monthly_sales
- conversion_rate
- competition_level (Low / Medium / High)
- refund_rate
- rating (1–5)
- trend_score
- estimated_cpc (optional)
- estimated_traffic

**Audience Fields:**

- target_age_range
- gender
- location
- interest_tags

**⚠️ NOTE:** Sections C-F below represent the OLD platform design (scoring, campaigns, analytics, tracking).

**See MVP_TASKS.md for NEW simplified direction:**

- AI video script generation
- Credit-based system (100 free credits)
- Favorites/saved products
- No complex dashboard/analytics

---

### OLD SECTIONS (For Reference Only):

## C. Smart Product Scoring Engine (DEPRECATED)

### Formula (Modular & Adjustable)

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Potential Score =  (Commission * Avg Sales * Conversion Rate)  - Competition Factor  + Trend Score  - Refund Risk   `

### Requirements

- Scoring logic isolated in backend service module
- Competition factor mapped numerically
- Refund risk weighted
- Returns:
  - Potential Score
  - Estimated Monthly Income
  - Risk Level (Green / Yellow / Red)

### UI Behavior

Each product displays:

- Score badge
- Income estimate
- Risk indicator
- “Recommended” tag (top percentile only)

Sorting options:

- Highest income
- Lowest competition
- Trending
- Best audience match

## D. Campaign Management

Users can:

- Add product to **My Campaigns**
- Define:
  - Platform (TikTok, IG, YouTube)
  - Budget
  - Content type
  - Start date

Campaign is tied to product + user.

## E. Analytics Dashboard

### KPIs

- Total revenue
- Total commission earned
- Conversion rate
- Clicks
- Sales
- ROI
- CPA

### Charts (Minimal Design)

- Revenue over time (Line chart)
- Sales per product (Bar chart)
- Platform performance comparison
- Conversion funnel

Use:

- Recharts
- Clean axes
- Neutral color palette
- No heavy animations

## F. Tracking System

### Manual Tracking

Users can manually enter:

- Clicks
- Conversions
- Revenue
- Date

### Auto Tracking Ready

- Webhook endpoint in Workers
- API-ready structure for:
  - TikTok Shop
  - Amazon
  - Shopee

Must be extendable.

**⚠️ DEPRECATED SECTIONS BELOW - Old Platform Features (No Longer Required)**

---

# 3️⃣ Optional Intelligence Modules (DEPRECATED)

**Note:** The following sections describe the old affiliate management platform. The new direction focuses on AI content generation with a credit system instead.

Feature-flag ready.

### Competitor Insight

- Competitor density score
- Trending hashtags
- Content angle suggestions

### AI Suggestions

- Suggested posting time
- Content hook ideas
- Saturation prediction

### Goal Tracking

- Monthly income goal
- Required daily sales
- Progress indicator

# 4️⃣ Technical Architecture

## Frontend

- Next.js (App Router)
- TailwindCSS
- Shadcn UI (minimal components only)
- Zustand (state management)
- Recharts (charts)

Deploy to:→ Cloudflare Pages

### UI Rules

- Minimalist SaaS
- Plenty of white space
- Soft shadows
- Neutral palette (gray/white/black + one accent color)
- No heavy gradients
- No flashy animations
- Card-based layout
- Focus on clarity over decoration

## Backend

Use:→ Cloudflare Workers

Responsibilities:

- Authentication
- JWT validation
- Product scoring
- Campaign CRUD
- Dashboard aggregation
- Webhooks

Architecture rules:

- Modular services
- Separate scoring engine file
- Middleware for auth
- Central validation utility

## Database (Cloudflare D1)

### Users

- id
- email
- password_hash
- role
- created_at

### Products

- id
- name
- category
- platform
- commission_percent
- price
- avg_monthly_sales
- conversion_rate
- competition_level
- refund_rate
- rating
- trend_score
- estimated_cpc
- estimated_traffic

### Campaigns

- id
- user_id
- product_id
- platform
- budget
- start_date

### Sales

- id
- campaign_id
- date
- clicks
- conversions
- revenue

### Indexes Required

- user_id
- product_id
- campaign_id

## Storage (Optional)

Use **Cloudflare R2** for:

- Product images
- Exported reports

# 5️⃣ Cloudflare Deployment Requirements

Must include:

- wrangler.toml
- D1 binding
- R2 binding
- Environment variables
- Worker routes
- Pages deployment config

Performance target:

- < 2s load time
- Edge caching where possible

# 6️⃣ SaaS-Ready Architecture

Prepare for:

- Freemium tier
- Pro subscription
- Stripe integration
- Usage limits stored in DB
- Feature flags

Must support:

- Multi-tenant structure
- Clean service separation
- Scalable design

# 7️⃣ Required Pages

- **Homepage** = Product Explorer (no separate landing page)
- Login / Register modals (overlay, not separate pages)
- Product Detail (with Generate button)
- My Favorites (saved products, requires login)
- Buy Credits page
- Settings (profile, credit history, password change)

# 8️⃣ Engineering Principles

- Clean modular architecture
- Strict separation:
  - UI
  - Business logic
  - Scoring engine

- Strict validation layer
- No business logic inside UI components
- Optimized for Cloudflare Edge
- Easy to extend with AI

# 🔥 Final Instruction

Build a simple, fast AI content generation platform optimized for Cloudflare edge deployment.

Prioritize:

- Simplicity (no complex dashboards)
- Fast AI generation
- Clear credit system
- Product-first browsing (like Shopee)
- Mobile-friendly
- Frictionless experience

**User Flow:**

1.  User visits site → sees products immediately
2.  Browse freely without login
3.  Click "Generate Content" → prompt to login/register
4.  After login → Generate content (uses 1 credit)
5.  View generated script, copy, or regenerate
6.  When credits run low → Buy more credits

Keep it simple. Focus on product discovery + AI generation.
