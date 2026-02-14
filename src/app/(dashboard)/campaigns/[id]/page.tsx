"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { apiClient } from "@/lib/api";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

interface Campaign {
  id: string;
  name: string;
  product_id: string;
  product_name: string;
  promotion_platform: string;
  budget: number;
  content_type: string;
  start_date: number;
  end_date?: number;
  status: string;
  created_at: number;
  description?: string;
  target_audience?: string;
  hashtags?: string;
}

interface CampaignAnalytics {
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  totalCommission: number;
  totalCost: number;
  roi: number;
  conversionRate: number;
  averageCPC: number;
}

export default function CampaignDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { token } = useAuthStore();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      apiClient.setToken(token);
      loadCampaignData();
    }
  }, [token, params.id]);

  const loadCampaignData = async () => {
    try {
      setLoading(true);

      // Load campaign details and analytics
      const [campaignResponse, analyticsResponse] = await Promise.all([
        apiClient.getCampaigns(),
        fetch(
          `${apiClient["API_BASE_URL"] || "http://127.0.0.1:8787"}/api/analytics/campaign?campaignId=${params.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ).then((r) => (r.ok ? r.json() : null)),
      ]);

      const campaignData = campaignResponse.campaigns.find(
        (c: Campaign) => c.id === params.id,
      );
      setCampaign(campaignData || null);
      setAnalytics(analyticsResponse || null);
    } catch (err: any) {
      console.error("Failed to load campaign:", err);
      setError(err.message || "Failed to load campaign data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;

    try {
      await apiClient.deleteCampaign(params.id);
      router.push("/campaigns");
    } catch (err: any) {
      alert("Failed to delete campaign: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-destructive mb-4">
                {error || "Campaign not found"}
              </p>
              <Button onClick={() => router.push("/campaigns")}>
                Go to Campaigns
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">{campaign.name}</h1>
            <p className="text-muted-foreground">
              Campaign Details & Analytics
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/campaigns/${params.id}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Campaign Info */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Campaign Information</CardTitle>
                <CardDescription>Details about this campaign</CardDescription>
              </div>
              <Badge
                variant={campaign.status === "active" ? "default" : "outline"}
              >
                {campaign.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Product</p>
                <p className="font-medium">{campaign.product_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Platform</p>
                <p className="font-medium">{campaign.promotion_platform}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Content Type</p>
                <p className="font-medium">{campaign.content_type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="font-medium">
                  ${campaign.budget.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-medium">
                  {format(new Date(campaign.start_date * 1000), "MMM d, yyyy")}
                </p>
              </div>
              {campaign.end_date && (
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-medium">
                    {format(new Date(campaign.end_date * 1000), "MMM d, yyyy")}
                  </p>
                </div>
              )}
            </div>

            {campaign.description && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Description
                  </p>
                  <p>{campaign.description}</p>
                </div>
              </>
            )}

            {campaign.target_audience && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Target Audience
                </p>
                <p>{campaign.target_audience}</p>
              </div>
            )}

            {campaign.hashtags && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Hashtags</p>
                <p className="text-primary">{campaign.hashtags}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analytics */}
        {analytics && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Total Clicks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics.totalClicks.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    Conversions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics.totalConversions}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.conversionRate.toFixed(2)}% rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    Commission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${analytics.totalCommission.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ${analytics.totalRevenue.toLocaleString()} revenue
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    ROI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics.roi.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ${analytics.totalCost.toLocaleString()} spent
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Avg. Cost Per Click
                    </p>
                    <p className="text-lg font-semibold">
                      ${analytics.averageCPC.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Conversion Rate
                    </p>
                    <p className="text-lg font-semibold">
                      {analytics.conversionRate.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Return on Investment
                    </p>
                    <p
                      className={`text-lg font-semibold ${analytics.roi > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {analytics.roi > 0 ? "+" : ""}
                      {analytics.roi.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
