import type { Metadata } from "next";
import localFont from "next/font/local";
import { Dancing_Script } from 'next/font/google';
import "./globals.css";
import "./custom.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const dancing = Dancing_Script({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-dancing',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Ritvik's Portfolio",
  description: "Ritvik's Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dancing.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
