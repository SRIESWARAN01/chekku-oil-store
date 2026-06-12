import type { Metadata, Viewport } from "next";
import { Fraunces, JetBrains_Mono, Manrope } from "next/font/google";
import { LanguageProvider } from "@/lib/language-context";
import { MobileNav } from "@/components/mobile-nav";
import { IntroAnimation } from "@/components/intro-animation";
import { Toaster } from "@/components/toaster";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Thennaiyan Coconut Company - Coconut Products",
  description:
    "Tamil Nadu-based proprietorship business registered under GST for coconut-related trading and business activities.",
  openGraph: {
    title: "Thennaiyan Coconut Company - Coconut Products",
    description:
      "GST-registered coconut products and trading business from Peraiyur, Madurai District, Tamil Nadu.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#336633",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
  }: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <LanguageProvider>
          <IntroAnimation />
          <Toaster />
          {children}
          <MobileNav />
        </LanguageProvider>
      </body>
    </html>
  );
}
