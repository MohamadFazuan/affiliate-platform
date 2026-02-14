# AffiliateIQ MVP - Feature Task List

## 🎯 Project Status: Platform Pivot to AI Content Generator

**Last Updated:** February 13, 2026
**Major Change:** Pivoting from complex affiliate management platform to simplified AI video script generator with credit-based monetization

---

## ✅ COMPLETED FEATURES

### Core Authentication & User Management

- [x] User registration with email/password
- [x] User login with JWT authentication
- [x] Password hashing with bcrypt-ts
- [x] Role-based access control (Admin/Affiliate)
- [x] User session management with Zustand
- [x] Secure logout functionality

### Product Management

- [x] Product database schema with comprehensive fields
- [x] Product listing with search and filters
- [x] Product detail view
- [x] Product images from Unsplash
- [x] Category-based filtering
- [x] Platform-based filtering
- [x] AI scoring algorithm (potential_score)
- [x] Competition level tracking
- [x] Commission tracking

### Dashboard & Analytics

- [x] User dashboard layout with sidebar navigation
- [x] Dashboard responsive design for mobile/tablet
- [x] Dark/Light mode toggle
- [x] Product explorer with grid view
- [x] Real-time data loading
- [x] Error handling and loading states

### Admin Features

- [x] Admin-only navigation
- [x] Admin product management interface
- [x] Product CRUD operations UI
- [x] CSV export functionality
- [x] Admin role verification

### SaaS Features

- [x] Subscription tier system (Free/Pro/Enterprise)
- [x] Trial period tracking
- [x] Subscription status badges
- [x] Settings page with billing section
- [x] API access management (Pro+ only)
- [x] Usage limits per tier

### UI/UX Improvements

- [x] Mobile-responsive explore page
- [x] Sidebar category navigation
- [x] Touch-friendly buttons and inputs
- [x] Adaptive text sizing
- [x] Loading skeletons
- [x] Toast notifications support
- [x] Shadcn UI components integration

### Documentation

- [x] System guide with AI features
- [x] Architecture documentation
- [x] API documentation outline
- [x] Deployment guide

---

## 🚧 IN PROGRESS

### Performance Optimization

- [x] Implement code splitting with React.lazy()
- [x] Add lazy loading for images
- [x] Optimize API calls with caching
- [ ] Reduce bundle size
- [ ] Implement service worker for offline support

### Mobile Responsiveness

- [x] Explore page mobile optimization
- [x] Dashboard mobile optimization
- [x] Fine-tune remaining responsive issues
- [ ] Test on various devices and screen sizes

---

## 📋 TODO - HIGH PRIORITY (NEW DIRECTION)

### AI Video Script Generation

- [ ] Cloudflare AI integration (Llama or similar LLM)
- [ ] AI script generation service in Workers
- [ ] Generate video idea/concept from product data
- [ ] Generate opening hook (3-5 seconds)
- [ ] Generate full video script with storytelling
- [ ] Generate call-to-action script
- [ ] Generate hashtag suggestions
- [ ] Generate thumbnail ideas
- [ ] Display generated content in organized sections
- [ ] Copy to clipboard functionality
- [ ] Download script as text file
- [ ] Regenerate option
- [ ] Loading states during generation

### Credit System

- [ ] Add credits field to users table
- [ ] Initialize new users with 100 free credits
- [ ] Deduct 1 credit per AI generation
- [ ] Credit balance display in header
- [ ] Credit warning when < 10 credits
- [ ] Credit purchase page with 4 pricing tiers:
  - Starter: RM 5 → 50 credits
  - Popular: RM 20 → 250 credits (20% bonus)
  - Pro: RM 100 → 1,500 credits (33% bonus)
  - Custom: RM 5-500 (user-defined amount)
- [ ] Stripe integration for credit purchases (MYR currency)
- [ ] Credit transaction history (purchases + usage)
- [ ] Prevent generation when credits = 0
- [ ] Add credits after successful payment via webhook
- [ ] Show "Best Value" badge on RM 100 tier
- [ ] Auto-calculate credits for custom amount (base rate: RM 0.10/credit)

### Saved Products / Favorites

- [ ] Create favorites table (user_id, product_id, created_at)
- [ ] Heart icon on product cards
- [ ] Toggle save/unsave functionality
- [ ] "My Favorites" page (requires login)
- [ ] Show saved products in grid
- [ ] Remove from favorites option
- [ ] Favorite count per product (optional)

### Homepage = Product Explorer

- [ ] Remove separate landing page
- [ ] Product explorer as homepage (no login required)
- [ ] Show products immediately on site entry
- [ ] Login/Register as modal overlays (not separate pages)
- [ ] "Generate Content" button redirects to login if not authenticated
- [ ] Simplified navigation (Explore, Favorites, Buy Credits, Settings)

### Deprecated Features (Remove or Hide)

- [ ] Remove/hide Analytics Dashboard
- [ ] Remove/hide Campaigns section
- [ ] Remove/hide Sales Tracking
- [ ] Remove/hide Admin product management UI
- [ ] Simplify settings page (remove subscription tiers)
- [ ] Remove complex navigation items

### AI Integration (ACTIVE - Core Feature)

- [ ] Enable Cloudflare AI binding in wrangler.toml
- [ ] Create AI service module for script generation
- [ ] Prompt engineering for video scripts
- [ ] Implement retry logic for AI failures
- [ ] Cache generated content (optional)
- [ ] Rate limiting per user
- [ ] Monitor AI usage and costs

### Product Discovery (SIMPLIFIED)

- [ ] Product grid on homepage (no login required)
- [ ] Search products by name
- [ ] Filter by category
- [ ] Filter by platform
- [ ] Sort by trending, newest, commission
- [ ] Heart icon to save favorites (requires login)
- [ ] "Generate Content" button on each product card

### ~~Analytics Enhancements~~ (DEPRECATED - Remove from UI)

- [x] ~~Campaign performance graphs~~
- [x] ~~Click-through rate (CTR) visualization~~
- [x] ~~Conversion funnel~~
- [x] ~~Top performing products~~
- [x] ~~Monthly/Weekly/Daily time range views~~
- [x] ~~Export reports (CSV with date formatting)~~

### ~~Sales Tracking~~ (DEPRECATED - Remove from UI)

- [x] ~~Sales data entry (full UI with modal and form)~~
- [x] ~~Sales recording backend service (complete CRUD)~~
- [x] ~~Commission calculation (automatic on sale creation)~~
- [x] ~~Sales statistics aggregation (revenue, ROI, conversion rate)~~
- [x] ~~Sales filtering (by campaign, date range)~~
- [x] ~~Top performing campaigns by sales~~
- [x] ~~Sales table with edit/delete actions~~
- [x] ~~Sales navigation link in dashboard~~

---

## 📋 TODO - MEDIUM PRIORITY

### User Experience

- [ ] Onboarding tutorial
- [ ] Product tour
- [ ] Help center
- [ ] In-app notifications
- [ ] Email notifications
- [ ] Real-time updates with WebSockets

### Product Management Enhancements

- [ ] Bulk product import (CSV)
- [ ] Product templates
- [ ] Quick add product modal
- [ ] Product variants tracking
- [ ] Stock level monitoring
- [ ] Price history tracking

### Campaign Enhancements

- [ ] Campaign templates
- [ ] A/B testing support
- [ ] Automated campaigns
- [ ] Campaign scheduling
- [ ] Multi-platform campaigns
- [ ] Campaign duplication
- [ ] Campaign analytics

### Settings & Profile

- [ ] Profile photo upload
- [ ] Bio and social links
- [ ] Password change functionality
- [ ] Two-factor authentication (2FA)
- [ ] Email preferences
- [ ] Timezone settings
- [ ] Language preferences

### Payment & Billing (CREDIT-BASED SYSTEM)

- [ ] Remove subscription tiers (Free/Pro/Enterprise)
- [ ] Implement one-time credit purchases
- [ ] 4-tier credit pricing:
  - RM 5 → 50 credits (RM 0.10 per credit)
  - RM 20 → 250 credits (RM 0.08 per credit - 20% bonus)
  - RM 100 → 1,500 credits (RM 0.067 per credit - 33% bonus)
  - Custom amount (minimum RM 5, maximum RM 500)
- [ ] Stripe checkout for credit purchases
- [ ] Webhook to add credits after payment
- [ ] Credit transaction history page
- [ ] Credits never expire
- [ ] Remove billing portal (no subscriptions)
- [ ] Display pricing in Malaysian Ringgit (RM)

### API Development

- [ ] RESTful API endpoints
- [ ] API documentation (Swagger/OpenAPI)
- [ ] API rate limiting
- [ ] API key generation
- [ ] Webhook support
- [ ] API usage analytics

---

## 📋 TODO - LOW PRIORITY

### Social Features

- [ ] User profiles (public)
- [ ] Follow other affiliates
- [ ] Share campaigns
- [ ] Community feed
- [ ] Comments and reactions
- [ ] Leaderboard

### Advanced Analytics

- [ ] Custom report builder
- [ ] Data export automation
- [ ] Scheduled reports
- [ ] Advanced filtering
- [ ] Cohort analysis
- [ ] Attribution modeling

### Marketing Tools

- [ ] Landing page builder
- [ ] Email campaign creator
- [ ] QR code generator
- [ ] Link shortener
- [ ] UTM parameter builder
- [ ] Media library

### Integrations

- [ ] TikTok API integration
- [ ] Instagram API integration
- [ ] Amazon Associates API
- [ ] Shopee Affiliate API
- [ ] Google Analytics integration
- [ ] Zapier integration

### Mobile App

- [ ] React Native app
- [ ] Push notifications
- [ ] Offline mode
- [ ] Mobile-specific features

---

## 🐛 KNOWN ISSUES & BUGS

### Critical

- [x] ~~Server error: generateStaticParams() missing~~ - FIXED
- [x] ~~Sign-in internal server error~~ - FIXED
- [x] ~~Password verification not working~~ - FIXED

### High Priority

- [x] ~~Add products button not responding~~ - FIXED (now navigates to admin page)
- [x] ~~Slow page load times~~ - OPTIMIZED (code splitting, caching, lazy loading)
- [ ] Mobile responsiveness issues on some pages

### Medium Priority

- [x] ~~Image loading optimization needed~~ - DONE (LazyImage component)
- [ ] API error messages not user-friendly
- [ ] Dark mode inconsistencies
- [ ] Form validation needs improvement

### Low Priority

- [ ] Console warnings in development
- [ ] TypeScript type errors (ignored in build)
- [ ] Missing loading states on some actions

---

## 🚀 PERFORMANCE OPTIMIZATIONS NEEDED

- [x] ~~Implement React.lazy() for code splitting~~ - DONE (LazyComponents.tsx)
- [x] ~~Add image lazy loading~~ - DONE (LazyImage.tsx component)
- [x] ~~Optimize API calls with caching~~ - DONE (localStorage cache with TTL)
- [ ] Reduce bundle size
- [ ] Implement service worker for PWA
- [ ] Add CDN for static assets
- [ ] Database query optimization
- [ ] Implement pagination for large lists

---

## 🔒 SECURITY ENHANCEMENTS

- [ ] Input sanitization
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Rate limiting on API
- [ ] SQL injection prevention (using prepared statements)
- [ ] Secure file uploads
- [ ] Environment variables audit
- [ ] Security headers configuration
- [ ] Regular dependency updates
- [ ] Penetration testing

---

## 📱 DEPLOYMENT ROADMAP

### Development Environment

- [x] Local development setup
- [x] Database seeding
- [x] Environment variables configuration

### Staging Environment

- [ ] Cloudflare Pages setup
- [ ] Cloudflare Workers deployment
- [ ] D1 database (remote) setup
- [ ] R2 bucket configuration
- [ ] Custom domain setup
- [ ] SSL certificate

### Production Environment

- [ ] Production database backup
- [ ] Monitoring setup (Sentry/LogRocket)
- [ ] Analytics setup (Plausible/Google Analytics)
- [ ] Error tracking
- [ ] Performance monitoring
- [ ] Uptime monitoring
- [ ] Automated backups

---

## 📊 METRICS TO TRACK

### User Metrics

- Daily/Monthly Active Users (DAU/MAU)
- User retention rate
- Churn rate
- Average session duration
- User engagement score

### Business Metrics

- Conversion rate (Free → Paid)
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Net Promoter Score (NPS)

### Product Metrics

- Products added per day
- Campaigns created per day
- Average commission per conversion
- Top performing products
- Most used features

---

## 🎓 LEARNING & RESOURCES

### Technologies to Master

- Next.js 14 App Router
- Cloudflare Workers
- D1 Database optimization
- Cloudflare AI
- Edge computing concepts

### Best Practices

- API design principles
- Database indexing strategies
- Caching strategies
- Security best practices
- UX design patterns

---

## 📝 NOTES

### Technical Decisions

- Using Cloudflare Workers for serverless backend
- D1 for SQLite database at the edge
- bcrypt-ts for password hashing (Workers compatible)
- Zustand for state management (lightweight)
- Shadcn UI for component library

### Future Considerations

- Consider PostgreSQL for more complex queries
- Evaluate need for Redis caching
- Plan for horizontal scaling
- Consider GraphQL for flexible APIs
- Evaluate real-time features with WebSockets/SSE

---

## 💡 FEATURE IDEAS (Backlog)

- Affiliate network marketplace
- Influencer collaboration tools
- Content calendar
- Automated content generation
- Browser extension for quick product adds
- Mobile app notifications
- Voice commands
- AR product previews
- Blockchain-based commission tracking
- AI chatbot for support

---

**Next Sprint Goals (NEW DIRECTION):**

1. [ ] Set up Cloudflare AI binding
2. [ ] Build AI video script generation service
3. [ ] Implement credit system (backend + UI)
4. [ ] Create favorites/saved products feature
5. [ ] Redesign homepage (remove landing, show products)
6. [ ] Implement credit purchase flow with Stripe
7. [ ] Hide/remove deprecated features (campaigns, analytics, sales)
8. [ ] Test complete user flow (browse → generate → buy credits)

**Target Launch Date:** March 15, 2026

**Last Updated:** February 13, 2026 (Platform Pivot to AI Content Generator)
