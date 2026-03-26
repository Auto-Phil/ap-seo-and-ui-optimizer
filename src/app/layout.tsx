import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auto-Phil | Free Homepage Audit",
  description:
    "Paste your URL and get a personalized SEO audit in 30 seconds — exact copy fixes for your title, H1, meta description, and CTA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
