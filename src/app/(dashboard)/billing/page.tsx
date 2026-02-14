"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { apiClient } from "@/lib/api";
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
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Calendar,
  Download,
  ExternalLink,
  AlertCircle,
  Crown,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";

interface Subscription {
  id: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  trial_end?: number;
  items: {
    data: Array<{
      price: {
        unit_amount: number;
        recurring: {
          interval: string;
        };
      };
    }>;
  };
}

interface Invoice {
  id: string;
  number: string;
  amount_paid: number;
  status: string;
  created: number;
  invoice_pdf: string;
  hosted_invoice_url: string;
}

export default function BillingPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    loadBillingData();
  }, [token]);

  const loadBillingData = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      apiClient.setToken(token);

      const [subResponse, invoicesResponse] = await Promise.all([
        apiClient.getSubscription(),
        apiClient.getInvoices(),
      ]);

      setSubscription(subResponse.subscription || null);
      setInvoices(invoicesResponse.invoices || []);
    } catch (err: any) {
      setError(err.message || "Failed to load billing data");
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    if (!token) return;

    setActionLoading(true);
    try {
      apiClient.setToken(token);
      const { url } = await apiClient.createPortalSession();
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || "Failed to open billing portal");
      setActionLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }

    setActionLoading(true);
    setError(null);

    try {
      apiClient.setToken(token!);
      await apiClient.cancelSubscription();
      await loadBillingData();
    } catch (err: any) {
      setError(err.message || "Failed to cancel subscription");
    } finally {
      setActionLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { variant: any; icon: any; label: string }
    > = {
      active: {
        variant: "default",
        icon: CheckCircle,
        label: "Active",
      },
      trialing: {
        variant: "secondary",
        icon: Crown,
        label: "Trial",
      },
      past_due: {
        variant: "destructive",
        icon: AlertCircle,
        label: "Past Due",
      },
      canceled: {
        variant: "outline",
        icon: XCircle,
        label: "Canceled",
      },
    };

    const config = statusConfig[status] || statusConfig.active;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Billing & Subscription</h1>
          <div className="text-center py-12">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
          <p className="text-muted-foreground">
            Manage your subscription and billing information
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-destructive mb-1">Error</h3>
                  <p className="text-sm text-destructive/90">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Plan */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Current Plan
                  {user?.subscription_tier !== "free" && (
                    <Crown className="w-5 h-5 text-primary" />
                  )}
                </CardTitle>
                <CardDescription>
                  {user?.subscription_tier === "free"
                    ? "You're on the free plan"
                    : "Manage your subscription"}
                </CardDescription>
              </div>
              {subscription && getStatusBadge(subscription.status)}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-semibold text-lg capitalize">
                  {user?.subscription_tier || "Free"} Plan
                </p>
                {subscription && subscription.items.data[0] && (
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(
                      subscription.items.data[0].price.unit_amount,
                    )}{" "}
                    / {subscription.items.data[0].price.recurring.interval}
                  </p>
                )}
              </div>
              {user?.subscription_tier === "free" ? (
                <Button onClick={() => router.push("/pricing")}>
                  Upgrade Plan
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleManageBilling}
                  disabled={actionLoading}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Manage in Stripe
                </Button>
              )}
            </div>

            {subscription && (
              <>
                <Separator />

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Current Period</p>
                      <p className="text-sm text-muted-foreground">
                        {format(
                          new Date(subscription.current_period_start * 1000),
                          "MMM dd, yyyy",
                        )}{" "}
                        -{" "}
                        {format(
                          new Date(subscription.current_period_end * 1000),
                          "MMM dd, yyyy",
                        )}
                      </p>
                    </div>
                  </div>

                  {subscription.trial_end && (
                    <div className="flex items-start gap-3">
                      <Crown className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Trial Ends</p>
                        <p className="text-sm text-muted-foreground">
                          {format(
                            new Date(subscription.trial_end * 1000),
                            "MMM dd, yyyy",
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {subscription.cancel_at_period_end && (
                    <div className="sm:col-span-2">
                      <Card className="border-destructive/50 bg-destructive/5">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                            <div>
                              <p className="font-semibold text-destructive">
                                Subscription Canceling
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Your subscription will be canceled on{" "}
                                {format(
                                  new Date(
                                    subscription.current_period_end * 1000,
                                  ),
                                  "MMMM dd, yyyy",
                                )}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>

                {!subscription.cancel_at_period_end &&
                  subscription.status === "active" && (
                    <>
                      <Separator />
                      <div>
                        <Button
                          variant="destructive"
                          onClick={handleCancelSubscription}
                          disabled={actionLoading}
                        >
                          Cancel Subscription
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          Your subscription will remain active until the end of
                          the current billing period
                        </p>
                      </div>
                    </>
                  )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Payment Method */}
        {subscription && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </CardTitle>
              <CardDescription>
                Manage your payment methods and billing details
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="outline"
                onClick={handleManageBilling}
                disabled={actionLoading}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Update Payment Method
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>
              {invoices.length > 0
                ? "View and download your invoices"
                : "No invoices yet"}
            </CardDescription>
          </CardHeader>
          {invoices.length > 0 && (
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-muted rounded">
                        <Download className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">
                          Invoice #{invoice.number || "Draft"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(
                            new Date(invoice.created * 1000),
                            "MMMM dd, yyyy",
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatCurrency(invoice.amount_paid)}
                        </p>
                        <Badge
                          variant={
                            invoice.status === "paid" ? "default" : "secondary"
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                      <Button size="sm" variant="ghost" asChild>
                        <a
                          href={invoice.invoice_pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Help Section */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Have questions about your subscription or billing?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={() => router.push("/pricing")}>
                View Plans
              </Button>
              <Button variant="outline">Contact Support</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
