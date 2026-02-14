# 🏗️ Architecture Documentation

Technical architecture and design decisions for AffiliateIQ Platform.

## Table of Contents

- [System Overview](#system-overview)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Database Design](#database-design)
- [API Design](#api-design)
- [Security Architecture](#security-architecture)
- [Scoring Algorithm](#scoring-algorithm)
- [State Management](#state-management)
- [Deployment Architecture](#deployment-architecture)

## System Overview

AffiliateIQ is a serverless, edge-first application built on Cloudflare's infrastructure. The architecture follows a clean separation of concerns with three main layers:

```
┌─────────────────────────────────────────┐
│         User's Browser                  │
│  ┌───────────────────────────────────┐  │
│  │   Next.js Frontend (React)        │  │
│  │   - Static pages                  │  │
│  │   - Client-side state (Zustand)   │  │
│  │   - API client                    │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    ↕ HTTPS
┌─────────────────────────────────────────┐
│   Cloudflare Edge Network               │
│  ┌───────────────────────────────────┐  │
│  │   Cloudflare Workers (API)        │  │
│  │   - JWT validation                │  │
│  │   - Business logic                │  │
│  │   - Request routing               │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│   Data Layer                            │
│  ┌────────────────┐  ┌───────────────┐  │
│  │ D1 Database    │  │ R2 Storage    │  │
│  │ (SQLite)       │  │ (Optional)    │  │
│  └────────────────┘  └───────────────┘  │
└─────────────────────────────────────────┘
```

## Frontend Architecture

### Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 3
- **State Management**: Zustand
- **Data Fetching**: Custom API client
- **Charts**: Recharts
- **Icons**: Lucide React

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Route group for auth pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/       # Route group for protected pages
│   │   ├── layout.tsx     # Dashboard wrapper
│   │   ├── page.tsx       # Analytics dashboard
│   │   ├── products/
│   │   ├── campaigns/
│   │   └── settings/
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css
├── components/            # Reusable components
│   ├── DashboardLayout.tsx
│   └── ui/               # UI primitives
└── lib/                  # Utilities & services
    ├── api.ts            # API client
    ├── store.ts          # Zustand stores
    └── utils.ts          # Helper functions
```

### Key Design Patterns

#### 1. Route Groups
Use parentheses to organize routes without affecting URLs:
- `(auth)` - Authentication pages
- `(dashboard)` - Protected dashboard pages

#### 2. Layouts
Nested layouts provide shared UI:
```tsx
// Root layout - applies to all pages
app/layout.tsx

// Dashboard layout - only for dashboard pages
app/(dashboard)/layout.tsx
```

#### 3. Client vs Server Components
- **Server Components** (default): Static pages, layouts
- **Client Components** (`'use client'`): Interactive UI, hooks, state

#### 4. State Management Pattern
```typescript
// Global state with Zustand
const useStore = create((set) => ({
  data: [],
  setData: (data) => set({ data }),
}))

// Usage in components
const { data, setData } = useStore()
```

#### 5. API Client Pattern
```typescript
class APIClient {
  private token: string | null = null

  setToken(token: string) {
    this.token = token
  }

  private async request(endpoint: string, options: RequestInit) {
    // Add auth header if token exists
    // Handle errors uniformly
    // Parse JSON response
  }
}
```

## Backend Architecture

### Technology Stack

- **Runtime**: Cloudflare Workers
- **Language**: TypeScript 5
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2 (optional)

### Directory Structure

```
backend/
├── worker.ts              # Main entry point
├── types.ts               # TypeScript definitions
├── services/              # Business logic layer
│   ├── auth.ts
│   ├── products.ts
│   ├── campaigns.ts
│   ├── sales.ts
│   ├── analytics.ts
│   ├── goals.ts
│   └── scoring.ts         # Scoring algorithm
├── middleware/            # Request middleware
│   └── auth.ts           # JWT verification
└── utils/                # Utility functions
    ├── jwt.ts
    ├── password.ts
    └── validation.ts
```

### Architectural Principles

#### 1. Separation of Concerns
Each layer has a single responsibility:
- **worker.ts**: Request routing and response formatting
- **services/**: Business logic and data operations
- **middleware/**: Cross-cutting concerns (auth, validation)
- **utils/**: Pure utility functions

#### 2. Service Layer Pattern
```typescript
// Each service exports focused functions
export async function getProducts(filters, env) {
  // 1. Validate inputs
  // 2. Query database
  // 3. Transform data
  // 4. Return results
}
```

#### 3. Dependency Injection
Services receive `Env` as parameter:
```typescript
async function handleRequest(request: Request, env: Env) {
  // Pass env to services
  const products = await getProducts(filters, env)
}
```

#### 4. Type Safety
Full TypeScript coverage with strict types:
```typescript
interface Product {
  id: string
  name: string
  commission: number
  // ... all fields typed
}
```

### Request Flow

```
1. Request arrives at Worker
   ↓
2. CORS preflight check
   ↓
3. Route matching
   ↓
4. Authentication (if protected)
   ↓
5. Service function call
   ↓
6. Database query
   ↓
7. Response formatting
   ↓
8. Return to client
```

## Database Design

### Schema Overview

```sql
users
├── id (PK)
├── email (UNIQUE)
├── password_hash
├── role
└── timestamps

products
├── id (PK)
├── name
├── category
├── platform
├── commission
├── price
├── avg_monthly_sales
├── conversion_rate
├── competition_level
├── potential_score
├── ... (metrics)
└── timestamps

campaigns
├── id (PK)
├── user_id (FK → users)
├── product_id (FK → products)
├── name
├── promotion_platform
├── budget
├── status
└── timestamps

sales
├── id (PK)
├── campaign_id (FK → campaigns)
├── date
├── clicks
├── conversions
├── revenue
├── commission_earned
└── cost

goals
├── id (PK)
├── user_id (FK → users)
├── monthly_income_goal
└── current_month
```

### Indexing Strategy

Indexes are created on frequently queried columns:
```sql
-- Users
CREATE INDEX idx_users_email ON users(email);

-- Products
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_platform ON products(platform);
CREATE INDEX idx_products_potential_score ON products(potential_score DESC);
CREATE INDEX idx_products_competition ON products(competition_level);

-- Campaigns
CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_campaigns_product_id ON campaigns(product_id);

-- Sales
CREATE INDEX idx_sales_campaign_id ON sales(campaign_id);
CREATE INDEX idx_sales_date ON sales(date);
```

### Relationships

```
users (1) ─→ (N) campaigns
products (1) ─→ (N) campaigns
campaigns (1) ─→ (N) sales
users (1) ─→ (N) goals
```

## API Design

### REST Principles

- **Resource-based URLs**: `/api/products`, `/api/campaigns`
- **HTTP Methods**: GET, POST, PUT, DELETE
- **Status Codes**: 200, 201, 400, 401, 404, 500
- **JSON format**: All requests and responses use JSON

### Endpoint Catalog

#### Authentication (Public)
```
POST /api/auth/register
POST /api/auth/login
```

#### Products (Protected)
```
GET /api/products?category=&platform=&sortBy=&limit=
GET /api/products/:id
```

#### Campaigns (Protected)
```
GET /api/campaigns
POST /api/campaigns
DELETE /api/campaigns/:id
```

#### Sales (Protected)
```
POST /api/sales
```

#### Analytics (Protected)
```
GET /api/analytics/dashboard
GET /api/analytics/campaign?campaignId=
```

#### Goals (Protected)
```
GET /api/goals
POST /api/goals
```

### Request/Response Format

**Request Example**:
```json
POST /api/campaigns
{
  "product_id": "uuid",
  "name": "TikTok Campaign",
  "promotion_platform": "TikTok",
  "budget": 500,
  "start_date": 1234567890
}
```

**Response Example**:
```json
{
  "campaign": {
    "id": "uuid"
  }
}
```

**Error Response**:
```json
{
  "error": "Campaign not found"
}
```

## Security Architecture

### Authentication Flow

```
1. User registers/logs in
   ↓
2. Server validates credentials
   ↓
3. Server generates JWT
   ↓
4. Client stores token (localStorage)
   ↓
5. Client includes token in Authorization header
   ↓
6. Server validates token on each request
```

### JWT Structure

```typescript
{
  id: "user-uuid",
  email: "user@example.com",
  role: "affiliate",
  exp: 1234567890  // 30 days from issue
}
```

### Security Layers

1. **Transport**: HTTPS only (enforced by Cloudflare)
2. **Authentication**: JWT tokens with expiration
3. **Authorization**: Role-based access control
4. **Input Validation**: All inputs sanitized
5. **SQL Injection**: Parameterized queries only
6. **XSS Prevention**: Input sanitization
7. **CORS**: Configured for specific origins
8. **Rate Limiting**: Cloudflare automatic protection

## Scoring Algorithm

### Formula

```typescript
Potential Score = 
  (Commission × Sales × Conversion × Price / 100)
  - (Competition × 100)
  + Trend Score
  - (Refund Rate × 500)
```

### Implementation

Located in `backend/services/scoring.ts`:

```typescript
export function calculatePotentialScore(product, weights) {
  const competitionFactor = weights.competitionFactor[product.competition_level]
  
  const incomeScore = 
    (product.commission * 
     product.avg_monthly_sales * 
     product.conversion_rate * 
     product.price / 100)
  
  const competitionPenalty = competitionFactor * weights.competitionPenalty
  const trendBonus = product.trend_score || 0
  const refundPenalty = (product.refund_rate || 0) * weights.refundPenaltyMultiplier
  
  return incomeScore - competitionPenalty + trendBonus - refundPenalty
}
```

### Customization

Weights can be adjusted:
```typescript
const DEFAULT_WEIGHTS = {
  competitionFactor: { 'Low': 1, 'Medium': 2, 'High': 3 },
  competitionPenalty: 100,
  refundPenaltyMultiplier: 500
}
```

## State Management

### Zustand Stores

#### Auth Store
```typescript
interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (token, user) => void
  logout: () => void
}
```

#### Product Store
```typescript
interface ProductStore {
  products: Product[]
  selectedProduct: Product | null
  filters: FilterState
  setProducts: (products) => void
  setFilters: (filters) => void
}
```

### Persistence

Auth state persists to localStorage:
```typescript
persist(
  (set) => ({ /* state */ }),
  { name: 'auth-storage' }
)
```

## Deployment Architecture

### Edge Distribution

```
User → Cloudflare Edge (CDN)
         ↓
    Workers (Compute)
         ↓
    D1 Database (Storage)
```

### Benefits

- **Low Latency**: Runs on 275+ data centers globally
- **Auto-Scaling**: Handles traffic spikes automatically
- **DDoS Protection**: Built-in Cloudflare protection
- **Zero-Config SSL**: HTTPS by default
- **Infinite Scalability**: Serverless architecture

### Performance Targets

- **TTFB** (Time to First Byte): < 100ms
- **Page Load**: < 2s
- **API Response**: < 200ms
- **Database Query**: < 50ms

## Best Practices

### Code Organization

1. **One responsibility per file**
2. **Export named functions, not default**
3. **Type everything explicitly**
4. **Document complex logic**
5. **Keep functions small (< 50 lines)**

### Database Queries

1. **Use prepared statements**
2. **Limit result sets**
3. **Use indexes**
4. **Batch operations when possible**
5. **Handle errors gracefully**

### API Design

1. **RESTful URLs**
2. **Consistent naming**
3. **Proper status codes**
4. **Clear error messages**
5. **Version endpoints if needed**

### Security

1. **Never trust client input**
2. **Validate everything**
3. **Use parameterized queries**
4. **Hash passwords** (upgrade to bcrypt)
5. **Rotate secrets regularly**

---

## Future Enhancements

Potential improvements:
- [ ] WebSocket support for real-time updates
- [ ] GraphQL API layer
- [ ] Redis caching layer
- [ ] Stripe payment integration
- [ ] AI-powered product recommendations
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Advanced analytics with ML

---

**Questions?** Check the main README or open an issue on GitHub.
