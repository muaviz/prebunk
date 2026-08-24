import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "Prebunk — Narrative Intelligence Against Anti-Muslim Hate",
  description: "A weather radar for Islamophobia. Track, debunk, and prepare for anti-Muslim misinformation before it spreads.",
  openGraph: {
    title: "Prebunk — Narrative Intelligence",
    description: "Track, debunk, and prepare for anti-Muslim misinformation before it spreads.",
    url: "https://prebunk.vercel.app",
    siteName: "Prebunk",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prebunk — Narrative Intelligence",
    description: "A weather radar for Islamophobia.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="" suppressHydrationWarning>
      <body className={`${inter.className} ${spaceGrotesk.variable} bg-background text-foreground antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
