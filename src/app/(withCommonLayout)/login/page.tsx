import Login from '@/src/components/Auth/Login';
import { LoginStructuredData } from '@/src/components/Auth/LoginStructuredData';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In to Your Account | Your Company',
  description: 'Sign in to access your dashboard and manage your account securely. Login with your email and password.',
  keywords: ['login', 'sign in', 'authentication', 'secure login', 'account access'],
  authors: [{ name: 'Your Company' }],
  openGraph: {
    title: 'Sign In to Your Account',
    description: 'Secure login to access your dashboard and account features',
    type: 'website',
    locale: 'en_US',
    url: 'https://yourdomain.com/login',
    siteName: 'Your Company',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sign In to Your Account',
    description: 'Secure login to access your dashboard and account features',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://yourdomain.com/login',
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