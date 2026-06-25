import type { Metadata } from "next";
import { Geist, Geist_Mono, Rubik_Spray_Paint } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { DemoModeBanner } from "@/components/DemoModeBanner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rubikSpray = Rubik_Spray_Paint({
  variable: "--font-rubik-spray",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Carrera Gourmet — Taste Mexico Like a Local",
  description:
    "Connect with authentic Mexican street food during the 2026 World Cup. AI recommendations, translations, and instant reservations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${rubikSpray.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-full flex flex-col">
        <DemoModeBanner />
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
