"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { apiClient } from "@/lib/api";
import { ArrowLeft, Save, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  description?: string;
  target_audience?: string;
  hashtags?: string;
}

export default function EditCampaignPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    promotion_platform: "",
    content_type: "",
    budget: "",
    start_date: "",
    end_date: "",
    status: "active",
    description: "",
    target_audience: "",
    hashtags: "",
  });

  useEffect(() => {
    if (token) {
      apiClient.setToken(token);
      loadCampaign();
    }
  }, [token, params.id]);

  const loadCampaign = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getCampaigns();
      const campaignData = response.campaigns.find(
        (c: Campaign) => c.id === params.id,
      );

      if (campaignData) {
        setCampaign(campaignData);
        setFormData({
          name: campaignData.name,
          promotion_platform: campaignData.promotion_platform,
          content_type: campaignData.content_type,
          budget: campaignData.budget.toString(),
          start_date: format(
            new Date(campaignData.start_date * 1000),
            "yyyy-MM-dd",
          ),
          end_date: campaignData.end_date
            ? format(new Date(campaignData.end_date * 1000), "yyyy-MM-dd")
            : "",
          status: campaignData.status,
          description: campaignData.description || "",
          target_audience: campaignData.target_audience || "",
          hashtags: campaignData.hashtags || "",
        });
      }
    } catch (err: any) {
      console.error("Failed to load campaign:", err);
      alert("Failed to load campaign");
      router.push("/campaigns");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.budget || !formData.start_date) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setSaving(true);

      await apiClient.updateCampaign(params.id as string, {
        name: formData.name,
        promotion_platform: formData.promotion_platform,
        content_type: formData.content_type,
        budget: parseFloat(formData.budget),
        start_date: Math.floor(new Date(formData.start_date).getTime() / 1000),
        end_date: formData.end_date
          ? Math.floor(new Date(formData.end_date).getTime() / 1000)
          : undefined,
        status: formData.status,
        description: formData.description,
        target_audience: formData.target_audience,
        hashtags: formData.hashtags,
      });

      router.push(`/campaigns/${params.id}`);
    } catch (err: any) {
      console.error("Failed to update campaign:", err);
      alert("Failed to update campaign: " + err.message);
    } finally {
      setSaving(false);
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

  if (!campaign) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-destructive mb-4">Campaign not found</p>
            <Button onClick={() => router.push("/campaigns")}>
              Go to Campaigns
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Edit Campaign</CardTitle>
            <CardDescription>
              Update campaign details and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Campaign Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Summer Product Launch"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="product">Product</Label>
                  <Input
                    id="product"
                    value={campaign.product_name}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Product cannot be changed after creation
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="platform">Promotion Platform *</Label>
                    <Select
                      value={formData.promotion_platform}
                      onValueChange={(value) =>
                        setFormData({ ...formData, promotion_platform: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="TikTok">TikTok</SelectItem>
                        <SelectItem value="YouTube">YouTube</SelectItem>
                        <SelectItem value="Twitter">Twitter</SelectItem>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                        <SelectItem value="Blog">Blog</SelectItem>
                        <SelectItem value="Email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="content_type">Content Type *</Label>
                    <Select
                      value={formData.content_type}
                      onValueChange={(value) =>
                        setFormData({ ...formData, content_type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Video">Video</SelectItem>
                        <SelectItem value="Image">Image</SelectItem>
                        <SelectItem value="Story">Story</SelectItem>
                        <SelectItem value="Article">Article</SelectItem>
                        <SelectItem value="Review">Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget">Budget (USD) *</Label>
                    <Input
                      id="budget"
                      type="number"
                      step="0.01"
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData({ ...formData, budget: e.target.value })
                      }
                      placeholder="1000"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Start Date *</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="end_date">End Date (Optional)</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Campaign goals and strategy..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="target_audience">Target Audience</Label>
                  <Input
                    id="target_audience"
                    value={formData.target_audience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        target_audience: e.target.value,
                      })
                    }
                    placeholder="e.g. Tech enthusiasts, 25-35, urban"
                  />
                </div>

                <div>
                  <Label htmlFor="hashtags">Hashtags</Label>
                  <Input
                    id="hashtags"
                    value={formData.hashtags}
                    onChange={(e) =>
                      setFormData({ ...formData, hashtags: e.target.value })
                    }
                    placeholder="#affiliate #tech #gadgets"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? (
                    <>
                      <div className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
