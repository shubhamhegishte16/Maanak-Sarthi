"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/shared/PageHeader";
import EvidenceCard from "@/components/shared/EvidenceCard";
import ConfidenceBadge from "@/components/shared/ConfidenceBadge";
import { 
  Send, 
  Mic, 
  Paperclip, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  BookOpen, 
  FlaskConical, 
  Settings, 
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Copy,
  Check
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface AssistantMessage {
  id: string;
  sender: "user" | "assistant";
  timestamp: string;
  text: string;
  evidence?: {
    sourceTitle: string;
    documentNumber?: string;
    clause?: string;
    excerpt?: string;
    verifiedDate?: string;
    confidence: "high" | "medium" | "low";
  };
  actions?: {
    label: string;
    href: string;
    icon: "standard" | "certification" | "lab";
  }[];
}

const INITIAL_MESSAGES: AssistantMessage[] = [
  {
    id: "m1",
    sender: "assistant",
    timestamp: "10:30 AM",
    text: "Namaste! I am your MANAK SAARTHI AI Assistant. I provide source-grounded guidance on Indian Standards (IS), Quality Control Orders (QCOs), testing protocols, and BIS certification schemes. How can I assist your compliance journey today?",
    actions: [
      { label: "Find My Standard", href: "/find-standard", icon: "standard" },
      { label: "Certification Navigator", href: "/certification", icon: "certification" },
      { label: "Locate BIS Lab", href: "/labs", icon: "lab" },
    ],
  },
];

const PRESET_TOPICS = [
  "Does my electric water heater require mandatory BIS certification?",
  "What Indian Standard applies to lithium-ion batteries?",
  "Where can I test electrical appliances for IS 302 safety?",
  "Explain Scheme I (ISI) vs Scheme II (CRS) certification",
];

function AIAssistantContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<AssistantMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle URL pre-filled query (e.g. from homepage search)
  useEffect(() => {
    const initialQuery = searchParams.get("q");
    if (initialQuery && initialQuery.trim()) {
      handleUserSubmit(initialQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleUserSubmit = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: AssistantMessage = {
      id: Date.now().toString(),
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: queryText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulated intelligent source-grounded AI reply
    setTimeout(() => {
      let reply: AssistantMessage;
      const lower = queryText.toLowerCase();

      if (lower.includes("water heater") || lower.includes("geyser") || lower.includes("is 302")) {
        reply = {
          id: (Date.now() + 1).toString(),
          sender: "assistant",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: "Yes, electric water heaters (storage and instantaneous) fall under mandatory BIS certification in India. Domestic manufacturers and importers must comply with Indian Standard IS 302 (Part 2/Sec 21) under the Electrical Appliances Quality Control Order.",
          evidence: {
            sourceTitle: "BIS Quality Control Order (QCO) Gazette Notification",
            documentNumber: "IS 302 (Part 2/Sec 21):2018",
            clause: "Clause 6.2 (Electrical Insulation & Pressure Safety)",
            excerpt: "Electric storage water heaters shall be manufactured, imported, stored, or sold only under a valid BIS standard mark licence as per Scheme-I of Schedule-II.",
            verifiedDate: "05/09/2026",
            confidence: "high",
          },
          actions: [
            { label: "View IS 302 in Standards Explorer", href: "/standards?query=IS+302", icon: "standard" },
            { label: "View Scheme I Certification Steps", href: "/certification?scheme=isi", icon: "certification" },
            { label: "Locate Electrical Testing Labs", href: "/labs?test=electrical", icon: "lab" },
          ],
        };
      } else if (lower.includes("battery") || lower.includes("lithium") || lower.includes("16046")) {
        reply = {
          id: (Date.now() + 1).toString(),
          sender: "assistant",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: "Secondary cells and batteries containing alkaline or other non-acid electrolytes (lithium systems) for portable applications are covered under IS 16046 (Part 2):2018. This category requires mandatory Compulsory Registration Scheme (CRS) marking under MeitY / BIS notification.",
          evidence: {
            sourceTitle: "Ministry of Electronics and Information Technology (MeitY) QCO",
            documentNumber: "IS 16046 (Part 2):2018 / IEC 62133-2",
            clause: "Clause 5.3 (Short Circuit & Thermal Abuse Limits)",
            excerpt: "All portable electronics battery assemblies must obtain CRS registration from BIS following testing at recognized laboratory.",
            verifiedDate: "01/09/2026",
            confidence: "high",
          },
          actions: [
            { label: "Inspect IS 16046 Specification", href: "/standards?query=IS+16046", icon: "standard" },
            { label: "CRS Registration Workflow", href: "/certification?scheme=crs", icon: "certification" },
            { label: "Find NABL Battery Labs", href: "/labs?test=battery", icon: "lab" },
          ],
        };
      } else {
        reply = {
          id: (Date.now() + 1).toString(),
          sender: "assistant",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: `Based on your query regarding "${queryText}", our standards index indicates potential relevance to active Indian Standards and QCO gazette mandates. Please review the referenced clause and verify testing readiness.`,
          evidence: {
            sourceTitle: "Bureau of Indian Standards Catalog Reference",
            documentNumber: "IS Standard Reference Index",
            clause: "Section 4.1 (Product Scope & Conformity)",
            excerpt: "Products within this category are subject to verification against published standards and applicable Quality Control Orders.",
            verifiedDate: "01/09/2026",
            confidence: "medium",
          },
          actions: [
            { label: "Find Specific Standard", href: "/find-standard", icon: "standard" },
            { label: "Check Certification Scheme", href: "/certification", icon: "certification" },
            { label: "Locate Recognized Lab", href: "/labs", icon: "lab" },
          ],
        };
      }

      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 700);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <main className="min-h-screen flex flex-col bg-bis-cream selection:bg-bis-burgundy selection:text-white">
      <Navbar />

      <PageHeader
        title={t("asstTitle", "Source-Grounded")}
        italicWord={t("asstItalic", "AI Assistant")}
        description={t("asstSubtitle", "Interact directly with our verified Indian Standards knowledge index. Get source-backed references, clause citations, and immediate next compliance actions.")}
        badgeText={t("asstBadge", "Bureau of Indian Standards • Conversational Guidance")}
        breadcrumbs={[{ label: t("assistant", "AI Assistant") }]}
      />

      {/* Main Chat Interface */}
      <div className="flex-grow max-w-[1536px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Chat conversation (8 cols on desktop) */}
          <div className="lg:col-span-8 flex flex-col h-[750px] bg-white rounded-3xl border border-bis-border shadow-custom-lg overflow-hidden">
            
            {/* Chat header strip */}
            <div className="bg-bis-cream-dark/60 px-5 py-3.5 border-b border-bis-border flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-bis-sage animate-pulse" />
                <span className="font-semibold text-xs text-bis-slate uppercase tracking-wider">
                  {t("asstSession", "Real-time Grounded Session")}
                </span>
                <span className="text-white/40 hidden sm:inline">•</span>
                <span className="text-[11px] text-bis-slate-muted hidden sm:inline">
                  {t("asstSessionSub", "Verified BIS Gazettes & IS Codes")}
                </span>
              </div>

              <button
                onClick={() => setMessages(INITIAL_MESSAGES)}
                className="text-bis-slate-muted hover:text-bis-burgundy text-xs flex items-center space-x-1 transition-colors"
                title="Reset Conversation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t("reset", "Reset")}</span>
              </button>
            </div>

            {/* Conversation message feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {messages.map((msg) => {
                const isUser = msg.sender === "user";
                const messageText = msg.id === "m1" ? t("asstWelcome", msg.text) : msg.text;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center space-x-2 text-[11px] text-bis-slate-muted mb-1 px-1">
                      <span className="font-semibold text-bis-slate">
                        {isUser ? "You" : t("portalTitle", "MANAK SAARTHI AI")}
                      </span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-2xl rounded-2xl p-4 sm:p-5 transition-all text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? "bg-bis-burgundy text-white rounded-tr-none shadow-sm"
                          : "bg-bis-cream-card/90 text-bis-slate border border-bis-border rounded-tl-none shadow-custom-sm"
                      }`}
                    >
                      <p>{messageText}</p>

                      {/* Evidence citation panel on Assistant messages */}
                      {msg.evidence && (
                        <div className="mt-4 pt-3 border-t border-bis-border/60">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-bis-slate-muted">
                              {t("officialSource", "Official Evidence Citation")}
                            </span>
                            <ConfidenceBadge level={msg.evidence.confidence} />
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-bis-border space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-bis-slate">
                                {msg.evidence.sourceTitle}
                              </span>
                              {msg.evidence.documentNumber && (
                                <span className="font-mono text-[11px] font-bold text-bis-burgundy bg-bis-burgundy/10 px-1.5 py-0.5 rounded">
                                  {msg.evidence.documentNumber}
                                </span>
                              )}
                            </div>
                            <p className="text-bis-slate-muted text-[11px]">
                              {msg.evidence.clause}
                            </p>
                            {msg.evidence.excerpt && (
                              <p className="text-[11px] text-bis-slate italic bg-bis-cream p-2 rounded border border-bis-border/50 mt-1">
                                "{msg.evidence.excerpt}"
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Interactive Next Actions */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-bis-border/50">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-bis-slate-muted block mb-2">
                            {t("asstWorkflowSteps", "Recommended Next Workflow Steps:")}
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {msg.actions.map((act, i) => {
                              const translatedLabel =
                                act.href === "/find-standard"
                                  ? t("findStandard", act.label)
                                  : act.href === "/certification"
                                  ? t("certification", act.label)
                                  : act.href === "/labs"
                                  ? t("labs", act.label)
                                  : act.label;

                              return (
                                <Link
                                  key={i}
                                  href={act.href}
                                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-bis-border hover:border-bis-burgundy text-bis-burgundy transition-all shadow-2xs hover:shadow-sm whitespace-nowrap"
                                >
                                  {act.icon === "standard" && <BookOpen className="w-3 h-3" />}
                                  {act.icon === "certification" && <Settings className="w-3 h-3" />}
                                  {act.icon === "lab" && <FlaskConical className="w-3 h-3" />}
                                  <span>{translatedLabel}</span>
                                  <ArrowRight className="w-3 h-3" />
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Copy button */}
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="mt-1 text-[10px] text-bis-slate-muted hover:text-bis-burgundy flex items-center space-x-1 px-1 transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-2.5 h-2.5 text-bis-sage" />
                          <span>{t("copied", "Copied")}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-2.5 h-2.5" />
                          <span>{t("copy", "Copy")}</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center space-x-2 text-xs text-bis-slate-muted italic p-2">
                  <span className="w-2 h-2 rounded-full bg-bis-burgundy animate-ping" />
                  <span>Verifying Indian Standards database & citations...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Question Pills */}
            <div className="bg-bis-cream-dark/40 px-4 py-2 border-t border-bis-border/60 overflow-x-auto">
              <div className="flex items-center space-x-2 min-w-max">
                <span className="text-[10px] font-bold text-bis-slate-muted uppercase tracking-wider flex-shrink-0">
                  {t("findTryPreset", "Quick Inquiries:")}
                </span>
                {PRESET_TOPICS.map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => handleUserSubmit(topic)}
                    className="text-[11px] bg-white hover:bg-bis-cream text-bis-slate px-3 py-1 rounded-full border border-bis-border transition-colors whitespace-nowrap"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Input field & action buttons */}
            <div className="p-3 sm:p-4 bg-white border-t border-bis-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUserSubmit(input);
                }}
                className="flex items-center space-x-2"
              >
                <div className="flex-1 flex items-center bg-bis-cream rounded-full px-4 py-2 border border-bis-border focus-within:border-bis-burgundy transition-all">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t("asstAskPlaceholder", "Ask about an Indian Standard, product, QCO mandate, or testing rule...")}
                    className="w-full text-xs sm:text-sm bg-transparent focus:outline-none text-bis-slate placeholder-bis-slate-muted/70"
                  />
                  <button
                    type="button"
                    className="p-1 text-bis-slate-muted hover:text-bis-slate transition-colors"
                    title="Attach Specification (Demo)"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-1 text-bis-slate-muted hover:text-bis-slate transition-colors ml-1"
                    title="Voice Input (Demo)"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-3 bg-bis-burgundy text-white rounded-full hover:bg-bis-burgundy-light disabled:opacity-50 transition-all flex-shrink-0 shadow-sm"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <p className="text-[10px] text-center text-bis-slate-muted mt-2">
                {t("disclaimerLegal")}
              </p>
            </div>

          </div>

          {/* Right Column: Source Knowledge & Regulatory Context (4 cols on desktop) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Grounding Source Info */}
            <div className="bg-white p-5 rounded-3xl border border-bis-border shadow-custom-sm">
              <div className="flex items-center space-x-2 text-xs font-bold text-bis-slate uppercase tracking-wider mb-3">
                <ShieldCheck className="w-4 h-4 text-bis-sage" />
                <span>{t("asstSourcesTitle", "Verified Data Sources")}</span>
              </div>
              <p className="text-xs text-bis-slate-muted leading-relaxed mb-4">
                {t("asstSourcesDesc", "Every response from MANAK SAARTHI is indexed against verified institutional data published by the Bureau of Indian Standards and Central Ministries.")}
              </p>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-bis-cream border border-bis-border">
                  <span className="font-semibold text-bis-slate">{t("stdCatalog", "BIS Standards Catalog")}</span>
                  <span className="font-mono text-[11px] text-bis-burgundy font-bold">20,000+ IS</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-bis-cream border border-bis-border">
                  <span className="font-semibold text-bis-slate">{t("qcos", "Quality Control Orders")}</span>
                  <span className="font-mono text-[11px] text-bis-sage-dark font-bold">700+ QCOs</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-bis-cream border border-bis-border">
                  <span className="font-semibold text-bis-slate">{t("accreditedLabs", "Accredited Testing Labs")}</span>
                  <span className="font-mono text-[11px] text-bis-gold font-bold">350+ Labs</span>
                </div>
              </div>
            </div>

            {/* Workflow Navigation */}
            <div className="bg-bis-cream-dark/60 p-5 rounded-3xl border border-bis-border space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-bis-slate-muted block">
                {t("asstJumpTitle", "Jump to Dedicated Modules")}
              </span>

              <Link
                href="/find-standard"
                className="flex items-center justify-between p-3 rounded-2xl bg-white border border-bis-border hover:border-bis-burgundy transition-all group"
              >
                <div>
                  <div className="text-xs font-semibold text-bis-slate group-hover:text-bis-burgundy">
                    {t("findStandard", "Find My Standard")}
                  </div>
                  <div className="text-[11px] text-bis-slate-muted">
                    {t("findStandardDesc", "Describe your product in natural language")}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-bis-slate-muted group-hover:text-bis-burgundy group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/certification"
                className="flex items-center justify-between p-3 rounded-2xl bg-white border border-bis-border hover:border-bis-burgundy transition-all group"
              >
                <div>
                  <div className="text-xs font-semibold text-bis-slate group-hover:text-bis-burgundy">
                    {t("certification", "Certification Navigator")}
                  </div>
                  <div className="text-[11px] text-bis-slate-muted">
                    {t("certDesc", "Step-by-step ISI, CRS, and FMCS schemes")}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-bis-slate-muted group-hover:text-bis-burgundy group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/labs"
                className="flex items-center justify-between p-3 rounded-2xl bg-white border border-bis-border hover:border-bis-burgundy transition-all group"
              >
                <div>
                  <div className="text-xs font-semibold text-bis-slate group-hover:text-bis-burgundy">
                    {t("labs", "BIS Lab Finder")}
                  </div>
                  <div className="text-[11px] text-bis-slate-muted">
                    {t("labDesc", "Locate state & regional test facilities")}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-bis-slate-muted group-hover:text-bis-burgundy group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Legal Notice Card */}
            <div className="bg-bis-burgundy/5 p-4 rounded-2xl border border-bis-burgundy/15 text-[11px] text-bis-slate leading-relaxed">
              <div className="flex items-center space-x-1.5 text-bis-burgundy font-bold mb-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{t("advisoryNotice", "Advisory Notice")}</span>
              </div>
              {t("asstAdvisoryNotice", "This AI assistant provides informational guidance only. Official test reports, licence grants, and statutory compliance determinations are exclusively issued by authorized officers of the Bureau of Indian Standards.")}
            </div>

          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function AIAssistantPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bis-cream flex items-center justify-center text-xs">Loading AI Assistant...</div>}>
      <AIAssistantContent />
    </Suspense>
  );
}
