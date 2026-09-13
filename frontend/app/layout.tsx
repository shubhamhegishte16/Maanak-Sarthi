import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "MANAK SAARTHI | Intelligent Assistant for Indian Standards & BIS Services",
  description: "Accurate, source-grounded guidance on Indian Standards, Quality Control Orders, certification schemes, and BIS-recognized testing networks. Ministry of Consumer Affairs, Government of India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-bis-cream text-bis-slate antialiased selection:bg-bis-burgundy selection:text-white">
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
