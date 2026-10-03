import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import type { ReactNode } from "react";
import { BootSplash } from "./components/boot-splash";
import { LocaleProvider } from "./components/locale-provider";
import { PwaRegister } from "./components/pwa-register";
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

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Veritas — Authorship you can prove",
  description:
    "Veritas seals academic writing with verifiable integrity. Process evidence, cryptographic seals, and fair review for universities, publishers, and authors.",
  applicationName: "Veritas",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Veritas",
  },
  icons: {
    icon: [{ url: "/icons/icon-192.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/icon-192.svg" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-slate-900">
        <LocaleProvider>
          <PwaRegister />
          <BootSplash />
          <div className="min-h-screen">
            <SiteHeader />
            <div className="w-full">{children}</div>
            <SiteFooter />
          </div>
        </LocaleProvider>
      </body>
    </html>
  );
}
