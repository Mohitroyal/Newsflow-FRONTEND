import type { Metadata } from "next";
import { Inter, Playfair_Display, Noto_Sans } from "next/font/google";
import "./globals.css";
import { ConditionalShell } from "@/components/layout/ConditionalShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});
const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NewsCraft AI | Premium Multilingual Newspaper Clipping Generator",
    template: "%s | NewsCraft AI",
  },
  description:
    "AI-powered platform to generate beautiful, realistic newspaper clippings in English, Telugu, Hindi, Tamil, Kannada, and Malayalam instantly.",
  keywords: ["newspaper generator", "AI clipping", "multilingual newspaper", "Telugu newspaper", "hindi newspaper"],
  authors: [{ name: "NewsCraft AI" }],
  openGraph: {
    title: "NewsCraft AI — Multilingual Newspaper Generator",
    description: "Generate stunning newspaper clippings with AI in 6+ languages.",
    type: "website",
  },
  other: {
    "darkreader-lock": "true",
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${playfair.variable} ${notoSans.variable} font-sans min-h-screen flex flex-col bg-white text-black dark:bg-black dark:text-white antialiased`}>
        <ConditionalShell>{children}</ConditionalShell>
      </body>
    </html>
  );
}
