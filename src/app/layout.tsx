import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./NavBar";
import Footer from "./Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cuegenius.synthqa.app"),
  title: {
    default: "CueGenius — Pool League Performance Tracker",
    template: "%s · CueGenius",
  },
  description:
    "Track your APA and FargoRate matches and see the skill level you're really performing at over your last 10 games.",
  keywords: [
    "pool",
    "billiards",
    "APA",
    "FargoRate",
    "8-ball",
    "9-ball",
    "pool league",
    "skill level",
    "performance tracker",
    "pool stats",
    "cue sports",
    "league tracker",
  ],
  authors: [{ name: "SynthQA" }],
  creator: "SynthQA",
  openGraph: {
    type: "website",
    url: "https://cuegenius.synthqa.app",
    siteName: "CueGenius",
    title: "CueGenius — Know how you're really playing",
    description:
      "Track your matches and see the skill level you're performing at over your last 10 games.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "CueGenius — Pool League Performance Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CueGenius — Pool Performance Tracker",
    description: "See the skill level you're really playing at.",
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <NavBar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
