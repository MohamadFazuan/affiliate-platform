const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8787";

import { apiCache, withCache } from "./cache";

export class APIClient {
  private token: string | null = null;
  private onTokenExpired?: () => void;
  private onUnauthorized?: () => void;

  setToken(token: string | null) {
    this.token = token;
  }

  setTokenExpiredCallback(callback: () => void) {
    this.onTokenExpired = callback;
  }

  setUnauthorizedCallback(callback: () => void) {
    this.onUnauthorized = callback;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      // Handle 401 Unauthorized
      if (response.status === 401) {
        if (this.onUnauthorized) {
          this.onUnauthorized();
        }
        throw new Error("Unauthorized - Please login again");
      }

      // Handle 403 Forbidden (token expired)
      if (response.status === 403) {
        if (this.onTokenExpired) {
          this.onTokenExpired();
        }
        throw new Error("Session expired - Please login again");
      }

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ error: "Request failed" }));
        throw new Error(
          error.error || `Request failed with status ${response.status}`,
        );
      }

      return response.json();
    } catch (error) {
      // Network errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error - Please check your connection");
      }
      throw error;
    }
  }

  // Auth
  async register(email: string, password: string) {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async login(email: string, password: string) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  // Products
  async getProducts(filters?: {
    category?: string;
    platform?: string;
    sortBy?: string;
    limit?: number;
  }) {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.platform) params.append("platform", filters.platform);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const cacheKey = `products_${params.toString()}`;
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

    const result = await this.request(`/api/products?${params.toString()}`);
    apiCache.set(cacheKey, result, 2 * 60 * 1000); // Cache for 2 minutes
    return result;
  }

  async getProduct(productId: string) {
    const cacheKey = `product_${productId}`;
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

    const result = await this.request(`/api/products/${productId}`);
    apiCache.set(cacheKey, result, 5 * 60 * 1000); // Cache for 5 minutes
    return result;
  }

  async getProductRecommendations(limit: number = 10) {
    return this.request(`/api/products/recommendations?limit=${limit}`);
  }

  async getTrendingProducts(limit: number = 10) {
    return this.request(`/api/products/trending?limit=${limit}`);
  }

  async getSimilarProducts(productId: string, limit: number = 5) {
    return this.request(`/api/products/${productId}/similar?limit=${limit}`);
  }

  // Campaigns
  async getCampaigns() {
    return this.request("/api/campaigns");
  }

  async createCampaign(data: {
    product_id: string;
    name: string;
    promotion_platform: string;
    budget?: number;
    content_type?: string;
    start_date: number;
    end_date?: number;
    description?: string;
    target_audience?: string;
    hashtags?: string;
  }) {
    return this.request("/api/campaigns", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCampaign(campaignId: string, data: any) {
    return this.request(`/api/campaigns/${campaignId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteCampaign(campaignId: string) {
    return this.request(`/api/campaigns/${campaignId}`, {
      method: "DELETE",
    });
  }

  // AI Crawler
  async crawlProduct(url: string) {
    return this.request("/api/crawler/analyze", {
      method: "POST",
      body: JSON.stringify({ url }),
    });
  }

  // Sales
  async recordSale(data: {
    campaign_id: string;
    clicks?: number;
    conversions?: number;
    revenue?: number;
    cost?: number;
  }) {
    return this.request("/api/sales", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Analytics
  async getDashboard() {
    return this.request("/api/analytics/dashboard");
  }

  async getCampaignAnalytics(campaignId: string) {
    return this.request(`/api/analytics/campaign?campaignId=${campaignId}`);
  }

  // Sales
  async recordSale(data: {
    campaign_id: string;
    clicks?: number;
    conversions?: number;
    revenue?: number;
    cost?: number;
  }) {
    return this.request("/api/sales", "POST", data);
  }

  async getSales(filter?: {
    campaignId?: string;
    dateFrom?: number;
    dateTo?: number;
  }) {
    const params = new URLSearchParams();
    if (filter?.campaignId) params.append("campaignId", filter.campaignId);
    if (filter?.dateFrom) params.append("dateFrom", filter.dateFrom.toString());
    if (filter?.dateTo) params.append("dateTo", filter.dateTo.toString());

    return this.request(`/api/sales?${params.toString()}`);
  }

  async updateSale(
    saleId: string,
    data: {
      clicks?: number;
      conversions?: number;
      revenue?: number;
      cost?: number;
    },
  ) {
    return this.request(`/api/sales/${saleId}`, "PUT", data);
  }

  async deleteSale(saleId: string) {
    return this.request(`/api/sales/${saleId}`, "DELETE");
  }

  async getSalesStats(filter?: {
    campaignId?: string;
    dateFrom?: number;
    dateTo?: number;
  }) {
    const params = new URLSearchParams();
    if (filter?.campaignId) params.append("campaignId", filter.campaignId);
    if (filter?.dateFrom) params.append("dateFrom", filter.dateFrom.toString());
    if (filter?.dateTo) params.append("dateTo", filter.dateTo.toString());

    return this.request(`/api/sales/stats?${params.toString()}`);
  }

  async getTopCampaigns(limit: number = 10) {
    return this.request(`/api/sales/top-campaigns?limit=${limit}`);
  }
  async getGoal() {
    return this.request("/api/goals");
  }

  async setGoal(monthlyIncomeGoal: number) {
    return this.request("/api/goals", {
      method: "POST",
      body: JSON.stringify({ monthly_income_goal: monthlyIncomeGoal }),
    });
  }

  // Billing
  async createCheckoutSession(priceId: string, tier: "pro" | "enterprise") {
    return this.request("/api/billing/checkout-session", {
      method: "POST",
      body: JSON.stringify({ priceId, tier }),
    });
  }

  async createPortalSession() {
    return this.request("/api/billing/portal-session", {
      method: "POST",
    });
  }

  async getSubscription() {
    return this.request("/api/billing/subscription");
  }

  async getInvoices() {
    return this.request("/api/billing/invoices");
  }

  async cancelSubscription() {
    return this.request("/api/billing/cancel", {
      method: "POST",
    });
  }
}

export const apiClient = new APIClient();
