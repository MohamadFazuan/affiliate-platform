"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
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
import { Check, Sparkles, Zap, Rocket, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const creditPackages = [
  {
    name: "Starter Pack",
    credits: 50,
    price: 5,
    pricePerCredit: 0.1,
    bonus: 0,
    description: "Perfect for trying out AI content generation",
    icon: Zap,
    color: "text-blue-500",
    popular: false,
  },
  {
    name: "Creator Pack",
    credits: 120,
    price: 10,
    pricePerCredit: 0.08,
    bonus: 20,
    description: "Best value for regular content creators",
    icon: Sparkles,
    color: "text-primary",
    popular: true,
  },
  {
    name: "Pro Pack",
    credits: 350,
    price: 25,
    pricePerCredit: 0.07,
    bonus: 40,
    description: "For power users and agencies",
    icon: Rocket,
    color: "text-purple-500",
    popular: false,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mock user credits - in real implementation, fetch from API
  const userCredits = 100;

  const handlePurchase = async (packageName: string, price: number) => {
    if (!token) {
      router.push("/login?redirect=/pricing");
      return;
    }

    setLoading(packageName);
    setError(null);

    try {
      // TODO: Implement Stripe checkout for credit purchases
      // const response = await apiClient.post("/billing/create-checkout", {
      //   packageName,
      //   price,
      // });

      // For now, show a placeholder
      alert(
        `Credit purchase coming soon! You selected: ${packageName} ($${price})`,
      );

      // if (response.url) {
      //   window.location.href = response.url;
      // }
    } catch (err: any) {
      setError(err.message || "Failed to create checkout session");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge variant="secondary" className="mb-2">
          <Sparkles className="w-3 h-3 mr-1" />
          Credit-Based Pricing
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight">
          Buy Credits, Generate Content
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Simple, transparent pricing. Pay only for what you use.
          <br />1 Credit = 1 AI Content Generation
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Your Balance</p>
            <p className="text-3xl font-bold text-primary">
              {userCredits} Credits
            </p>
          </div>
        </div>
      </div>

      {/* Credit Packages */}
      <div className="grid md:grid-cols-3 gap-8">
        {creditPackages.map((pkg) => {
          const Icon = pkg.icon;
          return (
            <Card
              key={pkg.name}
              className={`relative ${pkg.popular ? "border-primary shadow-lg scale-105" : ""}`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="px-3 py-1">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <div className="mx-auto mb-4">
                  <div
                    className={`w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center ${pkg.color}`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>
                </div>
                <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                <CardDescription className="text-sm mt-2">
                  {pkg.description}
                </CardDescription>
                <div className="pt-4">
                  <div className="text-4xl font-bold">${pkg.price}</div>
                  <div className="text-5xl font-bold text-primary mt-2">
                    {pkg.credits}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Credits</p>
                  {pkg.bonus > 0 && (
                    <Badge variant="secondary" className="mt-2">
                      +{pkg.bonus}% Bonus!
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Price per credit
                    </span>
                    <span className="font-medium">
                      ${pkg.pricePerCredit.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Total generations
                    </span>
                    <span className="font-medium">{pkg.credits} videos</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Credits expire
                    </span>
                    <span className="font-medium text-green-600">Never</span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Full AI script generation</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Video ideas & hooks</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Hashtag suggestions</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Thumbnail ideas</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Copy & download scripts</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  variant={pkg.popular ? "default" : "outline"}
                  onClick={() => handlePurchase(pkg.name, pkg.price)}
                  disabled={loading === pkg.name}
                >
                  {loading === pkg.name
                    ? "Processing..."
                    : `Buy ${pkg.credits} Credits`}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Credits Work</CardTitle>
          <CardDescription>
            Simple and transparent - only pay for what you use
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">✨ What You Get</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>1 credit = 1 complete video script generation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>
                      Includes: Video idea, hooks, full script, CTAs, hashtags,
                      thumbnail ideas
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Credits never expire - use them anytime</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Browse products for free (no credits needed)</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">🎁 New User Bonus</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>
                      <strong>100 FREE credits</strong> when you sign up
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Test the AI with zero risk</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>No credit card required to start</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Do credits expire?</h3>
              <p className="text-sm text-muted-foreground">
                No! Your credits never expire. Buy once and use them whenever
                you want.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I get a refund?</h3>
              <p className="text-sm text-muted-foreground">
                We offer a 7-day money-back guarantee. If you're not satisfied
                with the AI-generated content, contact us for a full refund.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                What if I run out of credits?
              </h3>
              <p className="text-sm text-muted-foreground">
                Simply purchase more credits anytime. You can buy multiple
                packages and stack your credits.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is there a subscription?</h3>
              <p className="text-sm text-muted-foreground">
                No subscriptions or recurring payments. Pay only when you need
                more credits.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
