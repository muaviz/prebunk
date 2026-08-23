import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "Prebunk — Narrative Intelligence",
  description: "A weather radar for Islamophobia.",
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
