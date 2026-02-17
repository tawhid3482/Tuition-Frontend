/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Head from "next/head";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  UserPlus,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  Phone,
  Camera,
} from "lucide-react";

const RegistrationPage = () => {
  const router = useRouter();

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    avatar: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation functions
  const validateName = (name: string) => {
    if (!name) return "Name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    if (name.length > 50) return "Name must be less than 50 characters";
    return "";
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!re.test(email)) return "Please enter a valid email";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password))
      return "Password must contain letters and numbers";
    return "";
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) return "Confirm password is required";
    if (confirmPassword !== formData.password) return "Passwords do not match";
    return "";
  };

  const validatePhone = (phone: string) => {
    if (!phone) return "Phone number is required";
    // Simple phone validation (at least 10 digits, optional +)
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{4,10}$/;
    if (!phoneRegex.test(phone)) return "Please enter a valid phone number";
    return "";
  };

  // Input handler for text fields
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // File input handler for avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, avatar: file }));
    if (errors.avatar) {
      setErrors((prev) => ({ ...prev, avatar: "" }));
    }
  };

  // Submit handler (just console.log)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validate form
    const newErrors: Record<string, string> = {};

    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword);
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    // Avatar is optional, so no validation needed

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Object.values(newErrors).forEach((error) => {
        // Use alert for simplicity, but you could also show a toast
        alert(error);
      });
      setIsLoading(false);
      return;
    }

    // Prepare data object for console
    const submissionData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      avatar: formData.avatar ? formData.avatar.name : null, // Just log file name for demo
    };

    console.log("Form submitted:", submissionData);
    alert("Check console for form data");

    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>Create Account | Sign Up</title>
        <meta
          name="description"
          content="Create a new account to join our platform."
        />
        <meta name="keywords" content="sign up, register, create account" />
        <meta name="author" content="Your Company" />
        <meta property="og:title" content="Create Account" />
        <meta property="og:description" content="Join our platform today" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/registration" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Create Account" />
        <meta name="twitter:description" content="Join our platform today" />
        <link rel="canonical" href="https://yourdomain.com/registration" />
      </Head>

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
            <span itemProp="name">Registration</span>
            <meta itemProp="position" content="2" />
          </li>
        </ol>
      </nav>

      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-medium text-gray-600 hover:text-primary mb-6 transition-colors"
            aria-label="Go back to home page"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-2" />
            Back to home
          </Link>

          <main role="main" aria-label="Registration form">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <header className="p-6 sm:p-8 pb-0">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                      <UserPlus className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Create Account
                  </h1>
                  <p className="text-sm text-gray-600">
                    Fill in your details to get started
                  </p>
                </div>
              </header>

              <section
                aria-labelledby="registration-form-title"
                className="p-6 sm:p-8"
              >
                <h2 id="registration-form-title" className="sr-only">
                  Registration Form
                </h2>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  aria-label="Registration form"
                >
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="name"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`text-sm pl-9 w-full px-3 py-2.5 rounded-lg border text-black ${errors.name
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-primary focus:border-primary"
                          } focus:outline-none focus:ring-1 transition-all duration-200`}
                        placeholder="John Doe"
                        aria-describedby={errors.name ? "name-error" : undefined}
                        aria-invalid={!!errors.name}
                      />
                    </div>
                    {errors.name && (
                      <p
                        id="name-error"
                        className="text-xs text-red-600 flex items-center space-x-1"
                        role="alert"
                        aria-live="polite"
                      >
                        <XCircle className="w-3 h-3" aria-hidden="true" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`text-sm pl-9 w-full px-3 py-2.5 rounded-lg border text-black ${errors.email
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-primary focus:border-primary"
                          } focus:outline-none focus:ring-1 transition-all duration-200`}
                        placeholder="you@example.com"
                        aria-describedby={errors.email ? "email-error" : undefined}
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

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="phone"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`text-sm pl-9 w-full px-3 py-2.5 rounded-lg border text-black ${errors.phone
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-primary focus:border-primary"
                          } focus:outline-none focus:ring-1 transition-all duration-200`}
                        placeholder="+1234567890"
                        aria-describedby={errors.phone ? "phone-error" : undefined}
                        aria-invalid={!!errors.phone}
                      />
                    </div>
                    {errors.phone && (
                      <p
                        id="phone-error"
                        className="text-xs text-red-600 flex items-center space-x-1"
                        role="alert"
                        aria-live="polite"
                      >
                        <XCircle className="w-3 h-3" aria-hidden="true" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="password"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`text-sm pl-9 pr-9 w-full px-3 py-2.5 rounded-lg text-black border ${errors.password
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-primary focus:border-primary"
                          } focus:outline-none focus:ring-1 transition-all duration-200`}
                        placeholder="••••••••"
                        aria-describedby={errors.password ? "password-error" : undefined}
                        aria-invalid={!!errors.password}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-pressed={showPassword}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
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

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`text-sm pl-9 pr-9 w-full px-3 py-2.5 rounded-lg text-black border ${errors.confirmPassword
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-primary focus:border-primary"
                          } focus:outline-none focus:ring-1 transition-all duration-200`}
                        placeholder="••••••••"
                        aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                        aria-invalid={!!errors.confirmPassword}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        aria-pressed={showConfirmPassword}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p
                        id="confirm-password-error"
                        className="text-xs text-red-600 flex items-center space-x-1"
                        role="alert"
                        aria-live="polite"
                      >
                        <XCircle className="w-3 h-3" aria-hidden="true" />
                        <span>{errors.confirmPassword}</span>
                      </p>
                    )}
                  </div>

                  {/* Avatar (optional) */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="avatar"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Profile Picture (optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Camera className="h-4 w-4 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        id="avatar"
                        name="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="text-sm pl-9 w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary focus:outline-none focus:ring-1 transition-all duration-200 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        aria-describedby={errors.avatar ? "avatar-error" : undefined}
                        aria-invalid={!!errors.avatar}
                      />
                    </div>
                    {formData.avatar && (
                      <p className="text-xs text-gray-500 mt-1">
                        Selected: {formData.avatar.name}
                      </p>
                    )}
                    {errors.avatar && (
                      <p
                        id="avatar-error"
                        className="text-xs text-red-600 flex items-center space-x-1"
                        role="alert"
                        aria-live="polite"
                      >
                        <XCircle className="w-3 h-3" aria-hidden="true" />
                        <span>{errors.avatar}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium text-sm py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                    aria-label={isLoading ? "Creating account..." : "Create account"}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" aria-hidden="true" />
                        <span>Create Account</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        className="font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center group"
                        aria-label="Sign in to your account"
                      >
                        <User className="w-3 h-3 mr-1 group-hover:scale-110 transition-transform" />
                        Sign in here
                      </Link>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Access your dashboard and continue learning
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </main>

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

export default RegistrationPage;