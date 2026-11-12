import type { Metadata } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";

const plex = IBM_Plex_Sans_Thai({
  variable: "--font-plex-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "แจ้งซ่อมบ้าน",
  description: "ระบบแจ้งซ่อมสำหรับลูกบ้านและช่างซ่อม",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th" className={`${plex.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-[#98E8DE]/10 font-sans text-[#3E3E75] antialiased selection:bg-[#45A9A9]/25 selection:text-[#4E1F6E]">
        {children}
      </body>
    </html>
  );
}