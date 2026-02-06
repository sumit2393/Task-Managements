import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Initialize Geist Sans font for body text
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Initialize Geist Mono font for code/technical text
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Metadata for the entire application
 * Used by Next.js for SEO and document head
 */
export const metadata: Metadata = {
  title: "Task Management App",
  description: "Organize your tasks efficiently",
};

/**
 * RootLayout Component
 * Main layout component for the entire application
 * - Applies dark theme via 'dark' class on html element
 * - Uses black background with white text globally
 * - Wraps all page content through children prop
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // html element with 'dark' class enables dark theme (permanent)
    <html lang="en" className="dark">
      {/* 
        Body with:
        - Font variables for custom font loading
        - antialiased for smoother text rendering
        - bg-black for black background
        - text-white for white text color
      */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
