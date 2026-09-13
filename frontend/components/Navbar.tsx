"use client";

import React, { useState } from "react";
import { Search, Menu, X, LogOut, UserCheck } from "lucide-react";

interface UserProfile {
  name: string;
  role: string;
  email: string;
}

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenAuthModal: () => void;
  user?: UserProfile | null;
  onLogout?: () => void;
}

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenSearch, 
  onOpenAuthModal,
  user,
  onLogout 
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", id: "home" },
    { name: "Standards", id: "standards" },
    { name: "QCOs", id: "qcos" },
    { name: "Certification", id: "certification" },
    { name: "Labs", id: "labs" },
    { name: "Documents", id: "documents" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-bis-cream/90 border-b border-bis-border/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left Brand Mark */}
        <div className="flex items-center space-x-4">
          <a href="/" className="flex items-center group">
            <span className="font-serif-title text-2xl font-bold text-bis-slate tracking-tight group-hover:text-bis-burgundy transition-colors">
              BIS Guidance
            </span>
          </a>
          <span className="h-5 w-[1px] bg-bis-slate/20 hidden sm:block" />
          
          {user && (
            <span className="hidden lg:inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-bis-sage-light text-bis-sage-dark text-[11px] font-semibold">
              <UserCheck className="w-3 h-3" />
              <span>Dashboard Mode</span>
            </span>
          )}
        </div>

        {/* Center Pill Nav Bar - Desktop */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-bis-cream-dark/60 p-1.5 rounded-full border border-bis-border/70 shadow-sm">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-bis-burgundy text-white shadow-sm"
                    : "text-bis-slate-muted hover:text-bis-slate hover:bg-white/50"
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & Buttons */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={onOpenSearch}
            className="p-2.5 text-bis-slate-muted hover:text-bis-burgundy hover:bg-white/80 rounded-full transition-all border border-transparent hover:border-bis-border/50"
            title="Search Indian Standards"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {user ? (
            <div className="hidden sm:flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white px-3.5 py-1.5 rounded-full border border-bis-border text-xs">
                <span className="w-2 h-2 rounded-full bg-bis-sage" />
                <span className="font-semibold text-bis-slate">{user.name}</span>
                <span className="text-[10px] text-bis-slate-muted font-normal uppercase">({user.role})</span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-bis-slate-muted hover:text-bis-burgundy hover:bg-white/80 rounded-full transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="hidden sm:inline-flex items-center justify-center px-5 py-2 text-xs font-semibold text-bis-slate border border-bis-slate/30 rounded-full hover:bg-bis-slate hover:text-white transition-all duration-200"
            >
              Sign In
            </button>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-bis-slate hover:text-bis-burgundy focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-bis-cream border-b border-bis-border px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-bis-burgundy text-white font-semibold"
                      : "text-bis-slate hover:bg-bis-cream-dark"
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-bis-border flex items-center justify-between">
            <button
              onClick={onOpenSearch}
              className="flex items-center space-x-2 text-sm text-bis-burgundy font-medium py-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Database</span>
            </button>

            {user ? (
              <button
                onClick={() => {
                  onLogout?.();
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-bis-burgundy border border-bis-burgundy/30 rounded-full"
              >
                Log Out ({user.name})
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenAuthModal();
                  setMobileMenuOpen(false);
                }}
                className="px-5 py-1.5 text-xs font-semibold text-bis-slate border border-bis-slate/30 rounded-full"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
