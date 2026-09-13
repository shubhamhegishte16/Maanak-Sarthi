"use client";

import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bis-cream flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-full bg-bis-burgundy/10 text-bis-burgundy flex items-center justify-center mb-4">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-serif-title font-bold text-bis-slate mb-2">
        Page Not Found
      </h1>
      <p className="text-xs sm:text-sm text-bis-slate-muted max-w-md mb-6">
        The requested page or Indian Standard reference could not be located in our active directory.
      </p>
      <Link
        href="/"
        className="inline-flex items-center space-x-2 px-6 py-2.5 bg-bis-burgundy text-white text-xs font-semibold rounded-full shadow-sm hover:bg-bis-burgundy-light transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
}
