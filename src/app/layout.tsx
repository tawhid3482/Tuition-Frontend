import type { Metadata } from "next";
import "./globals.css";
import { Geist_Mono, Open_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Providers from "@/src/lib/Providers/Providers";
import { getSettings } from "@/src/lib/api/getSettings";
import AuthProvider from "../lib/Providers/AuthProvider";
import FCMProvider from "../lib/Providers/FCMProvider";
import { SITE_NAME, SITE_URL } from "@/src/config/site";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Modern E-commerce`,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Secure and modern e-commerce platform for shopping quality products.",
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Modern E-commerce`,
    description: "Secure and modern e-commerce platform for shopping quality products.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Modern E-commerce`,
    description: "Secure and modern e-commerce platform for shopping quality products.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

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
        className={`${openSans.className} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <AuthProvider>
            <FCMProvider />
            <Toaster position="top-right" />
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
