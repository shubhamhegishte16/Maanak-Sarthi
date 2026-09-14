"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/shared/PageHeader";
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
  Check,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Plus,
  MessageSquare
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { chatApi, type ChatMessage, type ChatSession } from "@/lib/api";

interface AssistantMessage {
  id: string;
  sender: "user" | "assistant";
  timestamp: string;
  text: string;
  mode?: "bis_grounded" | "general" | "clarification";
  intent?: string;
  evidence?: {
    sourceTitle: string;
    documentNumber?: string;
    clause?: string;
    excerpt?: string;
    verifiedDate?: string;
    confidence: "high" | "medium" | "low";
  };
  sources?: {
    title: string;
    url: string;
    domain: string;
    documentNumber?: string;
    clause?: string;
    excerpt?: string;
    confidence: "high" | "medium" | "low";
  }[];
  actions?: {
    label: string;
    href: string;
    icon: "standard" | "certification" | "lab";
  }[];
  followUpQuestions?: string[];
  disclaimer?: string;
}

const INITIAL_MESSAGES: AssistantMessage[] = [
  {
    id: "m1",
    sender: "assistant",
    timestamp: "10:30 AM",
    text: "Namaste! I am your MANAK SAARTHI AI Assistant. I provide source-grounded guidance on Indian Standards (IS), Quality Control Orders (QCOs), testing protocols, and BIS certification schemes, as well as general AI inquiries. How can I assist you today?",
    actions: [
      { label: "Find My Standard", href: "/find-standard", icon: "standard" },
      { label: "Certification Navigator", href: "/certification", icon: "certification" },
      { label: "Locate BIS Lab", href: "/labs", icon: "lab" },
    ],
  },
];

const PRESET_TOPICS = [
  "What BIS standards apply to opening a cake shop or bakery?",
  "Does my electric water heater require mandatory BIS certification?",
  "What Indian Standard applies to lithium-ion batteries?",
  "What is IS 17526?",
  "What is HUID in gold jewellery hallmarking?",
  "Explain Scheme I (ISI) vs Scheme II (CRS) certification",
];

function AIAssistantContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<AssistantMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, "positive" | "negative">>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat sessions on mount
  useEffect(() => {
    chatApi.getChats()
      .then((res) => {
        if (res.data?.sessions) {
          setSessions(res.data.sessions);
        }
      })
      .catch(() => {
        // Silently continue for guest sessions
      });
  }, []);

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

  const handleUserSubmit = async (queryText: string) => {
    if (!queryText.trim() || isTyping) return;

    const userMsg: AssistantMessage = {
      id: Date.now().toString(),
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: queryText.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await chatApi.sendMessage({
        sessionId: sessionId ?? undefined,
        message: queryText.trim(),
      });

      const data = response.data;
      if (data?.sessionId) {
        setSessionId(data.sessionId);
      }

      const assistantMsg = data.message;
      const formattedReply: AssistantMessage = {
        id: assistantMsg.id,
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: assistantMsg.content,
        mode: assistantMsg.mode,
        intent: assistantMsg.intent,
        evidence: assistantMsg.evidence,
        sources: assistantMsg.sources,
        actions: assistantMsg.actions,
        followUpQuestions: assistantMsg.followUpQuestions,
        disclaimer: assistantMsg.disclaimer,
      };

      setMessages((prev) => [...prev, formattedReply]);

      // Refresh recent sessions
      chatApi.getChats()
        .then((res) => {
          if (res.data?.sessions) setSessions(res.data.sessions);
        })
        .catch(() => {});
    } catch (err: unknown) {
      const fallbackReply: AssistantMessage = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: "The AI service is temporarily unavailable or unable to reach the official verification index. Please verify your connection and try again.",
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = async (msgId: string, rating: "positive" | "negative") => {
    try {
      setFeedbackGiven((prev) => ({ ...prev, [msgId]: rating }));
      await chatApi.submitFeedback(msgId, rating);
    } catch {
      // Non-blocking UI
    }
  };

  const handleNewChat = () => {
    setSessionId(null);
    setMessages(INITIAL_MESSAGES);
  };

  const handleLoadSession = async (sId: string) => {
    if (sId === sessionId) return;
    setIsTyping(true);
    try {
      const res = await chatApi.getChatMessages(sId);
      if (res.data?.messages && res.data.messages.length > 0) {
        setSessionId(sId);
        const mapped: AssistantMessage[] = res.data.messages.map((m) => ({
          id: m.id,
          sender: m.role as "user" | "assistant",
          timestamp: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Earlier",
          text: m.content,
          mode: m.mode,
          intent: m.intent,
          evidence: m.evidence,
          sources: m.sources,
          actions: m.actions,
          followUpQuestions: m.followUpQuestions,
          disclaimer: m.disclaimer,
        }));
        setMessages(mapped);
      }
    } catch {
      // Keep current state
    } finally {
      setIsTyping(false);
    }
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

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleNewChat}
                  className="text-bis-burgundy hover:bg-bis-burgundy/10 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 transition-colors"
                  title="Start New Chat"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Chat</span>
                </button>

                <button
                  onClick={() => setMessages(INITIAL_MESSAGES)}
                  className="text-bis-slate-muted hover:text-bis-burgundy text-xs flex items-center space-x-1 transition-colors px-2 py-1"
                  title="Reset Conversation"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t("reset", "Reset")}</span>
                </button>
              </div>
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
                      {msg.mode === "bis_grounded" && (
                        <span className="bg-bis-sage/20 text-bis-sage-dark px-1.5 py-0.2 text-[9px] font-bold rounded">
                          OFFICIAL BIS
                        </span>
                      )}
                      {msg.mode === "clarification" && (
                        <span className="bg-amber-100 text-amber-800 px-1.5 py-0.2 text-[9px] font-bold rounded">
                          CLARIFICATION NEEDED
                        </span>
                      )}
                    </div>

                    <div
                      className={`max-w-2xl rounded-2xl p-4 sm:p-5 transition-all text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? "bg-bis-burgundy text-white rounded-tr-none shadow-sm"
                          : "bg-bis-cream-card/90 text-bis-slate border border-bis-border rounded-tl-none shadow-custom-sm"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{messageText}</div>

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
                            {msg.evidence.clause && (
                              <p className="text-bis-slate-muted text-[11px]">
                                {msg.evidence.clause}
                              </p>
                            )}
                            {msg.evidence.excerpt && (
                              <p className="text-[11px] text-bis-slate italic bg-bis-cream p-2 rounded border border-bis-border/50 mt-1">
                                "{msg.evidence.excerpt}"
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Official Sources & Gazette Citations */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-bis-border/60 space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-bis-slate-muted block">
                            Verified Sources & Citations:
                          </span>
                          <div className="space-y-1.5">
                            {msg.sources.map((s, sIdx) => (
                              <div
                                key={sIdx}
                                className="bg-white p-2.5 rounded-xl border border-bis-border text-xs flex items-center justify-between gap-2"
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="font-semibold text-bis-slate truncate">
                                    {s.title}
                                  </div>
                                  <div className="text-[10px] text-bis-slate-muted flex items-center space-x-2">
                                    <span className="font-mono">{s.domain}</span>
                                    {s.documentNumber && <span>• {s.documentNumber}</span>}
                                    {s.clause && <span>• {s.clause}</span>}
                                  </div>
                                </div>
                                <a
                                  href={s.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-shrink-0 inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-bis-cream hover:bg-bis-cream-dark text-bis-burgundy border border-bis-border transition-colors"
                                >
                                  <span>Open Source</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            ))}
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

                      {/* Follow-up question pills */}
                      {msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-bis-border/50">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-bis-slate-muted block mb-1.5">
                            Suggested Follow-up Inquiries:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.followUpQuestions.map((fq, fqIdx) => (
                              <button
                                key={fqIdx}
                                onClick={() => handleUserSubmit(fq)}
                                className="text-[11px] bg-white hover:bg-bis-cream text-bis-slate px-2.5 py-1 rounded-full border border-bis-border transition-colors text-left"
                              >
                                {fq}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* High-stakes regulatory disclaimer */}
                      {msg.disclaimer && (
                        <div className="mt-3 text-[10px] text-bis-slate-muted italic bg-bis-burgundy/5 p-2 rounded-lg border border-bis-burgundy/10">
                          ⚖️ {msg.disclaimer}
                        </div>
                      )}
                    </div>

                    {/* Bottom action row: Copy & Feedback */}
                    <div className="flex items-center space-x-3 mt-1 px-1">
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="text-[10px] text-bis-slate-muted hover:text-bis-burgundy flex items-center space-x-1 transition-colors"
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

                      {!isUser && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleFeedback(msg.id, "positive")}
                            className={`text-[10px] flex items-center space-x-1 hover:text-bis-sage transition-colors ${
                              feedbackGiven[msg.id] === "positive" ? "text-bis-sage font-bold" : "text-bis-slate-muted"
                            }`}
                            title="Helpful response"
                          >
                            <ThumbsUp className="w-2.5 h-2.5" />
                            <span>Helpful</span>
                          </button>
                          <button
                            onClick={() => handleFeedback(msg.id, "negative")}
                            className={`text-[10px] flex items-center space-x-1 hover:text-red-500 transition-colors ${
                              feedbackGiven[msg.id] === "negative" ? "text-red-500 font-bold" : "text-bis-slate-muted"
                            }`}
                            title="Inaccurate response"
                          >
                            <ThumbsDown className="w-2.5 h-2.5" />
                            <span>Not helpful</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center space-x-2 text-xs text-bis-slate-muted italic p-2">
                  <span className="w-2 h-2 rounded-full bg-bis-burgundy animate-ping" />
                  <span>Verifying official BIS records & generating grounded response...</span>
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
            
            {/* Recent Conversations / Sessions */}
            {sessions.length > 0 && (
              <div className="bg-white p-5 rounded-3xl border border-bis-border shadow-custom-sm">
                <div className="flex items-center space-x-2 text-xs font-bold text-bis-slate uppercase tracking-wider mb-3">
                  <MessageSquare className="w-4 h-4 text-bis-burgundy" />
                  <span>Recent Conversations</span>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {sessions.slice(0, 5).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleLoadSession(s.id)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-colors flex items-center justify-between ${
                        s.id === sessionId
                          ? "bg-bis-burgundy/10 border-bis-burgundy text-bis-burgundy font-semibold"
                          : "bg-bis-cream border-bis-border hover:border-bis-burgundy text-bis-slate"
                      }`}
                    >
                      <span className="truncate flex-1 mr-2">{s.title}</span>
                      <span className="text-[10px] text-bis-slate-muted flex-shrink-0">
                        {s.message_count} msgs
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

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
