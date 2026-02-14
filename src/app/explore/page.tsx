"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import {
  Search,
  TrendingUp,
  Star,
  DollarSign,
  ArrowRight,
  LogIn,
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
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  commission: number;
  score: number;
  competition: string;
  affiliate_link: string;
  image_url?: string;
}

// Demo products data for when backend is not available
const DEMO_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones Pro",
    category: "Electronics",
    price: 79.99,
    commission: 15.99,
    score: 88,
    competition: "Medium",
    affiliate_link: "#",
    image_url:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
  },
  {
    id: "2",
    name: "Organic Vitamin C Serum",
    category: "Beauty",
    price: 34.99,
    commission: 10.49,
    score: 92,
    competition: "Low",
    affiliate_link: "#",
    image_url:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    name: "Smart Fitness Tracker Watch",
    category: "Health",
    price: 129.99,
    commission: 25.99,
    score: 85,
    competition: "High",
    affiliate_link: "#",
    image_url:
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=300&fit=crop",
  },
  {
    id: "4",
    name: "Stainless Steel Water Bottle",
    category: "Lifestyle",
    price: 24.99,
    commission: 6.24,
    score: 78,
    competition: "Medium",
    affiliate_link: "#",
    image_url:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
  },
  {
    id: "5",
    name: "Ergonomic Office Chair",
    category: "Office",
    price: 299.99,
    commission: 59.99,
    score: 90,
    competition: "Low",
    affiliate_link: "#",
    image_url:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop",
  },
  {
    id: "6",
    name: "Portable Blender for Smoothies",
    category: "Kitchen",
    price: 39.99,
    commission: 9.99,
    score: 81,
    competition: "Medium",
    affiliate_link: "#",
    image_url:
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=300&fit=crop",
  },
];

const CATEGORIES = [
  "All",
  "Electronics",
  "Beauty",
  "Health",
  "Lifestyle",
  "Office",
  "Kitchen",
  "Fashion",
  "Sports",
  "Photography",
  "Home & Garden",
  "Pets",
  "Travel",
  "Wellness",
];

export default function ExplorePage() {
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, [categoryFilter]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      // Convert 'all' to empty string for API
      const category = categoryFilter === "All" ? "" : categoryFilter;
      const response = await apiClient.getProducts({ category });
      setProducts(response.products || DEMO_PRODUCTS);
    } catch (err: any) {
      console.error("Failed to load products:", err);
      // Use demo data if API fails
      setProducts(DEMO_PRODUCTS);
      setError("Using demo data. Sign in to access live product catalog.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === "All" || product.category === categoryFilter),
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-base sm:text-lg font-display font-bold">
              AffiliateIQ
            </span>
          </Link>
          <nav className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/login" className="hidden sm:inline-block">
              <Button variant="ghost" size="sm">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>
            <Link href="/login" className="sm:hidden">
              <Button variant="ghost" size="sm">
                <LogIn className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="text-xs sm:text-sm">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Banner */}
      <div className="bg-primary/10 border-b">
        <div className="container py-3 px-4 text-center">
          <p className="text-xs sm:text-sm">
            🎯 <strong>Sign in</strong> to access advanced features.{" "}
            <Link href="/login" className="underline font-medium">
              Login here
            </Link>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 border-r sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-4">
              Categories
            </h2>
            <div className="space-y-1">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={categoryFilter === category ? "secondary" : "ghost"}
                  className="w-full justify-start text-sm"
                  onClick={() => setCategoryFilter(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1 p-3 sm:p-4 md:p-6">
          <div className="container mx-auto">
            {/* Search and Filter */}
            <div className="mb-6 sm:mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-9 sm:pl-10 text-sm sm:text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="md:hidden mt-3 sm:mt-4">
                <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                  <div className="flex w-max space-x-2 p-2">
                    {CATEGORIES.map((category) => (
                      <Button
                        key={category}
                        variant={
                          categoryFilter === category ? "secondary" : "outline"
                        }
                        size="sm"
                        onClick={() => setCategoryFilter(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md">
                <p>{error}</p>
              </div>
            )}

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted rounded-t-lg"></div>
                    <CardContent className="p-4 space-y-2">
                      <div className="h-6 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                  >
                    <div className="relative h-48 w-full">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardHeader className="p-3 sm:p-4">
                      <CardTitle className="text-base sm:text-lg font-semibold leading-tight line-clamp-2">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        {product.category}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 flex-grow">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-5 h-5 text-yellow-400" />
                          <span className="font-bold text-lg">
                            {product.score}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            / 100
                          </span>
                        </div>
                        <Badge variant={getRiskVariant(product.competition)}>
                          {product.competition} Risk
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Price</span>
                          <span className="font-medium">
                            {formatCurrency(product.price)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Commission
                          </span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(product.commission)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 bg-muted/40">
                      <Button className="w-full" asChild>
                        <Link href="/register">
                          Get Affiliate Link
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
