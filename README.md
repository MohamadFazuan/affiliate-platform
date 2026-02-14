# 🚀 AffiliateIQ Platform

An AI-powered video script generator for affiliate marketers with credit-based monetization system.

> **Modern Architecture**: Built with Next.js 14, Cloudflare Workers, Cloudflare AI, D1 Database, and TypeScript.

## ✨ Features

### Core Capabilities

- **AI Video Script Generation** - Generate TikTok/social media scripts with AI
- **Smart Product Discovery** - Browse affiliate products across multiple platforms
- **Credit System** - Pay-as-you-go with affordable RM pricing
- **Favorites** - Save products for later content creation
- **User Dashboard** - Track credits, purchases, and generation history
- **Admin Panel** - Monitor users, usage, revenue, and platform metrics

### Technical Highlights

- ⚡ **Edge-First** - Deployed on Cloudflare's global network for ultra-fast response times
- 🤖 **AI-Powered** - Cloudflare AI or OpenAI for script generation
- 🎨 **Modern UI** - Clean, responsive interface with TailwindCSS and Shadcn UI
- 🔒 **Secure** - JWT authentication, password hashing, input validation
- 💳 **Stripe Integration** - Secure credit purchases with MYR support
- 🌐 **API-Ready** - RESTful API structure for future integrations

## 💰 Pricing (Malaysian Ringgit)

| Package | Price    | Credits  | Rate            | Bonus |
| ------- | -------- | -------- | --------------- | ----- |
| Starter | RM 5     | 50       | RM 0.10/credit  | -     |
| Popular | RM 20    | 250      | RM 0.08/credit  | 20%   |
| Pro     | RM 100   | 1,500    | RM 0.067/credit | 33%   |
| Custom  | RM 5-500 | Variable | RM 0.10/credit  | -     |

**Free Credits:** New users get 100 credits on signup  
**Usage:** 1 credit = 1 AI video script generation

## 📚 Documentation

All documentation has been organized in the [/docs](./docs/) folder:

### 🚀 Quick Start

- **[Getting Started](./docs/README.md)** - Documentation index and overview
- **[Quick Start (Stripe)](./docs/QUICK_START_STRIPE.md)** - Payment setup guide

### 🔧 Setup Guides

- **[AI API Setup](./docs/AI_API_SETUP.md)** ⭐ - **Complete guide to set up Cloudflare AI or OpenAI**
- **[Stripe Setup](./docs/STRIPE_SETUP.md)** - Payment integration details
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Cloudflare deployment

### 👨‍💼 Administration

- **[Admin Tracking](./docs/ADMIN_TRACKING.md)** ⭐ - **User tracking, analytics, and billing management**

### 📋 Development

- **[Architecture](./docs/ARCHITECTURE.md)** - System design and database schema
- **[System Guide](./docs/SYSTEM_GUIDE.md)** - Feature documentation
- **[MVP Tasks](./MVP_TASKS.md)** - Feature roadmap and progress

## 📁 Project Structure

```
📦 affiliate-platform/
├── 📱 src/                          # Frontend source
│   ├── app/                         # Next.js App Router
│   │   ├── (auth)/                  # Auth routes (login, register)
│   │   ├── (dashboard)/             # Protected dashboard routes
│   │   │   ├── page.tsx             # Main dashboard
│   │   │   ├── products/            # Product discovery
│   │   │   ├── ai-tools/            # AI script generation
│   │   │   ├── settings/            # User settings (profile & billing)
│   │   │   └── admin/               # Admin dashboard
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Landing page
│   │   └── globals.css              # Global styles
│   ├── components/                  # React components
│   │   ├── DashboardLayout.tsx      # Dashboard wrapper
│   │   └── ui/                      # Shadcn UI components
│   └── lib/                         # Frontend utilities
│       ├── api.ts                   # API client
│       ├── store.ts                 # Zustand state management
│       └── utils.ts                 # Helper functions
│
├── ⚡ backend/                       # Cloudflare Worker
│   ├── worker.ts                    # Main entry point
│   ├── types.ts                     # TypeScript definitions
│   ├── services/                    # Business logic
│   │   ├── auth.ts                  # Authentication
│   │   ├── products.ts              # Product operations
│   │   ├── campaigns.ts             # Campaign management
│   │   ├── sales.ts                 # Sales tracking
│   │   ├── analytics.ts             # Dashboard aggregation
│   │   ├── goals.ts                 # Goal setting
│   │   └── scoring.ts               # Product scoring algorithm
│   ├── middleware/                  # Request middleware
│   │   └── auth.ts                  # JWT verification
│   └── utils/                       # Backend utilities
│       ├── jwt.ts                   # JWT creation/verification
│       ├── password.ts              # Password hashing
│       └── validation.ts            # Input validation
│
├── 🗄️ database/                     # Database files
│   ├── schema.sql                   # D1 database schema
│   └── seed.sql                     # Sample data
│
├── 📄 Configuration Files
│   ├── next.config.js               # Next.js config
│   ├── tsconfig.json                # TypeScript config
│   ├── tailwind.config.js           # Tailwind config
│   ├── wrangler.toml                # Cloudflare config
│   └── package.json                 # Dependencies
│
└── 📚 Documentation
    ├── README.md                    # This file
    ├── DEPLOYMENT.md                # Deployment guide
    └── ARCHITECTURE.md              # Architecture details
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Cloudflare account (free tier works)
- Wrangler CLI installed globally

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Create `.env.local` for frontend:

```bash
cp .env.example .env.local
# Edit .env.local and set:
NEXT_PUBLIC_API_URL=http://localhost:8787
```

Create `.dev.vars` for Cloudflare Worker:

```bash
cp .dev.vars.example .dev.vars
# Edit .dev.vars and set a strong JWT secret
```

### 3. Setup Database

Create a D1 database:

```bash
npx wrangler d1 create affiliate-db
```

Update `wrangler.toml` with the database ID from the output.

Run migrations:

```bash
npm run db:migrate
npm run db:seed
```

### 4. Start Development Servers

Terminal 1 - Frontend:

```bash
npm run dev
```

Terminal 2 - Backend Worker:

```bash
npm run worker:dev
```

Visit:

- Frontend: http://localhost:3000
- API: http://localhost:8787

## 📦 Available Scripts

### Development

- `npm run dev` - Start Next.js dev server
- `npm run worker:dev` - Start Cloudflare Worker locally
- `npm run build` - Build Next.js app

### Database

- `npm run db:migrate` - Run schema migrations (local)
- `npm run db:migrate:remote` - Run schema migrations (remote)
- `npm run db:seed` - Seed database with sample data (local)
- `npm run db:seed:remote` - Seed database (remote)

### Deployment

- `npm run worker:deploy` - Deploy Worker to Cloudflare
- `npm run pages:deploy` - Build and deploy frontend to Cloudflare Pages

## 🏗️ Architecture

### Frontend (Next.js 14)

- **App Router** - File-based routing with layouts
- **Server Components** - Optimized performance
- **Client Components** - Interactive UI with React hooks
- **State Management** - Zustand for global state
- **Styling** - TailwindCSS with custom design system
- **Charts** - Recharts for data visualization

### Backend (Cloudflare Workers)

- **Edge Runtime** - Runs close to users globally
- **RESTful API** - Clean, versioned endpoints
- **JWT Authentication** - Secure token-based auth
- **Modular Services** - Separated business logic
- **Type-Safe** - Full TypeScript coverage

### Database (Cloudflare D1)

- **SQLite** - Fast, serverless SQL database
- **Indexed** - Optimized queries with proper indexes
- **Relational** - Foreign keys and constraints
- **Scalable** - Automatic scaling with Cloudflare

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing (SHA-256, upgrade to bcrypt recommended)
- ✅ Input validation and sanitization
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS configuration
- ✅ Rate limiting (via Cloudflare)
- ✅ HTTPS-only in production

## 📊 Scoring Algorithm

The platform uses a modular scoring engine to evaluate product potential:

```typescript
Potential Score =
  (Commission × Sales × Conversion × Price / 100)
  - (Competition × 100)
  + Trend Score
  - (Refund Rate × 500)
```

**Factors**:

- **Income Score**: Expected revenue based on metrics
- **Competition Penalty**: Higher for saturated markets
- **Trend Bonus**: Rewards trending products
- **Refund Risk**: Penalizes high-refund products

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy**:

1. Deploy Worker: `npm run worker:deploy`
2. Run remote migrations: `npm run db:migrate:remote && npm run db:seed:remote`
3. Deploy Pages: `npm run pages:deploy`

## 🔧 Customization

### Modify Scoring Algorithm

Edit `backend/services/scoring.ts` to adjust weights:

```typescript
const DEFAULT_WEIGHTS = {
  competitionFactor: { Low: 1, Medium: 2, High: 3 },
  competitionPenalty: 100,
  refundPenaltyMultiplier: 500,
};
```

### Add New API Endpoints

1. Create service in `backend/services/`
2. Add route in `backend/worker.ts`
3. Update types in `backend/types.ts`

### Extend Frontend

1. Add pages in `src/app/`
2. Create components in `src/components/`
3. Add state in `src/lib/store.ts`

## 🛠️ Tech Stack

**Frontend**:

- Next.js 14 (App Router)
- TypeScript 5
- TailwindCSS 3
- Zustand (State)
- Recharts (Charts)
- Lucide Icons

**Backend**:

- Cloudflare Workers
- TypeScript 5
- D1 Database (SQLite)
- R2 Storage (optional)

**DevOps**:

- Wrangler CLI
- Git
- npm

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please read CONTRIBUTING.md first.

## 📧 Support

For issues and questions:

- GitHub Issues: [Create an issue](https://github.com/yourusername/affiliate-platform/issues)
- Documentation: Check ARCHITECTURE.md

---

**Built with ❤️ for affiliate marketers**
