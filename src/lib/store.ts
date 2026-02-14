import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  role: string;
  subscription_tier?: string;
  trial_ends_at?: number;
  subscription_status?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  tokenExpiry: number | null;
  isAuthenticated: boolean;
  lastActivity: number;
  login: (token: string, user: User, expiresIn?: number) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  refreshToken: (newToken: string, expiresIn?: number) => void;
  isTokenExpired: () => boolean;
  updateActivity: () => void;
}

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours default

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      tokenExpiry: null,
      isAuthenticated: false,
      lastActivity: Date.now(),

      login: (token, user, expiresIn = TOKEN_EXPIRY) => {
        const tokenExpiry = Date.now() + expiresIn;
        set({
          token,
          user,
          tokenExpiry,
          isAuthenticated: true,
          lastActivity: Date.now(),
        });
      },

      logout: () => {
        set({
          token: null,
          user: null,
          tokenExpiry: null,
          isAuthenticated: false,
          lastActivity: Date.now(),
        });
        // Clear all stored data
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-storage");
        }
      },

      updateUser: (updatedUser) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updatedUser } });
        }
      },

      refreshToken: (newToken, expiresIn = TOKEN_EXPIRY) => {
        const tokenExpiry = Date.now() + expiresIn;
        set({
          token: newToken,
          tokenExpiry,
          lastActivity: Date.now(),
        });
      },

      isTokenExpired: () => {
        const { tokenExpiry, lastActivity } = get();
        const now = Date.now();

        // Check if token has expired
        if (tokenExpiry && now > tokenExpiry) {
          return true;
        }

        // Check if session has timed out due to inactivity
        if (lastActivity && now - lastActivity > SESSION_TIMEOUT) {
          return true;
        }

        return false;
      },

      updateActivity: () => {
        set({ lastActivity: Date.now() });
      },
    }),
    {
      name: "auth-storage",
      // Merge persisted state properly
      merge: (persistedState: any, currentState) => {
        // Validate persisted token is not expired
        if (
          persistedState?.tokenExpiry &&
          Date.now() > persistedState.tokenExpiry
        ) {
          // Token expired, return clean state
          return {
            ...currentState,
            user: null,
            token: null,
            tokenExpiry: null,
            isAuthenticated: false,
          };
        }
        return { ...currentState, ...persistedState };
      },
    },
  ),
);

interface Product {
  id: string;
  name: string;
  category: string;
  platform: string;
  commission: number;
  price: number;
  avg_monthly_sales: number;
  conversion_rate: number;
  competition_level: string;
  rating: number;
  trend_score: number;
  potential_score: number;
  refund_rate: number;
  // Additional fields for UI display
  competition?: string;
  score?: number;
  commission_rate?: number;
  sales_volume?: number;
  image_url?: string;
}

interface ProductStore {
  products: Product[];
  selectedProduct: Product | null;
  filters: {
    category: string;
    platform: string;
    sortBy: string;
  };
  setProducts: (products: Product[]) => void;
  setSelectedProduct: (product: Product | null) => void;
  setFilters: (filters: any) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  selectedProduct: null,
  filters: {
    category: "",
    platform: "",
    sortBy: "potential_score",
  },
  setProducts: (products) => set({ products }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
}));

interface Campaign {
  id: string;
  product_id: string;
  product_name: string;
  name: string;
  promotion_platform: string;
  budget: number;
  status: string;
  created_at: number;
}

interface CampaignStore {
  campaigns: Campaign[];
  setCampaigns: (campaigns: Campaign[]) => void;
  addCampaign: (campaign: Campaign) => void;
  removeCampaign: (id: string) => void;
}

export const useCampaignStore = create<CampaignStore>((set) => ({
  campaigns: [],
  setCampaigns: (campaigns) => set({ campaigns }),
  addCampaign: (campaign) =>
    set((state) => ({
      campaigns: [...state.campaigns, campaign],
    })),
  removeCampaign: (id) =>
    set((state) => ({
      campaigns: state.campaigns.filter((c) => c.id !== id),
    })),
}));

interface DashboardData {
  totalRevenue: number;
  totalCommission: number;
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  roi: number;
  cpa: number;
  revenueOverTime: any[];
  // Additional dashboard metrics
  avgCommission?: number;
  topPlatform?: string;
  topProducts?: any[];
  recentActivities?: any[];
}

interface AnalyticsStore {
  dashboardData: DashboardData | null;
  setDashboardData: (data: DashboardData) => void;
}

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  dashboardData: null,
  setDashboardData: (data) => set({ dashboardData: data }),
}));
