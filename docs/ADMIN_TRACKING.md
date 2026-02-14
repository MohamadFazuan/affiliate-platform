# Admin Tracking & Management Guide

Complete guide for administrators to track users, monitor usage, manage billing, and analyze platform metrics.

**Last Updated:** February 14, 2026

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Database Schema for Tracking](#database-schema-for-tracking)
3. [Admin Dashboard Implementation](#admin-dashboard-implementation)
4. [User Management](#user-management)
5. [Usage Analytics](#usage-analytics)
6. [Billing & Revenue Tracking](#billing--revenue-tracking)
7. [Credit Management](#credit-management)
8. [Reports & Exports](#reports--exports)
9. [Monitoring & Alerts](#monitoring--alerts)

---

## 🎯 Overview

This guide covers admin capabilities for:

- **User Management**: View, edit, disable accounts
- **Usage Tracking**: Monitor AI generation usage per user
- **Billing Analytics**: Track revenue, transactions, refunds
- **Credit Management**: Add/remove credits, view balances
- **System Metrics**: Platform-wide statistics
- **Data Export**: CSV exports for analysis

---

## 🗄️ Database Schema for Tracking

### Create Tracking Tables

Add these tables to `database/schema.sql`:

```sql
-- Credit transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('purchase', 'usage', 'admin_grant', 'refund', 'bonus')),
  amount INTEGER NOT NULL, -- positive for additions, negative for usage
  balance_after INTEGER NOT NULL,
  description TEXT,
  reference_id TEXT, -- Stripe payment ID, generation ID, etc.
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_credit_transactions_user ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_type ON credit_transactions(type);
CREATE INDEX idx_credit_transactions_created ON credit_transactions(created_at);

-- AI generation tracking
CREATE TABLE IF NOT EXISTS ai_generations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  product_id INTEGER,
  credits_used INTEGER DEFAULT 1,
  model_used TEXT, -- 'cloudflare-llama', 'openai-gpt-3.5', etc.
  tokens_used INTEGER,
  generation_time_ms INTEGER,
  status TEXT CHECK(status IN ('success', 'failed', 'error')),
  error_message TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE INDEX idx_ai_generations_user ON ai_generations(user_id);
CREATE INDEX idx_ai_generations_created ON ai_generations(created_at);
CREATE INDEX idx_ai_generations_status ON ai_generations(status);

-- Payment transactions
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  stripe_payment_id TEXT UNIQUE,
  amount REAL NOT NULL, -- amount in RM
  credits_purchased INTEGER NOT NULL,
  currency TEXT DEFAULT 'MYR',
  status TEXT CHECK(status IN ('pending', 'succeeded', 'failed', 'refunded')),
  payment_method TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created ON payments(created_at);

-- User activity logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  action TEXT NOT NULL, -- 'login', 'logout', 'generate', 'purchase', etc.
  details TEXT, -- JSON string with additional data
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at);

-- Platform statistics (aggregated daily)
CREATE TABLE IF NOT EXISTS daily_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT UNIQUE NOT NULL,
  new_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  total_generations INTEGER DEFAULT 0,
  total_revenue REAL DEFAULT 0,
  credits_purchased INTEGER DEFAULT 0,
  credits_used INTEGER DEFAULT 0,
  avg_generations_per_user REAL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_daily_stats_date ON daily_stats(date);
```

### Run Migration

```bash
# Add to your schema
cat >> database/schema.sql << 'EOF'
-- Paste the SQL above
EOF

# Apply to local database
npx wrangler d1 execute affiliate-db --local --file=./database/schema.sql

# Apply to production (when ready)
npx wrangler d1 execute affiliate-db --remote --file=./database/schema.sql
```

---

## 🖥️ Admin Dashboard Implementation

### Create Admin API Endpoints

Add to `backend/worker.ts`:

```typescript
// Admin middleware - verify admin role
async function requireAdmin(request: Request, env: Env) {
  const authResult = await authenticate(request, env);
  if (!authResult.valid || authResult.user?.role !== "admin") {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  return { user: authResult.user };
}

// === ADMIN ENDPOINTS ===

// Get all users with stats
if (url.pathname === "/api/admin/users" && request.method === "GET") {
  const adminCheck = await requireAdmin(request, env);
  if (adminCheck instanceof Response) return adminCheck;

  try {
    const { results } = await env.DB.prepare(
      `
      SELECT 
        u.id,
        u.email,
        u.role,
        u.credits,
        u.created_at,
        COUNT(DISTINCT ag.id) as total_generations,
        COALESCE(SUM(p.amount), 0) as total_spent,
        MAX(al.created_at) as last_active
      FROM users u
      LEFT JOIN ai_generations ag ON u.id = ag.user_id
      LEFT JOIN payments p ON u.id = p.user_id AND p.status = 'succeeded'
      LEFT JOIN activity_logs al ON u.id = al.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `,
    ).all();

    return new Response(JSON.stringify({ users: results }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Get user details
if (url.pathname.startsWith("/api/admin/users/") && request.method === "GET") {
  const adminCheck = await requireAdmin(request, env);
  if (adminCheck instanceof Response) return adminCheck;

  const userId = url.pathname.split("/").pop();

  try {
    const user = await env.DB.prepare("SELECT * FROM users WHERE id = ?")
      .bind(userId)
      .first();

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get credit transactions
    const { results: transactions } = await env.DB.prepare(
      "SELECT * FROM credit_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
    )
      .bind(userId)
      .all();

    // Get generations
    const { results: generations } = await env.DB.prepare(
      "SELECT * FROM ai_generations WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
    )
      .bind(userId)
      .all();

    // Get payments
    const { results: payments } = await env.DB.prepare(
      "SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
    )
      .bind(userId)
      .all();

    return new Response(
      JSON.stringify({
        user,
        transactions,
        generations,
        payments,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Update user credits (admin grant)
if (url.pathname === "/api/admin/credits/grant" && request.method === "POST") {
  const adminCheck = await requireAdmin(request, env);
  if (adminCheck instanceof Response) return adminCheck;

  try {
    const { userId, amount, reason } = await request.json();

    // Update user credits
    await env.DB.prepare("UPDATE users SET credits = credits + ? WHERE id = ?")
      .bind(amount, userId)
      .run();

    // Get new balance
    const user = await env.DB.prepare("SELECT credits FROM users WHERE id = ?")
      .bind(userId)
      .first();

    // Record transaction
    await env.DB.prepare(
      `
      INSERT INTO credit_transactions (user_id, type, amount, balance_after, description)
      VALUES (?, 'admin_grant', ?, ?, ?)
    `,
    )
      .bind(userId, amount, user.credits, reason || "Admin credit grant")
      .run();

    return new Response(
      JSON.stringify({ success: true, newBalance: user.credits }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Platform statistics
if (url.pathname === "/api/admin/stats" && request.method === "GET") {
  const adminCheck = await requireAdmin(request, env);
  if (adminCheck instanceof Response) return adminCheck;

  try {
    // Total users
    const totalUsers = await env.DB.prepare(
      "SELECT COUNT(*) as count FROM users",
    ).first();

    // Total revenue
    const revenue = await env.DB.prepare(
      "SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'succeeded'",
    ).first();

    // Total generations
    const generations = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM ai_generations WHERE status = "success"',
    ).first();

    // Active users (last 7 days)
    const activeUsers = await env.DB.prepare(
      `
      SELECT COUNT(DISTINCT user_id) as count 
      FROM activity_logs 
      WHERE created_at >= datetime('now', '-7 days')
    `,
    ).first();

    // Daily stats (last 30 days)
    const { results: dailyStats } = await env.DB.prepare(
      `
      SELECT * FROM daily_stats 
      WHERE date >= date('now', '-30 days')
      ORDER BY date DESC
    `,
    ).all();

    return new Response(
      JSON.stringify({
        totalUsers: totalUsers.count,
        totalRevenue: revenue.total,
        totalGenerations: generations.count,
        activeUsers: activeUsers.count,
        dailyStats,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Export users to CSV
if (url.pathname === "/api/admin/export/users" && request.method === "GET") {
  const adminCheck = await requireAdmin(request, env);
  if (adminCheck instanceof Response) return adminCheck;

  try {
    const { results } = await env.DB.prepare(
      `
      SELECT 
        u.id,
        u.email,
        u.role,
        u.credits,
        u.created_at,
        COUNT(DISTINCT ag.id) as total_generations,
        COALESCE(SUM(p.amount), 0) as total_spent
      FROM users u
      LEFT JOIN ai_generations ag ON u.id = ag.user_id
      LEFT JOIN payments p ON u.id = p.user_id AND p.status = 'succeeded'
      GROUP BY u.id
    `,
    ).all();

    // Convert to CSV
    const headers = [
      "ID",
      "Email",
      "Role",
      "Credits",
      "Created At",
      "Generations",
      "Total Spent (RM)",
    ];
    const rows = results.map((u) => [
      u.id,
      u.email,
      u.role,
      u.credits,
      u.created_at,
      u.total_generations,
      u.total_spent,
    ]);

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
      "\n",
    );

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="users_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
```

### Create Admin Frontend Page

Create `src/app/(dashboard)/admin/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";
import { apiClient } from "@/lib/api";
import {
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  Download,
  Search,
  Plus,
  Minus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PlatformStats {
  totalUsers: number;
  totalRevenue: number;
  totalGenerations: number;
  activeUsers: number;
}

interface UserData {
  id: number;
  email: string;
  role: string;
  credits: number;
  total_generations: number;
  total_spent: number;
  last_active: string;
}

export default function AdminPage() {
  const { user, token } = useAuthStore();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (token && user?.role === "admin") {
      apiClient.setToken(token);
      loadData();
    }
  }, [token, user]);

  const loadData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();

      setStats(statsData);
      setUsers(usersData.users);
    } catch (error) {
      console.error("Failed to load admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportUsers = async () => {
    window.open(`/api/admin/export/users?token=${token}`, "_blank");
  };

  const handleGrantCredits = async (userId: number, amount: number) => {
    try {
      await fetch("/api/admin/credits/grant", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, amount, reason: "Admin grant" }),
      });
      loadData();
    } catch (error) {
      console.error("Failed to grant credits:", error);
    }
  };

  if (!user || user.role !== "admin") {
    return <div>Access Denied</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-display font-bold mb-2">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Platform overview and user management
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              RM {stats?.totalRevenue?.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Generations</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalGenerations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Users (7d)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>User Management</CardTitle>
            <Button onClick={handleExportUsers} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Role</th>
                  <th className="text-right p-2">Credits</th>
                  <th className="text-right p-2">Generations</th>
                  <th className="text-right p-2">Spent</th>
                  <th className="text-right p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">{user.email}</td>
                    <td className="p-2 capitalize">{user.role}</td>
                    <td className="p-2 text-right font-semibold">
                      {user.credits}
                    </td>
                    <td className="p-2 text-right">{user.total_generations}</td>
                    <td className="p-2 text-right">
                      RM {user.total_spent?.toFixed(2)}
                    </td>
                    <td className="p-2 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGrantCredits(user.id, 100)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGrantCredits(user.id, -100)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 📊 Usage Analytics

### Track AI Generations

Update your AI generation endpoint to log usage:

```typescript
// In backend/worker.ts - AI generation endpoint
const script = await aiService.generateVideoScript(body);

// Log generation
await env.DB.prepare(
  `
  INSERT INTO ai_generations (user_id, product_id, credits_used, model_used, status)
  VALUES (?, ?, 1, 'cloudflare-llama', 'success')
`,
)
  .bind(user.id, body.productId || null)
  .run();

// Deduct credit and log transaction
await env.DB.prepare("UPDATE users SET credits = credits - 1 WHERE id = ?")
  .bind(user.id)
  .run();

const newBalance = user.credits - 1;
await env.DB.prepare(
  `
  INSERT INTO credit_transactions (user_id, type, amount, balance_after, description)
  VALUES (?, 'usage', -1, ?, 'AI video script generation')
`,
)
  .bind(user.id, newBalance)
  .run();
```

---

## 💳 Billing & Revenue Tracking

### Track Payments (Stripe Webhook)

```typescript
// Stripe webhook handler
if (url.pathname === "/api/webhooks/stripe" && request.method === "POST") {
  const sig = request.headers.get("stripe-signature");
  const body = await request.text();

  // Verify webhook (simplified)
  const event = JSON.parse(body);

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const userId = paymentIntent.metadata.userId;
    const credits = parseInt(paymentIntent.metadata.credits);
    const amount = paymentIntent.amount / 100; // Convert from cents

    // Record payment
    await env.DB.prepare(
      `
      INSERT INTO payments (user_id, stripe_payment_id, amount, credits_purchased, status)
      VALUES (?, ?, ?, ?, 'succeeded')
    `,
    )
      .bind(userId, paymentIntent.id, amount, credits)
      .run();

    // Add credits to user
    await env.DB.prepare("UPDATE users SET credits = credits + ? WHERE id = ?")
      .bind(credits, userId)
      .run();

    // Log transaction
    const user = await env.DB.prepare("SELECT credits FROM users WHERE id = ?")
      .bind(userId)
      .first();

    await env.DB.prepare(
      `
      INSERT INTO credit_transactions (user_id, type, amount, balance_after, description, reference_id)
      VALUES (?, 'purchase', ?, ?, ?, ?)
    `,
    )
      .bind(
        userId,
        credits,
        user.credits,
        `Purchased ${credits} credits for RM${amount}`,
        paymentIntent.id,
      )
      .run();
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
```

---

## 🎁 Credit Management

### Grant Free Credits (Admin)

```typescript
// Grant credits button in admin UI calls:
POST /api/admin/credits/grant
{
  "userId": 123,
  "amount": 100,
  "reason": "Promotional bonus"
}
```

### Automated Daily Stats

Create a Cron Trigger to aggregate daily stats:

```typescript
// In wrangler.toml
[triggers]
crons = ["0 0 * * *"] # Daily at midnight

// In worker.ts
export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    // Aggregate yesterday's data
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0];

    const newUsers = await env.DB.prepare(
      "SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = ?"
    ).bind(dateStr).first();

    const generations = await env.DB.prepare(
      "SELECT COUNT(*) as count FROM ai_generations WHERE DATE(created_at) = ?"
    ).bind(dateStr).first();

    const revenue = await env.DB.prepare(
      "SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE DATE(created_at) = ? AND status = 'succeeded'"
    ).bind(dateStr).first();

    await env.DB.prepare(`
      INSERT OR REPLACE INTO daily_stats (date, new_users, total_generations, total_revenue)
      VALUES (?, ?, ?, ?)
    `).bind(dateStr, newUsers.count, generations.count, revenue.total).run();
  }
}
```

---

## 📈 Reports & Exports

### Export Transactions

```tsx
// Add button in admin UI
<Button onClick={handleExportTransactions}>
  <Download className="mr-2 h-4 w-4" />
  Export Transactions
</Button>;

// API endpoint
if (
  url.pathname === "/api/admin/export/transactions" &&
  request.method === "GET"
) {
  const adminCheck = await requireAdmin(request, env);
  if (adminCheck instanceof Response) return adminCheck;

  const { results } = await env.DB.prepare(
    `
    SELECT 
      ct.id,
      u.email,
      ct.type,
      ct.amount,
      ct.balance_after,
      ct.description,
      ct.created_at
    FROM credit_transactions ct
    JOIN users u ON ct.user_id = u.id
    ORDER BY ct.created_at DESC
  `,
  ).all();

  const csv = [
    "ID,User Email,Type,Amount,Balance After,Description,Date",
    ...results.map(
      (t) =>
        `${t.id},${t.email},${t.type},${t.amount},${t.balance_after},"${t.description}",${t.created_at}`,
    ),
  ].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="transactions_${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
```

---

## 🔔 Monitoring & Alerts

### Set Up Email Alerts

```typescript
// Check for suspicious activity
async function checkForAnomalies(env: Env) {
  // High usage in short time
  const { results } = await env.DB.prepare(
    `
    SELECT user_id, COUNT(*) as count
    FROM ai_generations
    WHERE created_at >= datetime('now', '-1 hour')
    GROUP BY user_id
    HAVING count > 50
  `,
  ).all();

  if (results.length > 0) {
    // Send alert email (integrate with SendGrid, Mailgun, etc.)
    console.warn("High usage detected:", results);
  }

  // Failed payments
  const failedPayments = await env.DB.prepare(
    `
    SELECT COUNT(*) as count
    FROM payments
    WHERE status = 'failed' AND created_at >= datetime('now', '-1 day')
  `,
  ).first();

  if (failedPayments.count > 10) {
    console.warn("High number of failed payments:", failedPayments.count);
  }
}

// Call periodically or via cron
```

### Logging Best Practices

```typescript
// Log important events
await env.DB.prepare(
  `
  INSERT INTO activity_logs (user_id, action, details, ip_address)
  VALUES (?, ?, ?, ?)
`,
)
  .bind(
    user.id,
    "purchase",
    JSON.stringify({ amount: 100, credits: 1500 }),
    request.headers.get("cf-connecting-ip"),
  )
  .run();
```

---

## 📚 Quick Reference

### Admin API Endpoints

| Endpoint                         | Method | Description               |
| -------------------------------- | ------ | ------------------------- |
| `/api/admin/users`               | GET    | List all users with stats |
| `/api/admin/users/:id`           | GET    | Get user details          |
| `/api/admin/credits/grant`       | POST   | Grant/remove credits      |
| `/api/admin/stats`               | GET    | Platform statistics       |
| `/api/admin/export/users`        | GET    | Export users CSV          |
| `/api/admin/export/transactions` | GET    | Export transactions CSV   |

### Database Queries

**Total revenue this month:**

```sql
SELECT SUM(amount) as revenue
FROM payments
WHERE status = 'succeeded'
AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now');
```

**Top 10 users by spending:**

```sql
SELECT u.email, SUM(p.amount) as total
FROM users u
JOIN payments p ON u.id = p.user_id
WHERE p.status = 'succeeded'
GROUP BY u.id
ORDER BY total DESC
LIMIT 10;
```

**Average credits per user:**

```sql
SELECT AVG(credits) as avg_credits FROM users;
```

---

## ✅ Implementation Checklist

- [ ] Add tracking tables to schema
- [ ] Run database migration
- [ ] Implement admin API endpoints
- [ ] Create admin dashboard page
- [ ] Add logging to AI generation endpoint
- [ ] Add logging to payment webhook
- [ ] Set up daily stats cron job
- [ ] Implement CSV export functions
- [ ] Add monitoring alerts
- [ ] Test all admin features
- [ ] Restrict admin routes to admin users only

---

**Next Steps:**

1. Run the database migration
2. Implement admin API endpoints
3. Create admin UI pages
4. Test with sample data
5. Set up monitoring and alerts

For questions or issues, refer to the database schema section or check existing API patterns in the codebase.
