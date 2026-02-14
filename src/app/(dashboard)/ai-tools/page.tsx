"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Wand2,
  Sparkles,
  Copy,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Video,
  Image as ImageIcon,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "lucide-react";

interface GeneratedContent {
  videoIdea: string;
  scriptOutline: string;
  openingHook: string;
  storytellingScript: string;
  callToAction: string;
  hashtags: string[];
  thumbnailIdeas: string[];
  videoPrompts: {
    sora: string;
    runway: string;
    pika: string;
  };
  productReviewScript: string;
  videoUrl: string; // Mock generated video URL
  postContent: {
    tiktok: string;
    instagram: string;
    facebook: string;
  };
}

export default function AIToolsPage() {
  const { user, token } = useAuthStore();
  const searchParams = useSearchParams();
  const productId = searchParams?.get("productId");
  const crawledParam = searchParams?.get("crawled");

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] =
    useState<GeneratedContent | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [productLink, setProductLink] = useState("");
  const [isCrawling, setIsCrawling] = useState(false);

  // Load product if productId is in URL or crawled product
  useEffect(() => {
    if (productId && token) {
      loadProduct(productId);
    } else if (crawledParam) {
      try {
        const crawledProduct = JSON.parse(decodeURIComponent(crawledParam));
        setSelectedProduct(crawledProduct);
      } catch (error) {
        console.error("Failed to parse crawled product:", error);
      }
    }
  }, [productId, crawledParam, token]);

  const loadProduct = async (id: string) => {
    try {
      setLoadingProduct(true);
      apiClient.setToken(token!);
      const product = await apiClient.getProduct(id);
      setSelectedProduct(product);
    } catch (error) {
      console.error("Failed to load product:", error);
    } finally {
      setLoadingProduct(false);
    }
  };

  const handleCrawl = async () => {
    if (!productLink) {
      alert("Please paste a product link to crawl.");
      return;
    }
    setIsCrawling(true);
    // Mock crawling process
    setTimeout(() => {
      const crawledProductName = "Crawled Product Name";
      const crawledProduct = {
        id: "crawled-123",
        name: crawledProductName,
        category: "Crawled Category",
        price: "99.99",
        commission_rate: 0.15,
        platform: "Crawled Platform",
        image_url:
          "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=400&fit=crop",
      };
      setSelectedProduct(crawledProduct);
      setIsCrawling(false);
    }, 2000);
  };

  // Mock user credits - in real implementation, fetch from API
  const userCredits = 100;

  const handleGenerate = async () => {
    if (userCredits < 1) {
      alert("You don't have enough credits. Please purchase more credits.");
      return;
    }

    setIsGenerating(true);

    // TODO: Call Cloudflare AI API
    // Mock generation for now
    setTimeout(() => {
      const productName = selectedProduct?.name || "[Product Name]";
      const category = selectedProduct?.category || "product";
      const finalPrompt =
        customPrompt || `Honest Review: ${productName} - Is It Worth The Hype?`;

      setGeneratedContent({
        videoIdea: finalPrompt,
        scriptOutline:
          "1. Hook viewers dalam 3 saat pertama\n2. Share personal problem/pain point\n3. Introduce product dengan excitement\n4. Demo key features (show, don't just tell)\n5. Share hasil selepas guna\n6. Price reveal & discount code\n7. Strong CTA dengan urgency",
        openingHook: `Jap jap jap! Korang masih struggle dengan ${category}? Dengar dulu... I found something yang actually works and I'm shook! 😱`,
        storytellingScript: `Okay so confession time - dulu I memang struggle gila dengan ${category} ni. Dah cuba macam-macam tapi takde yang satisfy. Then I stumbled upon ${productName} and honestly, I was like 'alahh another overhyped product kot'. But guys, after 2 minggu guna... the results? Chef's kiss! 👌\n\nLet me show you why I'm obsessed:\n[Demo product features here]\n\nThe difference is INSANE! Before ni, [describe problem], but now [describe improvement]. And the best part? It's so senang nak guna, even my mak pun boleh!`,
        callToAction:
          "Okay guys, kalau korang nak try sendiri, I ada special discount code for you! Just click link kat bio, guna code 'SAVE20' untuk dapat 20% off. But cepat sikit tau, limited time je! Trust me, korang takkan regret. Let me know kat comments if you decide to get it! 💕",
        hashtags: [
          `#${productName.replace(/\s+/g, "")}`,
          "#ProductReview",
          "#HonestReview",
          "#MalaysiaAffiliate",
          "#TikTokMadeMeBuyIt",
          "#ShopeeFinds",
          "#WorthIt",
          `#${category}Malaysia`,
        ],
        thumbnailIdeas: [
          "Split screen: 'Before vs After' dengan your reaction face",
          "Product close-up dengan text 'HONEST REVIEW' in bold",
          "Your shocked expression holding product + '😱 GAME CHANGER' text",
          "Product in action dengan Malaysian flag emoji 🇲🇾",
        ],
        videoPrompts: {
          sora: `Create a dynamic product showcase video: ${productName} displayed on a modern Malaysian home setting, warm lighting, smooth camera movement orbiting the product, showing key features with cinematic close-ups, lifestyle context with someone using the product naturally, ending with satisfied user expression, professional commercial quality, 16:9 aspect ratio. Custom prompt: ${customPrompt}`,
          runway: `Product demo video of ${productName}: Start with problem scenario (frustrated person), transition to product introduction (smooth reveal), show product features in action with dynamic camera angles, demonstrate ease of use, end with satisfied customer result, modern aesthetic, Malaysian home environment, natural lighting, emphasis on product benefits, 30-second duration. Custom prompt: ${customPrompt}`,
          pika: `Animated product showcase: ${productName} floating and rotating in space, highlighting key features with glowing accents, smooth transitions between feature demonstrations, text overlays for specifications, modern minimalist background, professional product photography style, emphasize quality and innovation, seamless loop-able animation. Custom prompt: ${customPrompt}`,
        },
        productReviewScript: `🎥 HONEST REVIEW: ${productName} 🎥\n\n━━━━━━━━━━━━━━━━\n⭐ RATING: [X/5 stars]\n💰 PRICE: RM[XX] (Use code SAVE20 for discount!)\n📦 WHERE TO BUY: [Link in bio]\n━━━━━━━━━━━━━━━━\n\n(Based on prompt: "${finalPrompt}")\n\nHai semua! 👋 Hari ni I nak share honest review pasal ${productName} yang ramai tanya.\n\n✅ APA YANG BEST:\n• [Feature 1] - Memang game changer!\n• [Feature 2] - Senang gila nak guna\n• [Feature 3] - Worth every ringgit\n• Quality tip top, packaging pun cantik\n\n❌ CONS (Kena jujur ni):\n• [Minor con if any] - But it's okay la\n• [Another minor point] - Not a dealbreaker\n\n💭 MY THOUGHTS:\nAfter 2 weeks guna, I can confidently say this is THE ${category} yang I've been looking for. The quality is there, results pun nampak, and harga pun still reasonable especially dengan discount code tu.\n\n🎁 SPECIAL OFFER:\nGuna code 'SAVE20' untuk dapat 20% off! Limited time je, so grab while you can.\n\n📊 OVERALL: Worth it ke tak?\n✅ DEFINITELY WORTH IT! Especially kalau korang [target audience description].\n\n━━━━━━━━━━━━━━━━\n💬 Questions? Drop kat comments!\n🔗 Link: [Bio]\n⚡ Code: SAVE20\n━━━━━━━━━━━━━━━━\n\n#${productName.replace(/\s+/g, "")} #ProductReview #MalaysiaAffiliate #HonestReview #WorthIt`,
        videoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        postContent: {
          tiktok: `Jap jap jap! Korang masih struggle dengan ${category}? ${productName} ni memang worth it! ✨\n\n🎁 Code: SAVE20 (20% OFF!)\n🔗 Link di bio!\n\n#${productName.replace(/\s+/g, "")} #ProductReview #MalaysiaAffiliate #FYP #Viral`,
          instagram: `✨ ${productName} - Game Changer Alert! ✨\n\n📸 Swipe untuk details & before/after\n\n🎁 SPECIAL DISCOUNT:\nCode: SAVE20 untuk 20% OFF\n🔗 Link in bio!\n\n#${productName.replace(/\s+/g, "")} #ProductReview #MalaysiaAffiliate #HonestReview\n\n💬 Questions? Comment below!`,
          facebook: `🔥 ${productName} - Honest Review 🔥\n\nHonest Review: ${productName} - Is It Worth The Hype?\n\n✅ BENEFITS:\n• High quality & durable\n• Easy to use\n• Great value for money\n\n💰 PRICE: RM${selectedProduct?.price || "XX"}\n🎁 USE CODE "SAVE20" FOR 20% OFF!\n\n#${productName.replace(/\s+/g, "")} #ProductReview #MalaysiaAffiliate\n\nTag kawan yang perlu tengok this! 👇`,
        },
      });
      setIsGenerating(false);
    }, 2000);
  };

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(section);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const handleDownload = () => {
    if (!generatedContent) return;

    const content = `
VIDEO IDEA: ${generatedContent.videoIdea}

SCRIPT OUTLINE:
${generatedContent.scriptOutline}

OPENING HOOK:
${generatedContent.openingHook}

STORYTELLING SCRIPT:
${generatedContent.storytellingScript}

CALL TO ACTION:
${generatedContent.callToAction}

HASHTAGS:
${generatedContent.hashtags.join(" ")}

THUMBNAIL IDEAS:
${generatedContent.thumbnailIdeas.map((idea, i) => `${i + 1}. ${idea}`).join("\n")}

VIDEO AI PROMPTS:

Sora (OpenAI):
${generatedContent.videoPrompts.sora}

Runway ML:
${generatedContent.videoPrompts.runway}

Pika Labs:
${generatedContent.videoPrompts.pika}

PRODUCT REVIEW SCRIPT:
${generatedContent.productReviewScript}
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "video-script.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadVideo = () => {
    if (!generatedContent?.videoUrl) return;
    const a = document.createElement("a");
    a.href = generatedContent.videoUrl;
    a.download = "generated-video.mp4";
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            AI Content Generator
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate compelling video scripts and content ideas for your
            affiliate products
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Your Credits</p>
            <p className="text-2xl font-bold">{userCredits}</p>
          </div>
          <Button variant="outline" asChild>
            <a href="/pricing">Buy Credits</a>
          </Button>
        </div>
      </div>

      {/* Credit Warning */}
      {userCredits < 10 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Low Credits</AlertTitle>
          <AlertDescription>
            You only have {userCredits} credits remaining. Consider purchasing
            more to continue generating content.
          </AlertDescription>
        </Alert>
      )}

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            Generate AI-powered video scripts in 3 simple steps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold">Select a Product</h3>
              <p className="text-sm text-muted-foreground">
                Choose any product from the product explorer
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold">Generate Content</h3>
              <p className="text-sm text-muted-foreground">
                AI creates video ideas, scripts, hooks, and hashtags (1 credit)
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold">Copy & Create</h3>
              <p className="text-sm text-muted-foreground">
                Use the generated content to create engaging videos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generation Interface */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Product Selection</CardTitle>
            <CardDescription>
              Select a product from the list or paste a link to crawl
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingProduct || isCrawling ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground mt-2">
                  {isCrawling
                    ? "Crawling product link..."
                    : "Loading product..."}
                </p>
              </div>
            ) : selectedProduct ? (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Product selected! Ready to generate content.
                  </AlertDescription>
                </Alert>

                {/* Product Preview */}
                <Card className="border-2 border-primary/20">
                  <CardContent className="p-0">
                    {selectedProduct.image_url && (
                      <div className="relative w-full h-48 overflow-hidden">
                        <img
                          src={selectedProduct.image_url}
                          alt={selectedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-base mb-2">
                          {selectedProduct.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs mb-2">
                          {selectedProduct.category}
                        </Badge>
                        {selectedProduct.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                            {selectedProduct.description}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t">
                        <div>
                          <span className="text-muted-foreground block mb-1">
                            Commission
                          </span>
                          <span className="font-semibold">
                            {selectedProduct.commission_rate
                              ? `${(selectedProduct.commission_rate * 100).toFixed(1)}%`
                              : `$${selectedProduct.commission}`}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block mb-1">
                            Price
                          </span>
                          <span className="font-semibold">
                            ${selectedProduct.price}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block mb-1">
                            Platform
                          </span>
                          <span className="font-semibold">
                            {selectedProduct.platform}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Go to the{" "}
                  <a href="/products" className="underline font-medium">
                    Products page
                  </a>{" "}
                  and click "Generate Content" on any product card to start.
                </AlertDescription>
              </Alert>
            )}

            <div className="pt-4 space-y-4">
              <div>
                <label htmlFor="custom-prompt" className="text-sm font-medium">
                  Custom Prompt (Optional)
                </label>
                <Textarea
                  id="custom-prompt"
                  placeholder="e.g., Create a funny unboxing video for this product"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Override the default AI prompt with your own ideas.
                </p>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || userCredits < 1 || !selectedProduct}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Content (1 Credit)
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-2">
                This will deduct 1 credit from your balance
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Output Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Content Preview</CardTitle>
            <CardDescription>
              Generated content will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!generatedContent ? (
              <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
                <div className="text-center space-y-2">
                  <Sparkles className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No content generated yet
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Select a product and click Generate
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Generated Successfully
                  </Badge>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </Button>
                </div>

                <Tabs defaultValue="video" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="video">Video Preview</TabsTrigger>
                    <TabsTrigger value="post-content">Post Content</TabsTrigger>
                    <TabsTrigger value="video-prompts">AI Prompts</TabsTrigger>
                  </TabsList>

                  <TabsContent value="video" className="space-y-4">
                    <Alert>
                      <Video className="h-4 w-4" />
                      <AlertTitle>Generated Video Preview</AlertTitle>
                      <AlertDescription className="text-xs">
                        AI-generated product showcase video based on your
                        selected product
                      </AlertDescription>
                    </Alert>

                    {/* Video Player */}
                    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                      <video
                        className="w-full h-full"
                        controls
                        poster={selectedProduct?.image_url}
                        key={generatedContent.videoUrl}
                      >
                        <source
                          src={generatedContent.videoUrl}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </div>

                    <Button
                      onClick={handleDownloadVideo}
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Video
                    </Button>

                    <div className="space-y-2">
                      <div className="text-sm space-y-2">
                        <p className="font-semibold">Video Concept:</p>
                        <p className="text-muted-foreground">
                          {generatedContent.videoIdea}
                        </p>
                        {customPrompt && (
                          <p className="text-xs text-blue-500 dark:text-blue-400">
                            (Based on your custom prompt)
                          </p>
                        )}
                      </div>
                      <div className="text-sm space-y-2 pt-2">
                        <p className="font-semibold">Opening Hook:</p>
                        <p className="text-muted-foreground">
                          {generatedContent.openingHook}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="post-content" className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Ready-to-Post Content</AlertTitle>
                      <AlertDescription className="text-xs">
                        Copy and paste directly to your social media platforms
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      {/* TikTok Post */}
                      <Card className="border-2">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Video className="h-4 w-4" />
                              <CardTitle className="text-sm">
                                TikTok Caption
                              </CardTitle>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleCopy(
                                  generatedContent.postContent.tiktok,
                                  "tiktok",
                                )
                              }
                            >
                              <Copy className="w-3 h-3 mr-2" />
                              {copySuccess === "tiktok" ? "Copied!" : "Copy"}
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-muted/50 rounded-lg p-3">
                            <pre className="text-xs whitespace-pre-wrap">
                              {generatedContent.postContent.tiktok}
                            </pre>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Instagram Post */}
                      <Card className="border-2">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ImageIcon className="h-4 w-4" />
                              <CardTitle className="text-sm">
                                Instagram Caption
                              </CardTitle>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleCopy(
                                  generatedContent.postContent.instagram,
                                  "instagram",
                                )
                              }
                            >
                              <Copy className="w-3 h-3 mr-2" />
                              {copySuccess === "instagram" ? "Copied!" : "Copy"}
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-muted/50 rounded-lg p-3">
                            <pre className="text-xs whitespace-pre-wrap">
                              {generatedContent.postContent.instagram}
                            </pre>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Facebook Post */}
                      <Card className="border-2">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4" />
                              <CardTitle className="text-sm">
                                Facebook Post
                              </CardTitle>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleCopy(
                                  generatedContent.postContent.facebook,
                                  "facebook",
                                )
                              }
                            >
                              <Copy className="w-3 h-3 mr-2" />
                              {copySuccess === "facebook" ? "Copied!" : "Copy"}
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-muted/50 rounded-lg p-3">
                            <pre className="text-xs whitespace-pre-wrap">
                              {generatedContent.postContent.facebook}
                            </pre>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="video-prompts" className="space-y-4">
                    <Alert>
                      <Video className="h-4 w-4" />
                      <AlertTitle>AI Video Generation Prompts</AlertTitle>
                      <AlertDescription className="text-xs">
                        The AI will use your custom prompt if provided. The
                        product name{" "}
                        <span className="font-bold">
                          {selectedProduct?.name}
                        </span>{" "}
                        is automatically included.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <div className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge>Sora (OpenAI)</Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleCopy(
                                generatedContent.videoPrompts.sora,
                                "sora",
                              )
                            }
                          >
                            <Copy className="w-3 h-3 mr-2" />
                            {copySuccess === "sora" ? "Copied!" : "Copy"}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {generatedContent.videoPrompts.sora}
                        </p>
                      </div>

                      <div className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge>Runway ML</Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleCopy(
                                generatedContent.videoPrompts.runway,
                                "runway",
                              )
                            }
                          >
                            <Copy className="w-3 h-3 mr-2" />
                            {copySuccess === "runway" ? "Copied!" : "Copy"}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {generatedContent.videoPrompts.runway}
                        </p>
                      </div>

                      <div className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge>Pika Labs</Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleCopy(
                                generatedContent.videoPrompts.pika,
                                "pika",
                              )
                            }
                          >
                            <Copy className="w-3 h-3 mr-2" />
                            {copySuccess === "pika" ? "Copied!" : "Copy"}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {generatedContent.videoPrompts.pika}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="review" className="space-y-2">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        Ready-to-post product review script for TikTok,
                        Instagram, or Facebook
                      </AlertDescription>
                    </Alert>
                    <div className="border rounded-lg p-4 bg-muted/30">
                      <pre className="text-xs whitespace-pre-wrap text-muted-foreground">
                        {generatedContent.productReviewScript}
                      </pre>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        handleCopy(
                          generatedContent.productReviewScript,
                          "review",
                        )
                      }
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copySuccess === "review"
                        ? "Copied!"
                        : "Copy Review Script"}
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Generated Content Sections */}
      {generatedContent && (
        <div className="space-y-4">
          <ContentSection
            title="Video Idea / Concept"
            content={generatedContent.videoIdea}
            onCopy={() => handleCopy(generatedContent.videoIdea, "idea")}
            isCopied={copySuccess === "idea"}
          />
          <ContentSection
            title="Script Outline"
            content={generatedContent.scriptOutline}
            onCopy={() => handleCopy(generatedContent.scriptOutline, "outline")}
            isCopied={copySuccess === "outline"}
          />
          <ContentSection
            title="Opening Hook"
            content={generatedContent.openingHook}
            onCopy={() => handleCopy(generatedContent.openingHook, "hook")}
            isCopied={copySuccess === "hook"}
          />
          <ContentSection
            title="Storytelling Script"
            content={generatedContent.storytellingScript}
            onCopy={() =>
              handleCopy(generatedContent.storytellingScript, "story")
            }
            isCopied={copySuccess === "story"}
          />
          <ContentSection
            title="Call to Action"
            content={generatedContent.callToAction}
            onCopy={() => handleCopy(generatedContent.callToAction, "cta")}
            isCopied={copySuccess === "cta"}
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hashtags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {generatedContent.hashtags.map((tag, i) => (
                  <Badge key={i} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-4"
                onClick={() =>
                  handleCopy(generatedContent.hashtags.join(" "), "hashtags")
                }
              >
                <Copy className="w-4 h-4 mr-2" />
                {copySuccess === "hashtags" ? "Copied!" : "Copy All"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thumbnail Ideas</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {generatedContent.thumbnailIdeas.map((idea, i) => (
                  <li key={i} className="flex items-start">
                    <span className="font-medium mr-2">{i + 1}.</span>
                    <span className="text-muted-foreground">{idea}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4 pt-4">
            <Button variant="outline" onClick={handleGenerate}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate (1 Credit)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ContentSection({
  title,
  content,
  onCopy,
  isCopied,
}: {
  title: string;
  content: string;
  onCopy: () => void;
  isCopied: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCopy}>
            <Copy className="w-4 h-4 mr-2" />
            {isCopied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground whitespace-pre-line">{content}</p>
      </CardContent>
    </Card>
  );
}
