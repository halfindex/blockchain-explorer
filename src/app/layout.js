import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from 'react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "RDT Chain Explorer",
  description: "Explore blocks, transactions, and addresses on the RDT Chain",
};

import TopProgressBar from "../components/TopProgressBar";
const Spinner = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin"></div>
    </div>
  );
};
export default function RootLayout({ children }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="flex justify-center items-center py-12">
        <Spinner />
      </div>
    </div>}>
      <html lang="en" data-theme="rdtLightTheme">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#f0fdfa] dark:from-[#181f2a] dark:via-[#212e3a] dark:to-[#1a2636] relative`}
          style={{
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
          }}
        >
          <TopProgressBar />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 pointer-events-none animate-gradient-move z-0" style={{ backdropFilter: 'blur(2px)' }}></div>
          <div className="relative z-10 mt-14">
            {children}
          </div>
        </body>
      </html>
    </Suspense>
  );
}
