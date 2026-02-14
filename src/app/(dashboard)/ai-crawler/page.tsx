"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import {
  Sparkles,
  Link as LinkIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Star,
  ExternalLink,
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface CrawledProduct {
  name: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
  platform: string;
  ai_score: number;
  estimated_commission: number;
  competition_level: string;
  market_demand: string;
  recommendation: string;
}

export default function AIProductCrawlerPage() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const [productUrl, setProductUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CrawledProduct | null>(null);
  const [error, setError] = useState("");

  const handleCrawl = async () => {
    if (!productUrl.trim()) {
      setError("Please enter a product URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(productUrl);
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Call real backend API
      const response = await apiClient.crawlProduct(productUrl);

      if (response.success && response.product) {
        setResult(response.product);
      } else {
        throw new Error(response.error || "Failed to analyze product");
      }
    } catch (err: any) {
      console.error("Crawl error:", err);
      setError(err.message || "Failed to analyze product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!result) return;

    try {
      // Product is already saved in backend during crawl
      alert("Product saved successfully! It's now visible to all users.");
      router.push("/products");
    } catch (err: any) {
      setError("Failed to redirect");
    }
  };

  const extractProductName = (url: string): string => {
    const hostname = new URL(url).hostname;
    return `Product from ${hostname}`;
  };

  const detectCategory = (url: string): string => {
    const categories = [
      "Electronics",
      "Fashion",
      "Beauty",
      "Health",
      "Home & Garden",
    ];
    return categories[Math.floor(Math.random() * categories.length)];
  };

  const detectPlatform = (url: string): string => {
    const url_lower = url.toLowerCase();
    if (url_lower.includes("amazon")) return "Amazon";
    if (url_lower.includes("shopee")) return "Shopee";
    if (url_lower.includes("tiktok")) return "TikTok Shop";
    if (url_lower.includes("ebay")) return "eBay";
    return "Other";
  };

  const generateRecommendation = (): string => {
    const recommendations = [
      "High conversion potential based on market trends",
      "Excellent choice for TikTok/Instagram promotion",
      "Strong demand with moderate competition",
      "Trending product with viral potential",
      "Seasonal product - best to promote now",
    ];
    return recommendations[Math.floor(Math.random() * recommendations.length)];
  };

  return (
    <div className="container mx-auto py-4 sm:py-6 px-4 max-w-5xl">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            AI Product Analyzer
          </h1>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground">
          Paste any product URL and let AI analyze its affiliate potential
        </p>
      </div>

      <div className="grid gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              Analyze Product
            </CardTitle>
            <CardDescription>
              Supports Amazon, TikTok Shop, Shopee, eBay, and more
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Product URL</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="url"
                    placeholder="https://www.amazon.com/product/..."
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    className="pl-9"
                    disabled={loading}
                  />
                </div>
                <Button
                  onClick={handleCrawl}
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">✨ AI Features:</p>
              <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                <li>• Automatic product data extraction</li>
                <li>• AI-powered scoring and analysis</li>
                <li>• Market demand prediction</li>
                <li>• Competition level assessment</li>
                <li>• Commission estimation</li>
                <li>• Promotion strategy recommendations</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <Card className="border-primary/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <CardTitle className="text-lg sm:text-xl">
                    Analysis Complete
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-xs sm:text-sm">
                  AI Score: {result.ai_score}/100
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Product Preview */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={result.image_url}
                    alt={result.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-base sm:text-lg">
                    {result.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{result.category}</Badge>
                    <Badge variant="outline">{result.platform}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {result.description}
                  </p>
                </div>
              </div>

              <Separator />

              {/* AI Insights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">AI Score</span>
                    </div>
                    <span className="text-lg font-bold text-primary">
                      {result.ai_score}/100
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">
                        Est. Commission
                      </span>
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      ${result.estimated_commission.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">Price</span>
                    </div>
                    <span className="text-lg font-bold">
                      ${result.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Competition</span>
                    <Badge
                      variant={
                        result.competition_level === "Low"
                          ? "default"
                          : result.competition_level === "High"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {result.competition_level}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* AI Recommendation */}
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI Recommendation
                </p>
                <p className="text-sm text-muted-foreground">
                  {result.recommendation}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleSaveProduct} className="flex-1">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Save to Products
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <a
                    href={productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Original
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="text-sm space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <div>
                  <strong className="text-foreground">Paste Product URL</strong>
                  <p>
                    Copy and paste any product link from supported platforms
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <div>
                  <strong className="text-foreground">AI Analysis</strong>
                  <p>Our AI scrapes data and evaluates affiliate potential</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <div>
                  <strong className="text-foreground">Save & Share</strong>
                  <p>Add to database - visible to all users for discovery</p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
