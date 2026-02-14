// Cloudflare Worker - Main Entry Point
// Modular, clean architecture for affiliate platform API

import { Env } from "./types";
import { authenticate } from "./middleware/auth";
import { registerUser, loginUser } from "./services/auth";
import { getProducts, getProductById } from "./services/products";
import {
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from "./services/campaigns";
import {
  recordSale,
  getSales,
  getSalesStats,
  getTopCampaignsBySales,
  updateSale,
  deleteSale,
} from "./services/sales";
import {
  getDashboardAnalytics,
  getCampaignAnalytics,
} from "./services/analytics";
import { getGoal, setGoal } from "./services/goals";
import { crawlProduct } from "./services/crawler";
import {
  getProductRecommendations,
  getTrendingProducts,
  getSimilarProducts,
} from "./services/recommendations";
import {
  createCheckoutSession,
  createPortalSession,
  getSubscription,
  getCustomer,
  cancelSubscription,
  listInvoices,
  handleWebhookEvent,
  getStripeClient,
} from "./services/stripe";

// CORS Headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Helper Functions
function jsonResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
}

// Main Request Handler
async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // Handle CORS preflight
  if (method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Public endpoints (no auth required)
  if (path === "/api/auth/register" && method === "POST") {
    const { email, password } = await request.json();
    const result = await registerUser(email, password, env);

    if (!result.success) {
      return jsonResponse({ error: result.error }, 400);
    }

    return jsonResponse({ token: result.token, user: result.user });
  }

  if (path === "/api/auth/login" && method === "POST") {
    const { email, password } = await request.json();
    const result = await loginUser(email, password, env);

    if (!result.success) {
      return jsonResponse({ error: result.error }, 401);
    }

    return jsonResponse({ token: result.token, user: result.user });
  }

  // Stripe webhook endpoint (no auth required)
  if (path === "/api/stripe/webhook" && method === "POST") {
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return jsonResponse({ error: "Missing signature" }, 400);
    }

    try {
      const stripe = getStripeClient(env);
      const body = await request.text();
      const event = stripe.webhooks.constructEvent(
        body,
        signature,
        env.STRIPE_WEBHOOK_SECRET,
      );

      await handleWebhookEvent(event, env.DB);

      return jsonResponse({ received: true });
    } catch (error: any) {
      console.error("Webhook error:", error);
      return jsonResponse({ error: error.message }, 400);
    }
  }

  // Protected endpoints - require authentication
  const authResult = await authenticate(request, env);

  if (!authResult.authorized) {
    return authResult.response!;
  }

  const user = authResult.user!;

  // Products endpoints
  if (path === "/api/products" && method === "GET") {
    const filters = {
      category: url.searchParams.get("category") || undefined,
      platform: url.searchParams.get("platform") || undefined,
      sortBy: url.searchParams.get("sortBy") || undefined,
      limit: parseInt(url.searchParams.get("limit") || "50"),
    };

    const products = await getProducts(filters, env);
    return jsonResponse({ products });
  }

  if (path.startsWith("/api/products/") && method === "GET") {
    const segments = path.split("/");
    const productId = segments[3];

    // Check if it's a similar products request
    if (segments[4] === "similar") {
      const limit = parseInt(url.searchParams.get("limit") || "5");
      const similarProducts = await getSimilarProducts(productId, limit, env);
      return jsonResponse({ products: similarProducts });
    }

    // Otherwise get single product
    const product = await getProductById(productId, env);

    if (!product) {
      return jsonResponse({ error: "Product not found" }, 404);
    }

    return jsonResponse({ product });
  }

  // Product recommendations endpoints
  if (path === "/api/products/recommendations" && method === "GET") {
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const recommendations = await getProductRecommendations(
      user.id,
      limit,
      env,
    );
    return jsonResponse({ products: recommendations });
  }

  if (path === "/api/products/trending" && method === "GET") {
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const trending = await getTrendingProducts(limit, env);
    return jsonResponse({ products: trending });
  }

  // Campaigns endpoints
  if (path === "/api/campaigns" && method === "GET") {
    const campaigns = await getCampaigns(user.id, env);
    return jsonResponse({ campaigns });
  }

  if (path === "/api/campaigns" && method === "POST") {
    const data = await request.json();
    const campaign = await createCampaign(user.id, data, env);
    return jsonResponse({ campaign });
  }

  if (path.startsWith("/api/campaigns/") && method === "PUT") {
    const campaignId = path.split("/")[3];
    const data = await request.json();
    const success = await updateCampaign(campaignId, user.id, data, env);
    return jsonResponse({ success });
  }

  if (path.startsWith("/api/campaigns/") && method === "DELETE") {
    const campaignId = path.split("/")[3];
    await deleteCampaign(campaignId, user.id, env);
    return jsonResponse({ success: true });
  }

  // AI Crawler endpoint
  if (path === "/api/crawler/analyze" && method === "POST") {
    const { url } = await request.json();
    const result = await crawlProduct({ url, userId: user.id }, env);

    if (!result.success) {
      return jsonResponse({ error: result.error }, 400);
    }

    return jsonResponse({ success: true, product: result.product });
  }

  // Sales/Analytics endpoints
  if (path === "/api/sales" && method === "GET") {
    const filter = {
      campaign_id: url.searchParams.get("campaignId") || undefined,
      date_from: url.searchParams.get("dateFrom")
        ? parseInt(url.searchParams.get("dateFrom")!)
        : undefined,
      date_to: url.searchParams.get("dateTo")
        ? parseInt(url.searchParams.get("dateTo")!)
        : undefined,
    };
    const sales = await getSales(user.id, filter, env);
    return jsonResponse({ sales });
  }

  if (path === "/api/sales" && method === "POST") {
    const data = await request.json();
    const result = await recordSale(user.id, data, env);

    if (!result.success) {
      return jsonResponse({ error: result.error }, 400);
    }

    return jsonResponse({ success: true, sale: { id: result.id } });
  }

  if (path.startsWith("/api/sales/") && method === "PUT") {
    const saleId = path.split("/")[3];
    const data = await request.json();
    const result = await updateSale(saleId, user.id, data, env);

    if (!result.success) {
      return jsonResponse({ error: result.error }, 400);
    }

    return jsonResponse({ success: true });
  }

  if (path.startsWith("/api/sales/") && method === "DELETE") {
    const saleId = path.split("/")[3];
    const result = await deleteSale(saleId, user.id, env);

    if (!result.success) {
      return jsonResponse({ error: result.error }, 400);
    }

    return jsonResponse({ success: true });
  }

  if (path === "/api/sales/stats" && method === "GET") {
    const filter = {
      campaign_id: url.searchParams.get("campaignId") || undefined,
      date_from: url.searchParams.get("dateFrom")
        ? parseInt(url.searchParams.get("dateFrom")!)
        : undefined,
      date_to: url.searchParams.get("dateTo")
        ? parseInt(url.searchParams.get("dateTo")!)
        : undefined,
    };
    const stats = await getSalesStats(user.id, filter, env);
    return jsonResponse(stats);
  }

  if (path === "/api/sales/top-campaigns" && method === "GET") {
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const topCampaigns = await getTopCampaignsBySales(user.id, limit, env);
    return jsonResponse({ campaigns: topCampaigns });
  }

  if (path === "/api/analytics/dashboard" && method === "GET") {
    const dashboard = await getDashboardAnalytics(user.id, env);
    return jsonResponse(dashboard);
  }

  if (path === "/api/analytics/campaign" && method === "GET") {
    const campaignId = url.searchParams.get("campaignId");

    if (!campaignId) {
      return jsonResponse({ error: "Campaign ID required" }, 400);
    }

    const analytics = await getCampaignAnalytics(campaignId, user.id, env);

    if (!analytics) {
      return jsonResponse({ error: "Campaign not found" }, 404);
    }

    return jsonResponse(analytics);
  }

  // Goals endpoints
  if (path === "/api/goals" && method === "GET") {
    const goal = await getGoal(user.id, env);
    return jsonResponse({ goal });
  }

  if (path === "/api/goals" && method === "POST") {
    const { monthly_income_goal } = await request.json();
    const goal = await setGoal(user.id, monthly_income_goal, env);
    return jsonResponse({ success: true, goal });
  }

  // Billing endpoints
  if (path === "/api/billing/checkout-session" && method === "POST") {
    const { priceId, tier } = await request.json();

    if (!priceId || !tier) {
      return jsonResponse({ error: "Price ID and tier required" }, 400);
    }

    if (!["pro", "enterprise"].includes(tier)) {
      return jsonResponse({ error: "Invalid tier" }, 400);
    }

    try {
      const session = await createCheckoutSession(
        user.id,
        user.email,
        priceId,
        tier as "pro" | "enterprise",
        env,
      );
      return jsonResponse(session);
    } catch (error: any) {
      return jsonResponse({ error: error.message }, 500);
    }
  }

  if (path === "/api/billing/portal-session" && method === "POST") {
    if (!user.stripe_customer_id) {
      return jsonResponse({ error: "No active subscription" }, 400);
    }

    try {
      const session = await createPortalSession(user.stripe_customer_id, env);
      return jsonResponse(session);
    } catch (error: any) {
      return jsonResponse({ error: error.message }, 500);
    }
  }

  if (path === "/api/billing/subscription" && method === "GET") {
    if (!user.stripe_subscription_id) {
      return jsonResponse({ subscription: null });
    }

    try {
      const subscription = await getSubscription(
        user.stripe_subscription_id,
        env,
      );
      return jsonResponse({ subscription });
    } catch (error: any) {
      return jsonResponse({ error: error.message }, 500);
    }
  }

  if (path === "/api/billing/invoices" && method === "GET") {
    if (!user.stripe_customer_id) {
      return jsonResponse({ invoices: [] });
    }

    try {
      const invoices = await listInvoices(user.stripe_customer_id, 10, env);
      return jsonResponse({ invoices });
    } catch (error: any) {
      return jsonResponse({ error: error.message }, 500);
    }
  }

  if (path === "/api/billing/cancel" && method === "POST") {
    if (!user.stripe_subscription_id) {
      return jsonResponse({ error: "No active subscription" }, 400);
    }

    try {
      const subscription = await cancelSubscription(
        user.stripe_subscription_id,
        env,
      );
      return jsonResponse({ success: true, subscription });
    } catch (error: any) {
      return jsonResponse({ error: error.message }, 500);
    }
  }

  // 404 handler
  return jsonResponse({ error: "Not found" }, 404);
}

// Worker Export
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      return await handleRequest(request, env);
    } catch (error) {
      console.error("Worker error:", error);
      return jsonResponse({ error: "Internal server error" }, 500);
    }
  },
};
