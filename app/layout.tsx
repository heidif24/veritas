import type { Metadata, Viewport } from "next";
import { Geist_Mono, Instrument_Serif, Work_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { BootSplash } from "./components/boot-splash";
import { LocaleProvider } from "./components/locale-provider";
import { PwaRegister } from "./components/pwa-register";
import { PublicChrome } from "./components/public-chrome";
import "./globals.css";

// Variable fonts: do not pass a weight array (avoids Next 16.3.x internal CSS module resolution bugs on Vercel)
const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Veritas — Academic integrity for universities",
  description:
    "Veritas is licensed exclusively to universities. Capture composition process, support instructor review, and seal submissions with cryptographic proof — customized for your campus.",
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
  themeColor: "#101815",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${workSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--paper)] text-[var(--ink)] font-sans">
        <LocaleProvider>
          <PwaRegister />
          <BootSplash />
          <PublicChrome>{children}</PublicChrome>
        </LocaleProvider>
      </body>
    </html>
  );
}
