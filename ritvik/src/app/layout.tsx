import type { Metadata } from "next";
import localFont from "next/font/local";
import { Bricolage_Grotesque, DM_Sans, Dancing_Script } from 'next/font/google';
import "./globals.css";
import "./custom.css";

const marvin = localFont({
  src: [
    { path: "./fonts/marvin/MarvinVisionsBig-Bold.woff2", weight: "700" },
    { path: "./fonts/marvin/MarvinVisionsBig-Bold.woff", weight: "700" },
  ],
  variable: "--font-marvin",
  display: "swap",
});
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});
const dancing = Dancing_Script({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-dancing',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Ritvik Joshi — AI & Full-Stack Engineer",
  description:
    "AI & full-stack engineer in London. Building AI systems for aviation at SITA, FasterFoods after hours, and running ultramarathons in between. Come play with the demos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${marvin.variable} ${bricolage.variable} ${dmSans.variable} ${dancing.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
