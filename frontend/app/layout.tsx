import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BIS Guidance | Indian Standards for a Safer Tomorrow",
  description: "Accurate, source-grounded information on Indian Standards, Quality Control Orders, certification schemes, and BIS-recognized labs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-bis-cream text-bis-slate antialiased selection:bg-bis-burgundy selection:text-white">
        {children}
      </body>
    </html>
  );
}
