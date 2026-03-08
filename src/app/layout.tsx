import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "w.max — Free Homepage Audit",
  description:
    "Paste your URL. In 15 seconds, see your page rebuilt for SEO and conversions — side by side with your original.",
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
