# Test Credentials

## Demo Accounts

Use these credentials to test the application:

### 1. Admin Account

- **Email:** admin@affiliateiq.com
- **Password:** password123
- **Role:** admin

### 2. Demo Account (Recommended)

- **Email:** demo@affiliateiq.com
- **Password:** password123
- **Role:** affiliate
- **Note:** This account has pre-populated campaigns and sales data

### 3. Test Account

- **Email:** test@example.com
- **Password:** password123
- **Role:** affiliate

## Features to Test

### With Demo Account (demo@affiliateiq.com):

- ✅ View Dashboard with pre-populated data
- ✅ Browse 15 sample products
- ✅ See active campaigns
- ✅ View sales analytics
- ✅ Check income goals

### Database Setup

To populate the database with test data:

```bash
# For local development:
npm run db:migrate
npm run db:seed

# For remote/production:
npm run db:migrate:remote
npm run db:seed:remote
```

## Notes

- All test accounts use the same password: `password123`
- The demo account has sample campaigns across TikTok, Instagram, and YouTube
- Sales data spans the last 45 days
- Monthly income goal is set to $5,000 for the demo account
