import type { Metadata } from "next";

import { Providers } from "@/components/shared/providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "Maktba Store",
  description:
    "Modern stationery e-commerce for school, office, and creative supplies in Tunisia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className="h-full scroll-smooth antialiased"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
