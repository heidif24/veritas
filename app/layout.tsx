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
  title: "Veritas — Prove how it was built",
  description:
    "Stop guessing if AI wrote it. Veritas records a cryptographic process trail and seals academic writing with Ed25519 + SHA-256 so authorship can be verified — not guessed.",
  applicationName: "Veritas",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Veritas",
  },
  icons: {
    icon: [{ url: "/icons/icon-192.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/icon-192.svg" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#050505] text-zinc-100">
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
