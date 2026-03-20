import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "w.max — Free Homepage Audit",
  description: "See what your homepage could be. Paste your URL and get an AI-optimized version in 15 seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
