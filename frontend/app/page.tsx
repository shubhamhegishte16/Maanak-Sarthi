"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroLanding from "@/components/HeroLanding";
import LandingFeatures from "@/components/LandingFeatures";
import AISearchSection from "@/components/AISearchSection";
import CategoryGrid from "@/components/CategoryGrid";
import StreamlinedUpdates from "@/components/StreamlinedUpdates";
import SearchModal from "@/components/SearchModal";
import AuthModal from "@/components/AuthModal";
import Footer from "@/components/Footer";
import { Sparkles, ArrowRight, UserCheck, ShieldCheck } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  
  // User state: null = Public Landing View (Image 1), active object = Logged-In Dashboard View (Image 2)
  const [user, setUser] = useState<{ name: string; role: string; email: string } | null>(null);

  // Keyboard shortcut Ctrl+K / Cmd+K for search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOpenAuth = (mode: "signin" | "signup" = "signin") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleLoginSuccess = (userProfile: { name: string; role: string; email: string }) => {
    setUser(userProfile);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleExploreClick = () => {
    // Demo login into dashboard or scroll to AI search
    if (!user) {
      setUser({
        name: "Rajesh Sharma",
        role: "Manufacturer",
        email: "rajesh@acmemfg.in"
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const target = document.getElementById("guidance-search");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectCategory = (categoryId: string) => {
    setIsSearchOpen(true);
  };

  return (
    <main className="min-h-screen flex flex-col bg-bis-cream selection:bg-bis-burgundy selection:text-white">
      
      {/* Top Banner Switcher Bar */}
      <div className="bg-bis-burgundy text-white text-[11px] py-2 px-4 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-bis-gold animate-pulse" />
            <span className="font-semibold tracking-wide">
              {user ? `Logged In as ${user.name} (${user.role})` : "Public Portal • Bureau of Indian Standards"}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {user ? (
              <button
                onClick={() => setUser(null)}
                className="hover:underline font-bold text-bis-gold-light"
              >
                ← Return to Public Landing Page
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleOpenAuth("signin")}
                  className="hover:underline font-semibold text-white/90"
                >
                  Sign In
                </button>
                <span className="text-white/40">•</span>
                <button
                  onClick={() => setUser({ name: "Rajesh Sharma", role: "Manufacturer", email: "rajesh@acme.in" })}
                  className="inline-flex items-center space-x-1 hover:underline font-bold text-bis-gold-light"
                >
                  <span>Instant Demo Login (Home Dashboard View)</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Header - Rendered ONLY on Home / Dashboard View */}
      {user && (
        <Navbar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAuthModal={() => handleOpenAuth("signin")}
          user={user}
          onLogout={() => setUser(null)}
        />
      )}

      {/* Main Content Areas: PUBLIC LANDING PAGE vs LOGGED-IN DASHBOARD */}
      <div className="flex-grow">
        
        {!user ? (
          /* ============================================================ */
          /* PUBLIC LANDING PAGE (REFERENCE IMAGE 1 INSPIRATION)          */
          /* ============================================================ */
          <>
            {/* Hero Section matching Image 1 with floating animated cards & building photo */}
            <HeroLanding onExploreClick={handleExploreClick} />

            {/* Informative Landing Sections (Institutional Mission, Popular Standards Catalog, Trust Stats) */}
            <LandingFeatures 
              onSignInClick={() => handleOpenAuth("signin")}
              onExploreClick={handleExploreClick}
            />
          </>
        ) : (
          /* ============================================================ */
          /* LOGGED-IN HOME / DASHBOARD (REFERENCE IMAGE 2 INSPIRATION)   */
          /* ============================================================ */
          <>
            {/* Dashboard Welcome Header */}
            <div className="bg-bis-sage-light/70 border-b border-bis-sage/20 py-2.5 px-4 text-center">
              <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2 text-xs font-semibold text-bis-sage-dark">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Authenticated Session: {user.name} ({user.role})</span>
                <span className="mx-2">•</span>
                <span>Accessing Source-Grounded AI Search & Certified Sources</span>
              </div>
            </div>

            {/* AI Search & Guidance Dashboard Hero (Image 2 Red-Circled Section) */}
            <AISearchSection onSelectCategory={handleSelectCategory} />

            {/* Explore By Category Grid (5 Cards matching Image 2) */}
            <CategoryGrid onSelectCategory={handleSelectCategory} />

            {/* Streamlined Minimalist How It Works & Latest Updates (Image 2) */}
            <StreamlinedUpdates />
          </>
        )}

      </div>

      {/* Complete Institutional Footer */}
      <Footer />

      {/* Quick Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Auth Modal (Login / Sign Up) */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onSuccessLogin={handleLoginSuccess}
      />
    </main>
  );
}
