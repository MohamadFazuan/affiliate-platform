"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to explore page immediately
    router.replace("/explore");
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/login"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign In
          </Link>
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </nav>
        <MobileNav />
      </div>
    </header>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="outline" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="p-4">
          <Logo />
          <div className="mt-8 flex flex-col space-y-4">
            <Link href="/login">
              <Button variant="ghost" className="w-full justify-start">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="w-full">Get Started</Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <TrendingUp className="w-5 h-5 text-primary-foreground" />
      </div>
      <span className="text-lg font-display font-bold">AffiliateIQ</span>
    </Link>
  );
}

function HeroSection() {
  return (
    <section className="container px-4 py-12 sm:py-20 md:py-32">
      <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
        <main className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
          <h1 className="inline">
            <span className="inline text-primary">Smart Product Selection</span>
          </h1>
          <h2 className="inline"> for </h2>
          <h2 className="inline">
            <span className="inline text-primary">Affiliates</span>
          </h2>
        </main>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover high-converting products, analyze income potential, and track
          performance with data-driven insights.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" asChild>
            <Link href="/register">Start For Free</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/explore">Explore Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function TestCredentialsSection() {
  return (
    <section className="container py-20">
      <Card className="bg-primary/5 border-primary/20 max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl">
            🚀 Try It Now - Demo Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-2xl mx-auto">
            <p className="text-center text-muted-foreground mb-6">
              Test the platform with pre-populated data and campaigns
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2 text-sm">
                      1
                    </span>
                    Demo Account
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <code className="bg-muted px-2 py-1 rounded">
                        demo@affiliateiq.com
                      </code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Password:</span>
                      <code className="bg-muted px-2 py-1 rounded">
                        password123
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2 text-sm">
                      2
                    </span>
                    What's Included
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-primary mr-2" />5
                      Active Campaigns
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-primary mr-2" />
                      Sales Analytics
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-primary mr-2" />
                      15+ Products
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-primary mr-2" />
                      Performance Tracking
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="mt-6 text-center">
              <Button asChild size="lg">
                <Link href="/login">Sign In with Demo Account</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Smart Scoring",
      description:
        "AI-powered algorithm evaluates products based on commission, competition, and market trends.",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Income Prediction",
      description:
        "Estimate potential monthly earnings before committing to any product campaign.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Risk Analysis",
      description:
        "Understand competition levels and refund rates to minimize campaign risks.",
    },
  ];
  return (
    <section className="container max-w-7xl mx-auto py-24 sm:py-32 px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Key Features
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map(({ icon, title, description }) => (
          <Card key={title} className="p-6">
            <CardHeader className="p-0 mb-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                {icon}
              </div>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function BenefitsSection() {
  const benefits = [
    "Data-driven product recommendations",
    "Real-time campaign performance tracking",
    "Multi-platform support (TikTok, Shopee, Amazon)",
    "Edge-optimized for lightning-fast performance",
    "Clean, minimal dashboard focused on insights",
    "Secure and scalable architecture",
  ];
  return (
    <section className="container max-w-7xl mx-auto py-24 sm:py-32 px-4">
      <Card className="p-8 md:p-12 lg:p-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why Affiliates Choose Us
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <p>{benefit}</p>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="container max-w-4xl mx-auto py-24 text-center px-4">
      <h2 className="text-4xl md:text-5xl font-bold">
        Ready to Boost Your Affiliate Income?
      </h2>
      <p className="text-xl text-muted-foreground mt-4 mb-8">
        Join hundreds of affiliates finding success with AffiliateIQ.
      </p>
      <Button asChild size="lg">
        <Link href="/register">Get Started for Free</Link>
      </Button>
    </section>
  );
}

function Footer() {
  return (
    <footer className="container border-t py-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <Logo />
        <p className="text-sm text-muted-foreground mt-4 md:mt-0">
          &copy; {new Date().getFullYear()} AffiliateIQ. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
