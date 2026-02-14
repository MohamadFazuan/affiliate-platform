-- Migration to add Stripe fields to users table
-- Run this if you already have a users table

-- Add Stripe fields
ALTER TABLE users ADD COLUMN stripe_customer_id TEXT;
ALTER TABLE users ADD COLUMN stripe_subscription_id TEXT;
ALTER TABLE users ADD COLUMN last_payment_at INTEGER;

-- Add past_due status option (SQLite doesn't support modifying CHECK constraints)
-- You may need to recreate the table if the CHECK constraint needs updating

-- Create index for Stripe customer lookups
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);
