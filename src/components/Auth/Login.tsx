/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
  User,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Head from "next/head";
import toast from "react-hot-toast";
import { useLoginUserMutation } from "@/src/redux/features/auth/authApi";

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const getInitialFormData = () => {
    if (typeof window !== "undefined") {
      const rememberedEmail = localStorage.getItem("userEmail");
      const isRemembered = localStorage.getItem("rememberMe") === "true";

      if (rememberedEmail && isRemembered) {
        return {
          email: rememberedEmail,
          password: "",
          rememberMe: true,
        };
      }
    }
    return {
      email: "",
      password: "",
      rememberMe: false,
    };
  };

  const [formData, setFormData] = useState(getInitialFormData());

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation rules
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!re.test(email)) return "Please enter a valid email";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: Record<string, string> = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      // Show error toast for validation errors
      Object.values(newErrors).forEach((error) => {
        toast.error(error);
      });

      return;
    }

    try {
      // Show loading toast
      const loadingToast = toast.loading("Signing in...");

      // Call login mutation
      const result = await loginUser({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      toast.dismiss(loadingToast);

      if (result?.data) {
        if (formData.rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("userEmail", formData.email);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("userEmail");
        }
        toast.success(
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Successfully logged in!</span>
          </div>,
          {
            duration: 3000,
            position: "top-right",
            style: {
              background: "#f0fdf4",
              color: "#166534",
              border: "1px solid #bbf7d0",
            },
          },
        );

        // Reset form
        setFormData({
          email: "",
          password: "",
          rememberMe: false,
        });

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (err: any) {
      let errorMessage = "Login failed. Please try again";

      if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.data?.error) {
        errorMessage = err.data.error;
      } else if (err?.status === 401) {
        errorMessage = "Invalid email or password";
      } else if (err?.status === 404) {
        errorMessage = "User not found";
      } else if (err?.status === 400) {
        errorMessage = "Invalid request data";
      } else if (err?.status === 500) {
        errorMessage = "Server error. Please try again later";
      }

      // Show error toast
      toast.error(
        <div className="flex items-center space-x-2">
          <XCircle className="w-4 h-4 text-red-500" />
          <span>{errorMessage}</span>
        </div>,
        {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fecaca",
          },
        },
      );
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  return (
    <>
      {/* SEO Head Section */}
      <Head>
        <title>Sign In to Your Account | Your Company</title>
        <meta
          name="description"
          content="Sign in to access your dashboard and manage your account securely. Login with your email and password."
        />
        <meta
          name="keywords"
          content="login, sign in, authentication, secure login, account access"
        />
        <meta name="author" content="Your Company" />
        <meta property="og:title" content="Sign In to Your Account" />
        <meta
          property="og:description"
          content="Secure login to access your dashboard and account features"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/login" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sign In to Your Account" />
        <meta
          name="twitter:description"
          content="Secure login to access your dashboard and account features"
        />
        <link rel="canonical" href="https://yourdomain.com/login" />
      </Head>

      {/* Breadcrumb Navigation for SEO */}
      <nav aria-label="Breadcrumb" className="sr-only">
        <ol itemScope itemType="https://schema.org/BreadcrumbList">
          <li
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <Link href="/" itemProp="item">
              <span itemProp="name">Home</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>
          <li
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <span itemProp="name">Login</span>
            <meta itemProp="position" content="2" />
          </li>
        </ol>
      </nav>

      <div className="min-h-screen bg-linear-to-br from-primary/5 via-white to-primary/10 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Card Container with ARIA landmark */}
          <main role="main" aria-label="Login form">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Card Header with proper heading hierarchy */}
              <header className="p-6 sm:p-8 pb-0">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="relative w-12 h-12 rounded-xl bg-linear-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                      <LogIn className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Welcome Back
                  </h1>
                  <p className="text-sm text-gray-600">
                    Please enter your credentials to continue
                  </p>
                </div>
              </header>

              {/* Form Content */}
              <section
                aria-labelledby="login-form-title"
                className="p-6 sm:p-8"
              >
                <h2 id="login-form-title" className="sr-only">
                  Login Form
                </h2>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  aria-label="Login form"
                >
                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail
                          className="h-4 w-4 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`text-sm pl-9 w-full px-3 text-black py-2.5 rounded-lg border ${errors.email ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-primary focus:border-primary"} focus:outline-none focus:ring-1 transition-all duration-200`}
                        placeholder="you@example.com"
                        aria-describedby={
                          errors.email ? "email-error" : undefined
                        }
                        aria-invalid={!!errors.email}
                      />
                    </div>
                    {errors.email && (
                      <p
                        id="email-error"
                        className="text-xs text-red-600 flex items-center space-x-1"
                        role="alert"
                        aria-live="polite"
                      >
                        <XCircle className="w-3 h-3" aria-hidden="true" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-xs font-medium text-gray-700"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock
                          className="h-4 w-4 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`text-sm pl-9 pr-9 w-full px-3 py-2.5 rounded-lg text-black border ${errors.password ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-primary focus:border-primary"} focus:outline-none focus:ring-1 transition-all duration-200`}
                        placeholder="••••••••"
                        aria-describedby={
                          errors.password ? "password-error" : undefined
                        }
                        aria-invalid={!!errors.password}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        aria-pressed={showPassword}
                      >
                        {showPassword ? (
                          <EyeOff
                            className="h-4 w-4 text-gray-400 hover:text-gray-600"
                            aria-hidden="true"
                          />
                        ) : (
                          <Eye
                            className="h-4 w-4 text-gray-400 hover:text-gray-600"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p
                        id="password-error"
                        className="text-xs text-red-600 flex items-center space-x-1"
                        role="alert"
                        aria-live="polite"
                      >
                        <XCircle className="w-3 h-3" aria-hidden="true" />
                        <span>{errors.password}</span>
                      </p>
                    )}
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="h-3.5 w-3.5 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label
                      htmlFor="rememberMe"
                      className="ml-2 text-xs text-gray-700"
                    >
                      Remember me for 30 days
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium text-sm py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                    aria-label={isLoading ? "Signing in..." : "Sign in"}
                  >
                    {isLoading ? (
                      <>
                        <Loader2
                          className="w-4 h-4 animate-spin"
                          aria-hidden="true"
                        />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" aria-hidden="true" />
                        <span>Sign In</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                  </div>
                </div>

                {/* Sign Up Navigation */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">
                      Don't have an account?{" "}
                      <Link
                        href="/registration"
                        className="font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center group"
                        aria-label="Create an account"
                      >
                        <User
                          className="w-3 h-3 mr-1 group-hover:scale-110 transition-transform"
                          aria-hidden="true"
                        />
                        Create an account
                      </Link>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Get started with our platform in just a few clicks
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </main>

          {/* Footer Links */}
          <footer className="mt-6 text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-gray-500">
              <Link
                href="/privacy"
                className="hover:text-gray-700 transition-colors"
                aria-label="Privacy Policy"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-300" aria-hidden="true">
                •
              </span>
              <Link
                href="/terms"
                className="hover:text-gray-700 transition-colors"
                aria-label="Terms of Service"
              >
                Terms of Service
              </Link>
              <span className="text-gray-300" aria-hidden="true">
                •
              </span>
              <Link
                href="/help"
                className="hover:text-gray-700 transition-colors"
                aria-label="Help Center"
              >
                Help Center
              </Link>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              © {new Date().getFullYear()} Your Company. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Login;
