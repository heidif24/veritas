import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { LocaleProvider } from "./components/locale-provider";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Veritas — Trusted writing, verified",
  description:
    "The platform for academic and professional writing with clear provenance, originality checks, and sealed submissions.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-slate-900">
        <LocaleProvider>
          <div className="min-h-screen">
            <SiteHeader />
            <main className="w-full">{children}</main>
            <SiteFooter />
          </div>
        </LocaleProvider>
      </body>
    </html>
  );
}
