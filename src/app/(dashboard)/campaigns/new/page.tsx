"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import {
  Target,
  Calendar,
  DollarSign,
  Tag,
  TrendingUp,
  Upload,
  Save,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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

export default function CreateCampaignPage() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    product_id: "",
    platform: "",
    budget: "",
    content_type: "",
    description: "",
    start_date: "",
    end_date: "",
    target_audience: "",
    hashtags: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (
        !formData.name ||
        !formData.platform ||
        !formData.content_type ||
        !formData.start_date ||
        !formData.budget
      ) {
        alert("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Convert dates to timestamps
      const startDate = Math.floor(
        new Date(formData.start_date).getTime() / 1000,
      );
      const endDate = formData.end_date
        ? Math.floor(new Date(formData.end_date).getTime() / 1000)
        : undefined;

      // Call API
      if (token) {
        apiClient.setToken(token);
      }

      const response = await apiClient.createCampaign({
        name: formData.name,
        product_id: formData.product_id || "prod_001", // Default product if not selected
        promotion_platform: formData.platform,
        budget: parseFloat(formData.budget),
        content_type: formData.content_type,
        start_date: startDate,
        end_date: endDate,
        description: formData.description,
        target_audience: formData.target_audience,
        hashtags: formData.hashtags,
      });

      alert("Campaign created successfully!");
      router.push("/campaigns");
    } catch (err: any) {
      console.error("Campaign creation error:", err);
      alert("Failed to create campaign: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto py-4 sm:py-6 px-4 max-w-4xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Create New Campaign
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Set up your affiliate marketing campaign
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Campaign Details
            </CardTitle>
            <CardDescription>
              Basic information about your campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                placeholder="Summer Sale 2026"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform *</Label>
                <Select
                  value={formData.platform}
                  onValueChange={(value) => handleChange("platform", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="YouTube">YouTube</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Twitter">Twitter/X</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content_type">Content Type *</Label>
                <Select
                  value={formData.content_type}
                  onValueChange={(value) => handleChange("content_type", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Short Video">Short Video</SelectItem>
                    <SelectItem value="Long Video">Long Video</SelectItem>
                    <SelectItem value="Posts">Posts</SelectItem>
                    <SelectItem value="Stories">Stories</SelectItem>
                    <SelectItem value="Reels">Reels</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your campaign strategy..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Budget & Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Budget & Timeline
            </CardTitle>
            <CardDescription>
              Set your budget and campaign duration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget ($) *</Label>
              <Input
                id="budget"
                type="number"
                placeholder="500"
                value={formData.budget}
                onChange={(e) => handleChange("budget", e.target.value)}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleChange("start_date", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date (Optional)</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleChange("end_date", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Targeting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Targeting & Strategy
            </CardTitle>
            <CardDescription>
              Define your target audience and strategy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="target_audience">Target Audience</Label>
              <Input
                id="target_audience"
                placeholder="18-35, Tech Enthusiasts, Urban..."
                value={formData.target_audience}
                onChange={(e) =>
                  handleChange("target_audience", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hashtags">Hashtags</Label>
              <Input
                id="hashtags"
                placeholder="#summer #sale #tech #deals"
                value={formData.hashtags}
                onChange={(e) => handleChange("hashtags", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Separate hashtags with spaces
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Campaign
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
