import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Providers from "@/src/lib/Providers/Providers";
import { getSettings } from "@/src/lib/api/getSettings";
import AuthProvider from "../lib/Providers/AuthProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
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
  const settings = await getSettings(); // ✅ SERVER SIDE

  return (
    <html lang="en">
      <body
        style={
          {
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
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
      >
        <Providers>
          <AuthProvider>
            <Toaster position="top-right" />
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
