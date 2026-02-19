import Login from "@/src/components/Auth/Login";
import { LoginStructuredData } from "@/src/components/Auth/LoginStructuredData";
import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/src/config/site";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to access your account and manage orders securely.",
  openGraph: {
    title: `Sign In | ${SITE_NAME}`,
    description: "Secure login to access your account dashboard.",
    type: "website",
    locale: "en_US",
    url: `${SITE_URL}/login`,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `Sign In | ${SITE_NAME}`,
    description: "Secure login to access your account dashboard.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${SITE_URL}/login`,
  },
};

export default function LoginPage() {
  return (
    <>
      <LoginStructuredData />
      <Login />
    </>
  );
}
