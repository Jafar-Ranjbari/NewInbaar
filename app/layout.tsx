"use client";

import "./globals.css";
import localFont from "next/font/local";
import Header from "./landing/Header";
import Footer from "./landing/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import InstallPrompt from "./components/tools/pwa/InstallPrompt";

const iranSans = localFont({
  src: [
    { path: "../public/fonts/IRANSansXFaNum-Regular.woff", weight: "400", style: "normal" },
    { path: "../public/fonts/IRANSansXFaNum-Medium.woff", weight: "500", style: "normal" },
    { path: "../public/fonts/IRANSansXFaNum-Bold.woff", weight: "700", style: "normal" },
    { path: "../public/fonts/IRANSansXFaNum-ExtraBold.woff", weight: "800", style: "normal" },
  ],
  variable: "--font-iransans",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="fa" dir="rtl" className={iranSans.variable}>
      <head>
        {/* ✅ PWA support */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0b1d48" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>

      <body className="font-[var(--font-iransans)] bg-[#000516] text-white overflow-x-hidden">
        <QueryClientProvider client={queryClient}>
          <Header />
          {children}
          <Footer />
          <InstallPrompt /> {/* 👈 Suggests install on mobile */}
        </QueryClientProvider>
      </body>
    </html>
  );
}
