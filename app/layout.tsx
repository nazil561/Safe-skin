import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "SafeSkin — Label review and ingredient guidance",
  description: "Plain-language ingredient checks. Educational information only, not medical advice.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Sidebar />
        <div className="min-h-screen w-full lg:pl-60">
          <div className="mx-auto w-full max-w-[480px] px-4 sm:px-5 md:max-w-[820px] md:px-6 xl:max-w-[1180px] xl:px-8">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
