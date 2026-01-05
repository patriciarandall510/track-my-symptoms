import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavUserStatus } from "../components/NavUserStatus";
import { NavLinks } from "../components/NavLinks";
import { MobileMenu } from "../components/MobileMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Symptom Tracker",
  description: "Track pain levels, PT, and activity over time.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 dark:bg-slate-900 overflow-x-hidden`}
      >
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-700">
            <div className="mx-auto max-w-5xl px-2 py-2 sm:px-6 sm:py-4 lg:px-8 flex items-center justify-between gap-1.5 sm:gap-4">
              <div className="flex items-center gap-1.5 sm:gap-4 flex-1 min-w-0 overflow-hidden">
                <Link href="/" className="text-sm sm:text-lg font-semibold tracking-tight truncate text-slate-900 dark:text-slate-100">
                  Symptom Tracker
                </Link>
                <NavLinks />
              </div>
              <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
                <Link
                  href="/settings"
                  className="hidden text-sm text-slate-600 hover:text-slate-900 md:inline"
                >
                  Settings
                </Link>
                <NavUserStatus />
                <MobileMenu />
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-x-hidden w-full max-w-full">
            <div className="mx-auto max-w-5xl w-full px-2 py-2 sm:px-4 sm:py-4 lg:px-8 lg:py-8 space-y-3 sm:space-y-6 overflow-hidden">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

