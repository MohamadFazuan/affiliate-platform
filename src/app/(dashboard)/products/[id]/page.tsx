"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { apiClient } from "@/lib/api";
import {
  ArrowLeft,
  TrendingUp,
  Star,
  DollarSign,
  Users,
  Target,
  AlertCircle,
  Plus,
  ExternalLink,
  Tag,
  BarChart,
  Calendar,
  Percent,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuthStore();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [campaignGoal, setCampaignGoal] = useState("");
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);

  useEffect(() => {
    if (token && params.id) {
      apiClient.setToken(token);
      loadProduct();
      loadSimilarProducts();
    }
  }, [token, params.id]);

  const loadSimilarProducts = async () => {
    try {
      const response = await apiClient.getSimilarProducts(
        params.id as string,
        4,
      );
      setSimilarProducts(response.products || []);
    } catch (err) {
      console.error("Failed to load similar products:", err);
    }
  };

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getProduct(params.id as string);
      setProduct(response.product);
    } catch (error) {
      console.error("Failed to load product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    if (!campaignName || !campaignGoal) {
      alert("Please fill in all fields");
      return;
    }
    // API call to create campaign
    console.log({
      productId: product.id,
      name: campaignName,
      goal: campaignGoal,
    });
    setShowCampaignModal(false);
    router.push("/campaigns");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-xl font-semibold mb-2">Product not found</p>
          <Link href="/products">
            <Button variant="link">Back to products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getRiskVariant = (
    competition: string,
  ): "default" | "destructive" | "outline" | "secondary" => {
    switch (competition) {
      case "Low":
        return "default";
      case "Medium":
        return "secondary";
      case "High":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const estimatedMonthlyIncome =
    product.price *
    product.avg_monthly_sales *
    product.conversion_rate *
    product.commission_rate;

  return (
    <>
      <div className="mb-6">
        <Link href="/products">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold">{product.name}</h1>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline">{product.category}</Badge>
              <Badge variant={getRiskVariant(product.competition)}>
                {product.competition} Competition
              </Badge>
            </div>
          </div>
          <Dialog open={showCampaignModal} onOpenChange={setShowCampaignModal}>
            <DialogTrigger asChild>
              <Button className="mt-4 sm:mt-0">
                <Plus className="mr-2 h-4 w-4" />
                Create Campaign
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Campaign</DialogTitle>
                <DialogDescription>
                  Launch a new campaign for {product.name}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g. TikTok Summer Promotion"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="goal" className="text-right">
                    Goal
                  </Label>
                  <Input
                    id="goal"
                    value={campaignGoal}
                    onChange={(e) => setCampaignGoal(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g. 100 sales in 30 days"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateCampaign}>
                  Create Campaign
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{product.description}</p>
              <Button variant="link" asChild className="px-0 mt-2">
                <a href={product.url} target="_blank" rel="noopener noreferrer">
                  Visit Product Page <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <MetricCard
                icon={<TrendingUp />}
                label="AI Score"
                value={product.score}
              />
              <MetricCard
                icon={<Star />}
                label="Rating"
                value={`${product.rating.toFixed(1)} / 5.0`}
              />
              <MetricCard
                icon={<DollarSign />}
                label="Price"
                value={formatCurrency(product.price)}
              />
              <MetricCard
                icon={<Percent />}
                label="Commission"
                value={`${(product.commission_rate * 100).toFixed(0)}%`}
              />
              <MetricCard
                icon={<Users />}
                label="Sales Volume"
                value={product.sales_volume}
              />
              <MetricCard
                icon={<Target />}
                label="Conversion Rate"
                value={`${(product.conversion_rate * 100).toFixed(1)}%`}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary">Estimated Income</CardTitle>
              <CardDescription>
                Based on average monthly sales and conversion rate.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">
                {formatCurrency(estimatedMonthlyIncome)}
              </p>
              <p className="text-sm text-primary/80">per month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Audience Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {product.target_gender && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Gender</p>
                    <Badge variant="secondary">{product.target_gender}</Badge>
                  </div>
                )}
                {(product.target_age_min || product.target_age_max) && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Age Range
                    </p>
                    <Badge variant="secondary">
                      {product.target_age_min || "18"}-
                      {product.target_age_max || "65"} years
                    </Badge>
                  </div>
                )}
                {product.target_location && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Location
                    </p>
                    <Badge variant="secondary">{product.target_location}</Badge>
                  </div>
                )}
                {product.interest_tags && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Interests
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.interest_tags.split(",").map((tag: string) => (
                        <Badge key={tag} variant="outline">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Platform Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Current Platform
                  </p>
                  <Badge variant="default">{product.platform}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Category</p>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Similar Products</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {similarProducts.map((similarProduct) => (
              <Link
                href={`/products/${similarProduct.id}`}
                key={similarProduct.id}
              >
                <Card className="hover:shadow-lg hover:border-primary transition-all h-full">
                  {similarProduct.image_url && (
                    <div className="relative w-full h-40 bg-muted overflow-hidden">
                      <img
                        src={similarProduct.image_url}
                        alt={similarProduct.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-3 line-clamp-2">
                      {similarProduct.name}
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Score</span>
                        <Badge variant="secondary" className="text-xs">
                          {similarProduct.score ||
                            similarProduct.potential_score ||
                            0}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Category</span>
                        <Badge variant="outline" className="text-xs">
                          {similarProduct.category}
                        </Badge>
                      </div>
                      {similarProduct.similarity_score && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Match</span>
                          <span className="font-semibold text-primary">
                            {(similarProduct.similarity_score * 100).toFixed(0)}
                            %
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-muted rounded-lg">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}
