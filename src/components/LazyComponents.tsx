/**
 * Lazily loaded components for code splitting and performance optimization
 * This reduces the initial bundle size by loading components only when needed
 */

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Lazy load route components
export const LazyProductsPage = dynamic(
  () => import("@/app/(dashboard)/products/page"),
  {
    loading: LoadingSpinner,
    ssr: false, // Disable SSR for client-only components
  },
);

export const LazyCampaignsPage = dynamic(
  () => import("@/app/(dashboard)/campaigns/page"),
  {
    loading: LoadingSpinner,
    ssr: false,
  },
);

export const LazySettingsPage = dynamic(
  () => import("@/app/(dashboard)/settings/page"),
  {
    loading: LoadingSpinner,
    ssr: false,
  },
);

// Lazy load heavy chart components
export const LazyLineChart = dynamic(
  () => import("recharts").then((mod) => mod.LineChart),
  {
    loading: () => <div className="h-[300px] bg-muted animate-pulse rounded" />,
    ssr: false,
  },
);

export const LazyBarChart = dynamic(
  () => import("recharts").then((mod) => mod.BarChart),
  {
    loading: () => <div className="h-[300px] bg-muted animate-pulse rounded" />,
    ssr: false,
  },
);

// Wrapper component with Suspense
export function LazyComponent({
  children,
  fallback = <LoadingSpinner />,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
