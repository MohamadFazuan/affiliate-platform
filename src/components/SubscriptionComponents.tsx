"use client";

import { useAuthStore } from "@/lib/store";
import { Crown, Zap, Rocket, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const SUBSCRIPTION_TIERS = {
  free: {
    name: "Free",
    icon: Zap,
    color: "text-gray-500",
    limits: {
      campaigns: 5,
      products: 50,
      analytics: 30, // days
    },
  },
  pro: {
    name: "Pro",
    icon: Crown,
    color: "text-blue-500",
    price: "$29/month",
    limits: {
      campaigns: 50,
      products: 500,
      analytics: 90, // days
    },
  },
  enterprise: {
    name: "Enterprise",
    icon: Rocket,
    color: "text-purple-500",
    price: "$199/month",
    limits: {
      campaigns: -1, // unlimited
      products: -1,
      analytics: 365,
    },
  },
};

export function SubscriptionBanner() {
  const { user } = useAuthStore();
  const tier = user?.subscription_tier || "free";
  const tierInfo = SUBSCRIPTION_TIERS[tier as keyof typeof SUBSCRIPTION_TIERS];

  if (tier === "enterprise" || tier === "pro") {
    return null; // Don't show banner for paid users
  }

  return (
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
      <div className="container py-3 px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Crown className="h-4 w-4 text-primary" />
          <span className="font-medium">
            You're on the <strong>Free</strong> plan
          </span>
          <span className="hidden sm:inline text-muted-foreground">
            • Limited to 5 campaigns
          </span>
        </div>
        <Button asChild size="sm" className="w-full sm:w-auto">
          <Link href="/settings?tab=billing">Upgrade to Pro</Link>
        </Button>
      </div>
    </div>
  );
}

export function SubscriptionCard() {
  const { user } = useAuthStore();
  const tier = user?.subscription_tier || "free";
  const tierInfo = SUBSCRIPTION_TIERS[tier as keyof typeof SUBSCRIPTION_TIERS];
  const Icon = tierInfo.icon;

  // Mock usage data (in real app, fetch from API)
  const usage = {
    campaigns: 3,
    products: 42,
  };

  const getCampaignProgress = () => {
    if (tierInfo.limits.campaigns === -1) return 100;
    return (usage.campaigns / tierInfo.limits.campaigns) * 100;
  };

  const getProductProgress = () => {
    if (tierInfo.limits.products === -1) return 100;
    return (usage.products / tierInfo.limits.products) * 100;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-primary/10`}>
              <Icon className={`h-5 w-5 ${tierInfo.color}`} />
            </div>
            <div>
              <CardTitle className="text-lg">{tierInfo.name} Plan</CardTitle>
              <CardDescription>
                {tierInfo.price || "Free forever"}
              </CardDescription>
            </div>
          </div>
          {tier === "free" && (
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Trial
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {tier !== "enterprise" && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Campaigns</span>
                <span className="font-medium">
                  {usage.campaigns} / {tierInfo.limits.campaigns}
                </span>
              </div>
              <Progress value={getCampaignProgress()} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Products Tracked</span>
                <span className="font-medium">
                  {usage.products} / {tierInfo.limits.products}
                </span>
              </div>
              <Progress value={getProductProgress()} className="h-2" />
            </div>
          </>
        )}
        {tier === "enterprise" && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              ✨ Unlimited campaigns and products
            </p>
          </div>
        )}
      </CardContent>
      {tier === "free" && (
        <CardFooter>
          <Button asChild className="w-full" size="sm">
            <Link href="/settings?tab=billing">
              <Crown className="mr-2 h-4 w-4" />
              Upgrade Now
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export function PricingCards() {
  const { user } = useAuthStore();
  const currentTier = user?.subscription_tier || "free";

  const plans = [
    {
      name: "Free",
      tier: "free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "5 active campaigns",
        "50 products tracked",
        "30 days analytics",
        "Email support",
        "Basic AI recommendations",
      ],
      cta: "Current Plan",
      highlighted: false,
    },
    {
      name: "Pro",
      tier: "pro",
      price: "$29",
      period: "per month",
      description: "For serious affiliates",
      features: [
        "50 active campaigns",
        "500 products tracked",
        "90 days analytics",
        "Priority support",
        "Advanced AI insights",
        "Custom reports",
        "API access",
        "Bulk operations",
      ],
      cta: "Upgrade to Pro",
      highlighted: true,
    },
    {
      name: "Enterprise",
      tier: "enterprise",
      price: "$199",
      period: "per month",
      description: "For teams and agencies",
      features: [
        "Unlimited campaigns",
        "Unlimited products",
        "365 days analytics",
        "24/7 dedicated support",
        "White-label options",
        "Custom integrations",
        "Team collaboration",
        "Advanced automation",
        "Custom AI models",
        "SOC 2 compliance",
      ],
      cta: "Upgrade to Enterprise",
      highlighted: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {plans.map((plan) => {
        const Icon =
          SUBSCRIPTION_TIERS[plan.tier as keyof typeof SUBSCRIPTION_TIERS].icon;
        const isCurrentPlan = currentTier === plan.tier;

        return (
          <Card
            key={plan.tier}
            className={`relative flex flex-col ${
              plan.highlighted ? "border-primary shadow-lg scale-105" : ""
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary px-3 py-1">Most Popular</Badge>
              </div>
            )}
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg bg-primary/10`}>
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-bold">
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {plan.period}
                </span>
              </div>
              <CardDescription className="text-sm">
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow pb-4">
              <ul className="space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild={!isCurrentPlan}
                className="w-full"
                variant={isCurrentPlan ? "outline" : "default"}
                disabled={isCurrentPlan}
              >
                {isCurrentPlan ? (
                  <span>{plan.cta}</span>
                ) : (
                  <Link href="/settings?tab=billing">{plan.cta}</Link>
                )}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
