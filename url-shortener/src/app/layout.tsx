// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "QuickLink — URL Shortener",
  description: "Shorten, manage, and share URLs with ease.",
  metadataBase:
    process.env.NODE_ENV === "production"
      ? new URL("https://website-shorten-url-qryv.vercel.app")
      : new URL("http://localhost:3000"),
  openGraph: {
    title: "QuickLink — URL Shortener",
    description: "Generate clean and short URLs with QuickLink.",
    url: "https://website-shorten-url-qryv.vercel.app",
    siteName: "QuickLink",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "QuickLink OG Image",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuickLink — URL Shortener",
    description: "Generate clean and short URLs with QuickLink.",
    images: ["/og-image.png"],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}
      >
        {children}
      </body>
    </html>
  );
}
