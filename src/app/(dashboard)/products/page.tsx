"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProductStore, useAuthStore } from "@/lib/store";
import { apiClient } from "@/lib/api";
import {
  Search,
  Filter,
  TrendingUp,
  Star,
  DollarSign,
  Users,
  AlertCircle,
  PlusCircle,
  Grid3x3,
  List,
  Sparkles,
  Wand2,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ProductCard = ({
  product,
  onGenerateClick,
}: {
  product: any;
  onGenerateClick: (id: string) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <Card
      className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
          >
            <div className="p-4 text-white flex flex-col justify-end h-full">
              <h3 className="font-bold text-lg mb-2">{product.name}</h3>
              <p className="text-xs line-clamp-3 mb-3">
                {product.description || "No description available."}
              </p>
              <Button size="sm" onClick={() => onGenerateClick(product.id)}>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Content
              </Button>
            </div>
          </div>
        </div>
        <div className="p-4 border-t">
          <div className="flex justify-between items-center mb-2">
            <Badge variant="secondary">{product.category}</Badge>
            <Badge variant={getRiskVariant(product.competition)}>
              {product.competition} Competition
            </Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Commission</span>
            <span className="font-semibold">
              {product.commission_rate
                ? `${(product.commission_rate * 100).toFixed(1)}%`
                : `$${product.commission}`}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Price</span>
            <span className="font-semibold">${product.price}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ProductsPage() {
  const { products, filters, setProducts, setFilters, setSelectedProduct } =
    useProductStore();
  const { token, user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("grid"); // 'grid' or 'list'
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlTimeout, setCrawlTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (token) {
      apiClient.setToken(token);
      loadProducts();
      loadRecommendations();
    }
  }, [token, filters]);

  const loadRecommendations = async () => {
    try {
      const [recsResponse, trendingResponse] = await Promise.all([
        apiClient.getProductRecommendations(5),
        apiClient.getTrendingProducts(5),
      ]);
      setRecommendations(recsResponse.products || []);
      setTrending(trendingResponse.products || []);
    } catch (err) {
      console.error("Failed to load recommendations:", err);
    }
  };

  const getFilterValue = (value: string) => (value === "all" ? "" : value);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      // Convert 'all' back to empty string for API
      const apiFilters = {
        category: getFilterValue(filters.category),
        platform: getFilterValue(filters.platform),
        sortBy: filters.sortBy,
      };
      const response = await apiClient.getProducts(apiFilters);
      setProducts(response.products);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to load products";
      console.error("Failed to load products:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateContent = (productId: string) => {
    router.push(`/ai-tools?productId=${productId}`);
  };

  const isValidUrl = (str: string) => {
    try {
      const url = new URL(str);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleCrawlProduct = async (url: string) => {
    setIsCrawling(true);
    // Mock crawling - simulate API call
    setTimeout(() => {
      const crawledProduct = {
        id: `crawled-${Date.now()}`,
        name: "Crawled Product from Link",
        description:
          "This product was automatically extracted from the provided URL. Our AI analyzed the product page to gather key information including features, specifications, and pricing details.",
        category: "Electronics",
        price: "99.99",
        commission: "15.00",
        commission_rate: 0.15,
        platform: "External",
        image_url:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop",
        competition: "Medium",
      };

      setIsCrawling(false);
      setSearchTerm("");

      // Store the crawled product and navigate to AI tools
      const crawledParam = encodeURIComponent(JSON.stringify(crawledProduct));
      router.push(`/ai-tools?crawled=${crawledParam}`);
    }, 2000);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    // Clear existing timeout
    if (crawlTimeout) {
      clearTimeout(crawlTimeout);
    }

    // Check if input is a URL
    if (isValidUrl(value)) {
      // Wait for 1 second of no typing before crawling
      const timeout = setTimeout(() => {
        handleCrawlProduct(value);
      }, 1000);
      setCrawlTimeout(timeout);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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

  return (
    <>
      {/* Mobile-optimized header */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-1 sm:mb-2">
              Product Explorer
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Discover high-potential affiliate products
            </p>
          </div>
          {user?.role === "admin" && (
            <Button
              size="sm"
              className="sm:size-default w-full sm:w-auto"
              onClick={() => router.push("/admin/products")}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-destructive mb-1">
              Error Loading Products
            </h3>
            <p className="text-sm text-destructive/90">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => loadProducts()}
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      <Card className="mb-4 sm:mb-6">
        <CardContent className="p-3 sm:p-4 md:p-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products or paste product link to crawl..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 text-sm sm:text-base"
                disabled={isCrawling}
              />
              {isCrawling && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              )}
            </div>
            {isCrawling && (
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 animate-pulse" />
                Crawling product link in background...
              </div>
            )}

            {/* Filters - Mobile optimized */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <Select
                value={filters.category || "all"}
                onValueChange={(value) => setFilters({ category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Beauty">Beauty</SelectItem>
                  <SelectItem value="Fashion">Fashion</SelectItem>
                  <SelectItem value="Kitchen">Kitchen</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Office">Office</SelectItem>
                  <SelectItem value="Pets">Pets</SelectItem>
                  <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.platform || "all"}
                onValueChange={(value) => setFilters({ platform: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Section */}
      {showRecommendations &&
        (recommendations.length > 0 || trending.length > 0) &&
        !loading && (
          <div className="mb-6 space-y-6">
            {/* Personalized Recommendations */}
            {recommendations.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold">Recommended for You</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRecommendations(false)}
                  >
                    Hide
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {recommendations.map((product) => (
                    <Link
                      href={`/products/${product.id}`}
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                    >
                      <Card className="hover:shadow-lg hover:border-primary transition-all h-full">
                        {product.image_url && (
                          <div className="relative w-full h-32 bg-muted overflow-hidden">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <CardContent className="p-3">
                          <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Score</span>
                            <Badge variant="secondary" className="text-xs">
                              {product.score || product.potential_score || 0}
                            </Badge>
                          </div>
                          {product.reason && (
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                              {product.reason}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Products */}
            {trending.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">Trending This Month</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {trending.map((product) => (
                    <Link
                      href={`/products/${product.id}`}
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                    >
                      <Card className="hover:shadow-lg hover:border-primary transition-all h-full">
                        {product.image_url && (
                          <div className="relative w-full h-32 bg-muted overflow-hidden">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <CardContent className="p-3">
                          <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Score
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {product.score || product.potential_score || 0}
                              </Badge>
                            </div>
                            {product.total_revenue && (
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Revenue
                                </span>
                                <span className="font-semibold">
                                  {formatCurrency(product.total_revenue)}
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
          </div>
        )}

      {!showRecommendations &&
        (recommendations.length > 0 || trending.length > 0) && (
          <div className="mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRecommendations(true)}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Show Recommendations
            </Button>
          </div>
        )}

      {loading ? (
        <div className="text-center p-8">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Products Found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onGenerateClick={handleGenerateContent}
            />
          ))}
        </div>
      )}
    </>
  );
}
