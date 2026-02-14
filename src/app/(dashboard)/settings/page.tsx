"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";
import { apiClient } from "@/lib/api";
import { User, Save, CreditCard, Coins, History } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const { user, token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"profile" | "billing">("profile");

  useEffect(() => {
    if (token) {
      apiClient.setToken(token);
    }
  }, [token]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and billing preferences
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <nav className="flex flex-col space-y-1">
            <SettingsLink
              icon={<User />}
              label="Profile"
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
            />
            <SettingsLink
              icon={<CreditCard />}
              label="Billing & Credits"
              active={activeTab === "billing"}
              onClick={() => setActiveTab("billing")}
            />
          </nav>
        </div>

        <div className="md:col-span-3 space-y-8">
          {activeTab === "profile" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Your account details and information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Account Type</Label>
                    <Input
                      id="role"
                      type="text"
                      value={user?.role || ""}
                      disabled
                      className="capitalize"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="credits">Available Credits</Label>
                    <div className="flex items-center gap-2">
                      <Coins className="h-5 w-5 text-yellow-500" />
                      <Input
                        id="credits"
                        type="text"
                        value={(user as any)?.credits || 0}
                        disabled
                        className="font-semibold"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                  <CardDescription>
                    Manage your account settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Save className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700"
                  >
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "billing" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Credit Balance</CardTitle>
                  <CardDescription>
                    Your current credit balance and usage.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Coins className="h-8 w-8 text-yellow-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Available Credits
                        </p>
                        <p className="text-3xl font-bold">
                          {(user as any)?.credits || 0}
                        </p>
                      </div>
                    </div>
                    <Button>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Buy Credits
                    </Button>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p>• Each AI generation costs 1 credit</p>
                    <p>• Credits never expire</p>
                    <p>• New users get 100 free credits</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Purchase Credits</CardTitle>
                  <CardDescription>
                    Choose a credit package that suits your needs.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <PricingCard
                      name="Starter"
                      price="RM 5"
                      credits="50 credits"
                      rate="RM 0.10 per credit"
                    />
                    <PricingCard
                      name="Popular"
                      price="RM 20"
                      credits="250 credits"
                      rate="RM 0.08 per credit"
                      badge="20% Bonus"
                      featured
                    />
                    <PricingCard
                      name="Pro"
                      price="RM 100"
                      credits="1,500 credits"
                      rate="RM 0.067 per credit"
                      badge="Best Value - 33% Bonus"
                    />
                    <PricingCard
                      name="Custom"
                      price="RM 5 - 500"
                      credits="Custom amount"
                      rate="Flexible credits"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    View your credit purchases and usage.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full justify-start">
                    <History className="mr-2 h-4 w-4" />
                    View Full History
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function SettingsLink({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function PricingCard({
  name,
  price,
  credits,
  rate,
  badge,
  featured,
}: {
  name: string;
  price: string;
  credits: string;
  rate: string;
  badge?: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`relative p-6 rounded-lg border-2 transition-all hover:shadow-lg ${
        featured
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50"
      }`}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
          {badge}
        </div>
      )}
      <div className="text-center space-y-4 mt-2">
        <h3 className="text-lg font-semibold">{name}</h3>
        <div className="space-y-1">
          <p className="text-3xl font-bold">{price}</p>
          <p className="text-sm text-muted-foreground">{credits}</p>
        </div>
        <p className="text-xs text-muted-foreground">{rate}</p>
        <Button className="w-full" variant={featured ? "default" : "outline"}>
          Purchase
        </Button>
      </div>
    </div>
  );
}
