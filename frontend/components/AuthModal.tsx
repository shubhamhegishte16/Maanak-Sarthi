"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Phone
} from "lucide-react";
import { getApiErrorMessage } from "@/lib/api";
import { useAuth, type UserRole } from "@/context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup";
  onSuccessLogin?: (user: { name: string; role: string; email: string }) => void;
}

export default function AuthModal({ isOpen, onClose, initialMode = "signin", onSuccessLogin }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>("consumer");
  const [showPassword, setShowPassword] = useState(false);
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register } = useAuth();

  if (!isOpen) return null;

  const roles = [
    { id: "consumer", label: "Citizen / Consumer", icon: User },
    { id: "business", label: "Manufacturer / Business", icon: Building2 },
    { id: "lab", label: "BIS-Recognized Lab", icon: ShieldCheck },
  ];

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (mode === "signup") {
      if (fullName.trim().length < 2) {
        setErrorMessage("Please enter your full name (at least 2 characters).");
        return;
      }
      if (password.length < 8) {
        setErrorMessage("Password must be at least 8 characters long.");
        return;
      }
      if (!agreedToTerms) {
        setErrorMessage("Please accept the Terms of Service and Privacy Policy.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const trimmedPhone = phone.trim();
      const user = mode === "signin"
        ? await login(email.trim(), password, rememberMe)
        : await register({
            name: fullName.trim(),
            email: email.trim(),
            phone: trimmedPhone ? trimmedPhone : undefined,
            password,
            role: selectedRole,
          });
      onSuccessLogin?.({ name: user.name, role: user.role, email: user.email });
      onClose();
    } catch (error: unknown) {
      setErrorMessage(getApiErrorMessage(error, "Unable to complete authentication request"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Card Box */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-4xl bg-bis-cream rounded-3xl border border-bis-border shadow-custom-lg overflow-hidden grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-bis-slate-muted hover:text-bis-slate border border-bis-border/60 transition-colors"
          aria-label="Close auth modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT VISUAL PANEL (Matching Landing Page Aesthetic) */}
        <div className="hidden md:flex md:col-span-5 bg-bis-burgundy text-white p-8 flex-col justify-between relative overflow-hidden">
          
          {/* Subtle Background Glow Elements */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-bis-burgundy-light/40 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -right-12 w-56 h-56 bg-bis-gold/20 rounded-full blur-2xl" />

          {/* Top Brand Mark */}
          <div className="relative z-10">
            <span className="font-serif-title text-2xl font-bold tracking-tight">
              BIS Guidance
            </span>
            <p className="text-xs text-white/70 mt-1 font-light">
              Official Indian Standards & Certification Portal
            </p>
          </div>

          {/* Center Editorial Headlines */}
          <div className="relative z-10 my-8 space-y-4">
            <h3 className="font-serif-title text-3xl font-normal leading-tight">
              Indian Standards, <br />
              <span className="font-serif-italic text-bis-gold-light italic">
                for a Safer Tomorrow.
              </span>
            </h3>
            <p className="text-xs text-white/80 leading-relaxed font-light">
              Access verified Quality Control Orders, laboratory network maps, and automated compliance guidance.
            </p>

            {/* Floating Trust Badges */}
            <div className="pt-4 space-y-2.5">
              <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <CheckCircle2 className="w-4 h-4 text-bis-gold flex-shrink-0" />
                <span className="text-xs font-medium text-white/90">2.5M+ Verified Businesses & Consumers</span>
              </div>
              <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <ShieldCheck className="w-4 h-4 text-bis-sage-light flex-shrink-0" />
                <span className="text-xs font-medium text-white/90">Official Gazette Grounded Data</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="relative z-10 text-[11px] text-white/60 pt-4 border-t border-white/10 flex items-center justify-between">
            <span>Encrypted 256-bit Connection</span>
            <span className="font-mono text-bis-gold font-semibold">BIS 2026</span>
          </div>

        </div>

        {/* RIGHT INTERACTIVE FORM PANEL */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-bis-cream">
          
          <div>
            {/* Top Auth Mode Switcher */}
            <div className="flex items-center justify-center mb-6">
              <div className="inline-flex p-1 bg-bis-cream-dark/80 rounded-full border border-bis-border">
                <button
                  type="button"
                  onClick={() => { setMode("signin"); setErrorMessage(""); }}
                  className={`px-6 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    mode === "signin"
                      ? "bg-bis-burgundy text-white shadow-sm"
                      : "text-bis-slate-muted hover:text-bis-slate"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("signup"); setErrorMessage(""); }}
                  className={`px-6 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    mode === "signup"
                      ? "bg-bis-burgundy text-white shadow-sm"
                      : "text-bis-slate-muted hover:text-bis-slate"
                  }`}
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* Header Title */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-serif-title font-semibold text-bis-slate">
                {mode === "signin" ? "Welcome back" : "Join BIS Guidance"}
              </h2>
              <p className="text-xs text-bis-slate-muted mt-1">
                {mode === "signin" 
                  ? "Sign in to access your saved standards and lab reports"
                  : "Register your business or profile for compliance tracking"}
              </p>
            </div>

            {/* Role Selector Chips */}
            <div className="mb-5">
              <label className="block text-[11px] font-bold text-bis-slate-muted uppercase tracking-wider mb-2">
                Select User Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => {
                  const RoleIcon = r.icon;
                  const isSelected = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id as UserRole)}
                      className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all flex flex-col items-center justify-center text-center space-y-1 ${
                        isSelected
                          ? "bg-white border-bis-burgundy ring-1 ring-bis-burgundy shadow-xs"
                          : "bg-white/60 border-bis-border/80 hover:bg-white text-bis-slate-muted"
                      }`}
                    >
                      <RoleIcon className={`w-4 h-4 ${isSelected ? "text-bis-burgundy" : "text-bis-slate-muted"}`} />
                      <span className={`text-[10px] sm:text-[11px] font-medium leading-tight ${isSelected ? "text-bis-slate font-bold" : ""}`}>
                        {r.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-semibold text-bis-slate mb-1">
                    Full Name / Organization
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-bis-slate-muted absolute left-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Acme Quality Corp"
                      className="w-full pl-9 pr-4 py-2.5 text-xs bg-white rounded-xl border border-bis-border focus:border-bis-burgundy focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              {errorMessage && (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {errorMessage}
                </p>
              )}

              <div>
                <label className="block text-xs font-semibold text-bis-slate mb-1">
                  Email Address / Application ID
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-bis-slate-muted absolute left-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.gov.in"
                    className="w-full pl-9 pr-4 py-2.5 text-xs bg-white rounded-xl border border-bis-border focus:border-bis-burgundy focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-semibold text-bis-slate mb-1">
                    Mobile Number (+91)
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-bis-slate-muted absolute left-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-4 py-2.5 text-xs bg-white rounded-xl border border-bis-border focus:border-bis-burgundy focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-bis-slate">
                    Password
                    {mode === "signup" && (
                      <span className="text-[10px] text-bis-slate-muted font-normal ml-1.5">(min 8 characters)</span>
                    )}
                  </label>
                  {mode === "signin" && (
                    <a href="#" className="text-[11px] text-bis-burgundy hover:underline font-medium">
                      Forgot Password?
                    </a>
                  )}
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-bis-slate-muted absolute left-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={mode === "signup" ? 8 : 1}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2.5 text-xs bg-white rounded-xl border border-bis-border focus:border-bis-burgundy focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-bis-slate-muted hover:text-bis-slate"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox / Terms Checkbox */}
              {mode === "signin" ? (
                <div className="flex items-center">
                  <input
                    key="signin-remember-checkbox"
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-bis-border text-bis-burgundy focus:ring-bis-burgundy"
                  />
                  <label htmlFor="remember" className="ml-2 text-xs text-bis-slate-muted cursor-pointer">
                    Remember login on this browser
                  </label>
                </div>
              ) : (
                <div className="flex items-start space-x-2">
                  <input
                    key="signup-terms-checkbox"
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    required
                    className="w-3.5 h-3.5 mt-0.5 rounded border-bis-border text-bis-burgundy focus:ring-bis-burgundy"
                  />
                  <label htmlFor="terms" className="text-[11px] text-bis-slate-muted leading-tight cursor-pointer">
                    I agree to the <a href="#" className="text-bis-burgundy underline">Terms of Service</a> and <a href="#" className="text-bis-burgundy underline">Privacy Policy</a> of BIS Guidance.
                  </label>
                </div>
              )}

              {/* Submit Pill Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-bis-burgundy text-white font-semibold text-xs sm:text-sm rounded-full shadow-custom-sm hover:bg-bis-burgundy-light transition-all flex items-center justify-center space-x-2 mt-2"
              >
                <span>{isSubmitting ? "Please wait..." : mode === "signin" ? "Sign In to Portal" : "Complete Registration"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>

            {/* Social / Government SSO Options */}
            <div className="mt-6">
              <div className="relative flex items-center justify-center mb-4">
                <div className="border-t border-bis-border w-full" />
                <span className="bg-bis-cream px-3 text-[10px] uppercase font-bold text-bis-slate-muted">
                  Or Sign In With
                </span>
                <div className="border-t border-bis-border w-full" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => alert("DigiLocker SSO initiated")}
                  className="px-3 py-2 bg-white rounded-xl border border-bis-border hover:border-bis-burgundy text-xs font-semibold text-bis-slate flex items-center justify-center space-x-2 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-bis-gold" />
                  <span>DigiLocker</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert("e-Pramaan Parichay SSO initiated")}
                  className="px-3 py-2 bg-white rounded-xl border border-bis-border hover:border-bis-burgundy text-xs font-semibold text-bis-slate flex items-center justify-center space-x-2 transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-bis-sage-dark" />
                  <span>Parichay SSO</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </motion.div>
    </div>
  );
}
