import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskFlow AI",
  description: "העוזר האישי שלך לניהול משימות ופרודוקטיביות עם AI.",
};

import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
        <body className="h-screen flex bg-[#09090b] text-slate-50 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col pb-24 lg:pb-0">
            {children}
          </main>
          <MobileNav />
          <Toaster richColors position="top-center" theme="dark" />
          <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" />
        </body>
    </html>
  );
}
