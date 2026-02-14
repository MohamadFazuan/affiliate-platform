# AI API Setup Guide

Complete guide to set up and integrate AI APIs for video script generation in AffiliateIQ platform.

**Last Updated:** February 14, 2026

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Choosing an AI Provider](#choosing-an-ai-provider)
3. [Cloudflare AI Setup](#cloudflare-ai-setup)
4. [OpenAI Setup](#openai-setup)
5. [Environment Configuration](#environment-configuration)
6. [Implementation Guide](#implementation-guide)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

AffiliateIQ uses AI to generate video scripts for TikTok/social media content. This guide covers:

- Setting up AI API providers
- Configuring environment variables
- Implementing AI services in code
- Best practices and cost optimization

**Supported AI Providers:**

- **Cloudflare AI** (Recommended - Low cost, edge-optimized)
- **OpenAI** (GPT-4, GPT-3.5)
- **Anthropic Claude** (Alternative)

---

## 🤖 Choosing an AI Provider

### Option 1: Cloudflare AI (Recommended)

**Pros:**

- ✅ Built into Cloudflare Workers (no extra API calls)
- ✅ Low cost ($0.011 per 1,000 requests)
- ✅ Edge-optimized (fast response times)
- ✅ No additional billing setup needed
- ✅ Models: Llama 2, Mistral, Codestral, etc.

**Cons:**

- ⚠️ Limited model selection vs OpenAI
- ⚠️ Newer service (less mature)

**Best For:** Cost-effective solution, high-volume usage

### Option 2: OpenAI

**Pros:**

- ✅ GPT-4 and GPT-3.5 Turbo
- ✅ Superior quality and creativity
- ✅ Well-documented API
- ✅ Wide model selection

**Cons:**

- ⚠️ Higher cost ($0.50-$3 per 1M tokens for GPT-4)
- ⚠️ Requires separate API billing
- ⚠️ API calls from Workers (slight latency)

**Best For:** High-quality content generation, complex prompts

---

## ☁️ Cloudflare AI Setup

### Step 1: Enable Cloudflare AI in Your Account

1. **Login to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com/
   - Select your account

2. **Navigate to Workers AI**
   - Click on "Workers & Pages" in sidebar
   - Click on "AI" tab
   - Click "Enable Workers AI"

3. **Accept Terms**
   - Review pricing (Pay-as-you-go)
   - Accept terms of service
   - AI binding is now available

### Step 2: Configure wrangler.toml

Open `wrangler.toml` and add AI binding:

```toml
name = "affiliate-backend"
main = "backend/worker.ts"
compatibility_date = "2024-01-01"

# Add AI binding
[ai]
binding = "AI"

# Database bindings (keep existing)
[[d1_databases]]
binding = "DB"
database_name = "affiliate-db"
database_id = "your-database-id"
```

### Step 3: Update TypeScript Types

Create or update `backend/types.ts`:

```typescript
export interface Env {
  DB: D1Database;
  AI: any; // Cloudflare AI binding
  JWT_SECRET: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
}
```

### Step 4: Test AI Binding

Create a test endpoint in `backend/worker.ts`:

```typescript
// Test AI endpoint
if (url.pathname === "/api/ai/test" && request.method === "POST") {
  try {
    const response = await env.AI.run("@cf/meta/llama-2-7b-chat-int8", {
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Say hello!" },
      ],
    });

    return new Response(JSON.stringify({ success: true, response }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
```

### Step 5: Deploy and Test

```bash
# Deploy to Cloudflare
npm run worker:deploy

# Test the endpoint
curl -X POST https://your-worker.workers.dev/api/ai/test \
  -H "Content-Type: application/json"
```

---

## 🔑 OpenAI Setup

### Step 1: Create OpenAI Account

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to **API Keys**
4. Click **Create new secret key**
5. Copy the key (starts with `sk-...`)

**⚠️ Important:** Save this key securely - you won't see it again!

### Step 2: Add Billing Information

1. Go to **Settings** → **Billing**
2. Add payment method (credit card)
3. Set usage limits (recommended: $10-50/month)
4. Enable email alerts at 50%, 75%, 90%

### Step 3: Configure Environment Variables

#### For Local Development

Create `.dev.vars` file in project root:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=1000

# Other secrets
JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=sk_test_your_stripe_key
```

#### For Production (Cloudflare Workers)

```bash
# Set OpenAI API key
npx wrangler secret put OPENAI_API_KEY
# Enter your key when prompted

# Set model preference
npx wrangler secret put OPENAI_MODEL
# Enter: gpt-3.5-turbo or gpt-4

# Set max tokens
npx wrangler secret put OPENAI_MAX_TOKENS
# Enter: 1000
```

### Step 4: Update TypeScript Types

```typescript
export interface Env {
  DB: D1Database;
  JWT_SECRET: string;

  // OpenAI Configuration
  OPENAI_API_KEY: string;
  OPENAI_MODEL: string;
  OPENAI_MAX_TOKENS: string;

  // Stripe (optional)
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
}
```

### Step 5: Install OpenAI SDK (Optional)

```bash
npm install openai
```

---

## ⚙️ Environment Configuration

### Local Development (.dev.vars)

Create `.dev.vars` in project root:

```env
# === Authentication ===
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# === AI Provider (Choose One) ===

# Option 1: Cloudflare AI (No API key needed, just enable in wrangler.toml)
AI_PROVIDER=cloudflare
CLOUDFLARE_AI_MODEL=@cf/meta/llama-2-7b-chat-int8

# Option 2: OpenAI
# AI_PROVIDER=openai
# OPENAI_API_KEY=sk-your-openai-api-key
# OPENAI_MODEL=gpt-3.5-turbo
# OPENAI_MAX_TOKENS=1500

# === Payment ===
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# === Database ===
# (Configured in wrangler.toml)
```

### Production Secrets (Cloudflare Workers)

Set production secrets using Wrangler CLI:

```bash
# JWT Secret
npx wrangler secret put JWT_SECRET

# If using OpenAI
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put OPENAI_MODEL

# Stripe
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
```

### Verify Secrets

```bash
# List all secrets
npx wrangler secret list
```

---

## 💻 Implementation Guide

### Create AI Service Module

Create `backend/services/ai.ts`:

```typescript
import { Env } from "../types";

export interface ScriptGenerationRequest {
  productName: string;
  productDescription: string;
  category: string;
  targetAudience?: string;
}

export interface ScriptGenerationResponse {
  hook: string;
  script: string;
  cta: string;
  hashtags: string[];
  thumbnailIdeas: string[];
}

export class AIService {
  constructor(private env: Env) {}

  async generateVideoScript(
    request: ScriptGenerationRequest,
  ): Promise<ScriptGenerationResponse> {
    const prompt = this.buildPrompt(request);

    // Use Cloudflare AI
    if (this.env.AI) {
      return this.generateWithCloudflare(prompt);
    }

    // Use OpenAI
    if (this.env.OPENAI_API_KEY) {
      return this.generateWithOpenAI(prompt);
    }

    throw new Error("No AI provider configured");
  }

  private buildPrompt(request: ScriptGenerationRequest): string {
    return `Generate a TikTok video script for an affiliate product.

Product: ${request.productName}
Description: ${request.productDescription}
Category: ${request.category}
Target Audience: ${request.targetAudience || "General"}

Generate the following in JSON format:
{
  "hook": "3-5 second attention-grabbing opening",
  "script": "30-60 second engaging video script with storytelling",
  "cta": "Clear call-to-action",
  "hashtags": ["array", "of", "5-10", "relevant", "hashtags"],
  "thumbnailIdeas": ["3", "thumbnail", "concepts"]
}`;
  }

  private async generateWithCloudflare(
    prompt: string,
  ): Promise<ScriptGenerationResponse> {
    try {
      const response = await this.env.AI.run("@cf/meta/llama-2-7b-chat-int8", {
        messages: [
          {
            role: "system",
            content:
              "You are an expert TikTok content creator and affiliate marketer. Generate engaging, conversion-focused video scripts.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 1000,
        temperature: 0.8,
      });

      // Parse the response
      const generated = response.response || response.result?.response || "";
      return this.parseResponse(generated);
    } catch (error) {
      console.error("Cloudflare AI error:", error);
      throw new Error("Failed to generate script with Cloudflare AI");
    }
  }

  private async generateWithOpenAI(
    prompt: string,
  ): Promise<ScriptGenerationResponse> {
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: this.env.OPENAI_MODEL || "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are an expert TikTok content creator and affiliate marketer. Generate engaging, conversion-focused video scripts in JSON format.",
              },
              { role: "user", content: prompt },
            ],
            max_tokens: parseInt(this.env.OPENAI_MAX_TOKENS || "1500"),
            temperature: 0.8,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const generated = data.choices[0]?.message?.content || "";
      return this.parseResponse(generated);
    } catch (error) {
      console.error("OpenAI error:", error);
      throw new Error("Failed to generate script with OpenAI");
    }
  }

  private parseResponse(text: string): ScriptGenerationResponse {
    try {
      // Try to extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          hook: parsed.hook || "",
          script: parsed.script || "",
          cta: parsed.cta || "",
          hashtags: parsed.hashtags || [],
          thumbnailIdeas: parsed.thumbnailIdeas || [],
        };
      }

      // Fallback: return raw text
      return {
        hook: text.substring(0, 100),
        script: text,
        cta: "Check link in bio!",
        hashtags: ["#affiliate", "#product", "#shopping"],
        thumbnailIdeas: ["Product close-up", "Before/After", "Unboxing"],
      };
    } catch (error) {
      throw new Error("Failed to parse AI response");
    }
  }
}
```

### Add API Endpoint

In `backend/worker.ts`, add:

```typescript
import { AIService } from "./services/ai";

// Generate video script endpoint
if (url.pathname === "/api/ai/generate-script" && request.method === "POST") {
  try {
    // Verify authentication
    const authResult = await authenticate(request, env);
    if (!authResult.valid) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = authResult.user!;

    // Check credits
    if (user.credits < 1) {
      return new Response(JSON.stringify({ error: "Insufficient credits" }), {
        status: 402,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get request body
    const body = await request.json();

    // Generate script
    const aiService = new AIService(env);
    const script = await aiService.generateVideoScript(body);

    // Deduct credit
    await env.DB.prepare("UPDATE users SET credits = credits - 1 WHERE id = ?")
      .bind(user.id)
      .run();

    return new Response(JSON.stringify({ success: true, script }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
```

---

## 🧪 Testing

### Test Cloudflare AI

```bash
# Start local worker
npm run worker:dev

# Test generation
curl -X POST http://localhost:8787/api/ai/generate-script \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productName": "Smart Watch Pro",
    "productDescription": "Fitness tracker with heart rate monitor",
    "category": "Electronics",
    "targetAudience": "Fitness enthusiasts"
  }'
```

### Test OpenAI

Same curl command - the service will automatically use OpenAI if configured.

### Monitor Costs

**Cloudflare AI:**

- Dashboard → Workers & Pages → AI → Usage

**OpenAI:**

- Platform.openai.com → Usage

---

## 🐛 Troubleshooting

### Cloudflare AI Not Working

**Error:** `AI binding not found`

- **Solution:** Ensure `[ai] binding = "AI"` is in wrangler.toml
- **Solution:** Redeploy: `npm run worker:deploy`

**Error:** `Model not found`

- **Solution:** Check available models: https://developers.cloudflare.com/workers-ai/models/
- **Solution:** Use correct model name (e.g., `@cf/meta/llama-2-7b-chat-int8`)

### OpenAI Errors

**Error:** `401 Unauthorized`

- **Solution:** Check API key is correct
- **Solution:** Verify key is active in OpenAI dashboard

**Error:** `429 Rate limit exceeded`

- **Solution:** Implement rate limiting in your app
- **Solution:** Upgrade OpenAI tier

**Error:** `Insufficient credits`

- **Solution:** Add funds to OpenAI account

### General Issues

**Response is not JSON:**

- Improve prompt to explicitly request JSON format
- Add JSON parsing fallbacks
- Log raw responses for debugging

**Slow response times:**

- Use Cloudflare AI for faster edge responses
- Implement caching for repeated requests
- Reduce max_tokens parameter

---

## 💰 Cost Optimization Tips

1. **Use Cloudflare AI for high volume** - Much cheaper than OpenAI
2. **Cache common requests** - Same product = same script (with variations)
3. **Set max token limits** - Prevent excessive usage
4. **Rate limit API calls** - Per user/IP limits
5. **Monitor usage dashboards** - Set alerts for unusual spikes
6. **Use GPT-3.5 instead of GPT-4** - 10x cheaper for most use cases

---

## 📚 Additional Resources

- [Cloudflare Workers AI Documentation](https://developers.cloudflare.com/workers-ai/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [OpenAI Pricing](https://openai.com/pricing)
- [Cloudflare AI Pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)

---

**Next Steps:**

1. Choose your AI provider
2. Follow the setup steps above
3. Configure environment variables
4. Test the integration
5. Monitor usage and costs
6. Optimize based on performance

For questions or issues, refer to the troubleshooting section or check the official provider documentation.
