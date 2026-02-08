// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Providers from "@/src/lib/Providers/Providers";
import { getSettings } from "@/src/lib/api/getSettings";
import AuthProvider from "../lib/Providers/AuthProvider";
import FCMProvider from "../lib/Providers/FCMProvider";
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Code Base",
  description: "Modern SEO friendly web application",
  robots: "index, follow",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings(); // ✅ SERVER SAFE

  return (
    <html lang="en">
      <body
        style={
          {
            backgroundColor: "white",
            color: "black",
            "--primary": settings.primaryColor,
            "--secondary": settings.secondaryColor,
            "--accent": settings.accentColor,
            "--text": settings.textColor,
            "--text-secondary": settings.textSecondary,
            "--border": settings.borderColor,
            "--active": settings.btnActive,
            "--card-bg": settings.cardBg,
            "--btn-bg": settings.btnBg,
            "--btn-text": settings.btnText,
            "--btn-hover": settings.btnHover,
            "--btn-active": settings.btnActive,
          } as React.CSSProperties
        }
        // className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
        className={`${openSans.className} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <AuthProvider>
            {/* ✅ client-only FCM logic */}
            <FCMProvider />

            <Toaster position="top-right" />
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
