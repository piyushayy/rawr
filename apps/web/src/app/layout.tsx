import type { Metadata, Viewport } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Ticker } from "@/components/shared/Ticker";
import { Navbar } from "@/components/shared/Navbar";
import { PulseFeed } from "@/components/shared/PulseFeed";
import { Footer } from "@/components/shared/Footer";
import { CartDrawer } from "@/components/shared/CartDrawer";
import { createClient } from "@/utils/supabase/server";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevent zooming for "app-like" feel
};

export const metadata: Metadata = {
  title: "RAWR STORE | SCARCITY IS THE PRODUCT",
  description: "Limited edition drops. No restocks. Neo-brutalist fashion.",
  manifest: "/manifest.webmanifest", // Next.js usually serves from /manifest.webmanifest or /manifest.json if generated
  openGraph: {
    title: "RAWR STORE | SCARCITY IS THE PRODUCT",
    description: "Limited edition drops. No restocks. Join the pack.",
    url: "https://rawr.store", // Placeholder
    siteName: "RAWR",
    images: [
      {
        url: "https://rawr.store/og-default.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RAWR STORE",
    description: "Limited edition drops. No restocks.",
    images: ["https://rawr.store/og-default.jpg"],
  },
};

import { AnnouncementBar } from "@/components/shared/AnnouncementBar";
import { CookieConsent } from "@/components/shared/CookieConsent";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let clout = 0;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('clout_score').eq('id', user.id).single();
    if (profile) clout = profile.clout_score;
  }

  return (
    <html lang="en">
      <body
        className={`${oswald.variable} ${inter.variable} antialiased bg-background text-foreground uppercase-headings`}
      >
        <PulseFeed />
        <div className="flex flex-col min-h-screen">
          <AnnouncementBar />
          <Ticker />
          <Navbar user={user} clout={clout} />
          <CartDrawer />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster />
          <CookieConsent />
        </div>
      </body>
    </html>
  );
}
