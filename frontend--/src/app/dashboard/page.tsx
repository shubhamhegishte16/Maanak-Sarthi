"use me";
"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import AISearchSection from "@/components/AISearchSection";
import CategoryGrid from "@/components/CategoryGrid";
import StreamlinedUpdates from "@/components/StreamlinedUpdates";
import SearchModal from "@/components/SearchModal";
import Footer from "@/components/Footer";
import { UserCheck, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("home");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Simulated logged-in user state
  const [user, setUser] = useState<{ name: string; role: string; email: string } | null>({
    name: "Rajesh Sharma",
    role: "Manufacturer",
    email: "rajesh@acmemfg.in",
  });

  const handleSelectCategory = (categoryId: string) => {
    setIsSearchOpen(true);
  };

  return (
    <main className="min-h-screen flex flex-col bg-bis-cream selection:bg-bis-burgundy selection:text-white">
      
      {/* Logged-In Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuthModal={() => {}}
        user={user}
        onLogout={() => setUser(null)}
      />

      {/* Main Dashboard View (Reference Image 2) */}
      <div className="flex-grow">
        
        {/* Logged-In Welcome Banner */}
        <div className="bg-bis-sage-light/70 border-b border-bis-sage/20 py-2.5 px-4 text-center">
          <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2 text-xs font-semibold text-bis-sage-dark">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome, {user?.name || "Verified User"} • Accessing Real-Time Source-Grounded BIS AI Portal</span>
            <span className="mx-2">•</span>
            <Link href="/" className="underline text-bis-burgundy hover:text-bis-burgundy-light font-bold">
              Switch to Public Landing Page
            </Link>
          </div>
        </div>

        {/* Dashboard AI Guidance & Search Hero (Image 2 Red-Circled Section) */}
        <AISearchSection onSelectCategory={handleSelectCategory} />

        {/* Explore By Category Cards (5 Cards matching Image 2) */}
        <CategoryGrid onSelectCategory={handleSelectCategory} />

        {/* Streamlined Minimalist How It Works & Latest Updates (Image 2) */}
        <StreamlinedUpdates />

      </div>

      {/* Institutional Footer */}
      <Footer />

      {/* Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </main>
  );
}
