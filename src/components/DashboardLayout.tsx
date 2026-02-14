"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { useSession } from "@/lib/useSession";
import {
  TrendingUp,
  Package,
  Settings,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Shield,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { checkSession } = useSession(); // Use session hook
  const [darkMode, setDarkMode] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    router.push("/explore"); // Redirect to explore instead of landing
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-background">
        <Sidebar
          user={user}
          handleLogout={handleLogout}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          className="hidden lg:flex"
        />

        <div className="lg:ml-64">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 lg:hidden">
            <Logo />
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <Sidebar
                  user={user}
                  handleLogout={handleLogout}
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                  onLinkClick={() => setIsSheetOpen(false)}
                />
              </SheetContent>
            </Sheet>
          </header>

          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

function Sidebar({
  user,
  handleLogout,
  darkMode,
  toggleDarkMode,
  className,
  onLinkClick,
}: any) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-6 flex-col",
        className,
      )}
    >
      <Logo />
      <nav className="flex-1 space-y-2 mt-10">
        <NavLink
          href="/products"
          icon={<Package />}
          label="Products"
          onClick={onLinkClick}
        />
        <NavLink
          href="/ai-tools"
          icon={<Wand2 />}
          label="AI Tools"
          onClick={onLinkClick}
        />
        <NavLink
          href="/pricing"
          icon={<Sparkles />}
          label="Pricing"
          onClick={onLinkClick}
        />
        <NavLink
          href="/settings"
          icon={<Settings />}
          label="Settings"
          onClick={onLinkClick}
        />

        {/* Admin-only navigation */}
        {user?.role === "admin" && (
          <>
            <div className="border-t border-border my-2 pt-2">
              <p className="text-xs font-semibold text-muted-foreground px-3 mb-2">
                ADMIN
              </p>
            </div>
            <NavLink
              href="/admin/products"
              icon={<Shield />}
              label="Manage Products"
              onClick={onLinkClick}
            />
          </>
        )}
      </nav>
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <p className="font-medium">{user?.email}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.role}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {darkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full justify-start"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
        <TrendingUp className="w-6 h-6 text-primary-foreground" />
      </div>
      <span className="text-xl font-display font-bold">AffiliateIQ</span>
    </Link>
  );
}

function NavLink({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href as any}
      onClick={onClick}
      className={cn(
        "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted",
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
