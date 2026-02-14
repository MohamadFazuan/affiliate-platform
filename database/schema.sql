-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'affiliate' CHECK (role IN ('affiliate', 'admin')),
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
    trial_ends_at INTEGER,
    subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'canceled', 'expired', 'trialing', 'past_due')),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    last_payment_at INTEGER,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription ON users(subscription_tier);
CREATE INDEX idx_users_stripe_customer ON users(stripe_customer_id);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    platform TEXT NOT NULL,
    commission REAL NOT NULL,
    price REAL NOT NULL,
    avg_monthly_sales INTEGER DEFAULT 0,
    conversion_rate REAL DEFAULT 0,
    competition_level TEXT CHECK (competition_level IN ('Low', 'Medium', 'High')),
    target_age_min INTEGER,
    target_age_max INTEGER,
    target_gender TEXT,
    target_location TEXT,
    interest_tags TEXT,
    refund_rate REAL DEFAULT 0,
    rating REAL DEFAULT 0,
    trend_score REAL DEFAULT 0,
    estimated_cpc REAL,
    estimated_traffic INTEGER DEFAULT 0,
    potential_score REAL DEFAULT 0,
    image_url TEXT,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_platform ON products(platform);
CREATE INDEX idx_products_potential_score ON products(potential_score DESC);
CREATE INDEX idx_products_competition ON products(competition_level);

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    name TEXT NOT NULL,
    promotion_platform TEXT NOT NULL,
    budget REAL DEFAULT 0,
    content_type TEXT,
    start_date INTEGER NOT NULL,
    end_date INTEGER,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_campaigns_product_id ON campaigns(product_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);

-- Sales tracking table
CREATE TABLE IF NOT EXISTS sales (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL,
    date INTEGER NOT NULL,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    revenue REAL DEFAULT 0,
    commission_earned REAL DEFAULT 0,
    cost REAL DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
);

CREATE INDEX idx_sales_campaign_id ON sales(campaign_id);
CREATE INDEX idx_sales_date ON sales(date);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    monthly_income_goal REAL NOT NULL,
    current_month INTEGER NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_goals_user_id ON goals(user_id);

-- API keys / webhook tokens table (for future integrations)
CREATE TABLE IF NOT EXISTS api_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    platform TEXT NOT NULL,
    expires_at INTEGER,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_api_tokens_user_id ON api_tokens(user_id);
CREATE INDEX idx_api_tokens_token ON api_tokens(token);
