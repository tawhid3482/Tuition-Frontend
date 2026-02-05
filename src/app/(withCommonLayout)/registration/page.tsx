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
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useLoginUserMutation,
} from "@/src/redux/features/auth/authApi";
import { useSignupUserMutation } from "@/src/redux/features/user/userApi";

const RegistrationPage = () => {
  const router = useRouter();

  // Redux mutations
  const [createUsers] = useSignupUserMutation();
  const [sendOtp] = useSendOtpMutation();
  const [verifyOtp] = useVerifyOtpMutation();
  const [resendOtp] = useResendOtpMutation();
  const [loginUser] = useLoginUserMutation();

  // State
  const [role, setRole] = useState<"STUDENT" | "TUTOR">("TUTOR");
  const [step, setStep] = useState<"form" | "otp">("form");
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSentTime, setOtpSentTime] = useState<number | null>(null);
  const [canResendOtp, setCanResendOtp] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    acceptTerms: false,
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

  const validateGender = (gender: string) => {
    if (!gender) return "Gender is required";
    return "";
  };

  // Input handler
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle role selection
  const handleRoleSelect = (selectedRole: "STUDENT" | "TUTOR") => {
    setRole(selectedRole);
    if (errors.role) {
      setErrors((prev) => ({ ...prev, role: "" }));
    }
  };

  // Submit (Send OTP) - FIXED
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

    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword,
    );
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    const genderError = validateGender(formData.gender);
    if (genderError) newErrors.gender = genderError;

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms & conditions";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Object.values(newErrors).forEach((error) => {
        toast.error(error);
      });
      setIsLoading(false);
      return;
    }

    const loadingToast = toast.loading("Sending OTP to your email...");

    try {
      // Call send OTP API
      const result = await sendOtp({ email: formData.email }).unwrap();

      toast.dismiss(loadingToast);

      if (result?.success) {
        setStep("otp");
        setOtpSentTime(Date.now());
        setCanResendOtp(false);

        // Enable resend OTP button after 30 seconds
        setTimeout(() => {
          setCanResendOtp(true);
        }, 30000);

        toast.success(
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>OTP sent successfully! Check your email.</span>
          </div>,
          {
            duration: 4000,
            position: "top-right",
          },
        );
      }
    } catch (err: any) {
      toast.dismiss(loadingToast);

      let errorMessage = "Failed to send OTP. Please try again.";

      // Handle different error types
      if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.data?.error) {
        errorMessage = err.data.error;
      } else if (err?.status === 400) {
        errorMessage = "Invalid email address or email already exists";
      } else if (err?.status === 429) {
        errorMessage = "Too many attempts. Please try again after 1 minute.";
      } else if (err?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (!navigator.onLine) {
        errorMessage = "No internet connection. Please check your network.";
      }

      toast.error(
        <div className="flex items-center space-x-2">
          <XCircle className="w-4 h-4 text-red-500" />
          <span>{errorMessage}</span>
        </div>,
        {
          duration: 5000,
          position: "top-right",
        },
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP & Create User - FIXED
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    setIsLoading(true);
    setErrors({});

    const loadingToast = toast.loading("Verifying OTP and creating account...");

    try {
      // Step 1: Verify OTP
      const verifyResult = await verifyOtp({
        email: formData.email,
        otp: otp.trim(),
      }).unwrap();

      if (!verifyResult?.success) {
        throw new Error("OTP verification failed");
      }

      // Step 2: Create user account
      const createResult = await createUsers({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        role,
      }).unwrap();

      if (!createResult?.success) {
        throw new Error("Account creation failed");
      }

      toast.dismiss(loadingToast);

      toast.success(
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Account created successfully! Redirecting to login...</span>
        </div>,
        {
          duration: 3000,
          position: "top-right",
        },
      );

      await loginUser({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err: any) {
      toast.dismiss(loadingToast);

      let errorMessage = "Failed to verify OTP. Please try again.";

      // Handle different error types
      if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.data?.error) {
        errorMessage = err.data.error;
      } else if (err?.status === 400) {
        if (err?.data?.includes?.("expired")) {
          errorMessage = "OTP has expired. Please request a new one.";
        } else if (err?.data?.includes?.("invalid")) {
          errorMessage = "Invalid OTP. Please check and try again.";
        } else {
          errorMessage = "Invalid OTP or request data.";
        }
      } else if (err?.status === 401) {
        errorMessage = "OTP verification failed. Please try again.";
      } else if (err?.status === 409) {
        errorMessage = "User already exists with this email.";
      } else if (err?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err?.message?.includes?.("network")) {
        errorMessage = "Network error. Please check your connection.";
      }

      toast.error(
        <div className="flex items-center space-x-2">
          <XCircle className="w-4 h-4 text-red-500" />
          <span>{errorMessage}</span>
        </div>,
        {
          duration: 5000,
          position: "top-right",
        },
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP - FIXED
  const handleResendOtp = async () => {
    if (!canResendOtp) {
      toast.error("Please wait 30 seconds before resending OTP");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Resending OTP...");

    try {
      const result = await resendOtp({ email: formData.email }).unwrap();

      toast.dismiss(loadingToast);

      if (result?.success) {
        setOtpSentTime(Date.now());
        setCanResendOtp(false);

        // Enable resend OTP button after 30 seconds
        setTimeout(() => {
          setCanResendOtp(true);
        }, 30000);

        toast.success(
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>OTP resent successfully! Check your email.</span>
          </div>,
          {
            duration: 4000,
            position: "top-right",
          },
        );
      }
    } catch (err: any) {
      toast.dismiss(loadingToast);

      let errorMessage = "Failed to resend OTP. Please try again.";

      if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.status === 429) {
        errorMessage = "Too many resend attempts. Please try again later.";
      } else if (err?.status === 400) {
        errorMessage = "Unable to resend OTP. Please try again.";
      }

      toast.error(
        <div className="flex items-center space-x-2">
          <XCircle className="w-4 h-4 text-red-500" />
          <span>{errorMessage}</span>
        </div>,
        {
          duration: 4000,
          position: "top-right",
        },
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate remaining time for OTP resend
  const getRemainingTime = () => {
    if (!otpSentTime || canResendOtp) return null;

    const elapsed = Date.now() - otpSentTime;
    const remaining = Math.max(0, 30000 - elapsed);
    return Math.ceil(remaining / 1000);
  };

  const remainingSeconds = getRemainingTime();

  return (
    <>
      {/* SEO Head Section */}
      <Head>
        <title>Create Account | Sign Up</title>
        <meta
          name="description"
          content="Create a new account to join our platform. Choose between Tutor and Student roles to get started."
        />
        <meta
          name="keywords"
          content="sign up, register, create account, tutor, student, join"
        />
        <meta name="author" content="Your Company" />
        <meta property="og:title" content="Create Account" />
        <meta
          property="og:description"
          content="Join our platform and start your journey as a Tutor or Student"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/registration" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Create Account" />
        <meta
          name="twitter:description"
          content="Join our platform and start your journey as a Tutor or Student"
        />
        <link rel="canonical" href="https://yourdomain.com/registration" />
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
            <span itemProp="name">Registration</span>
            <meta itemProp="position" content="2" />
          </li>
        </ol>
      </nav>

      <div className="min-h-screen bg-linear-to-br from-primary/5 via-white to-primary/10 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center text-xs font-medium text-gray-600 hover:text-primary mb-6 transition-colors"
            aria-label="Go back to home page"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-2" />
            Back to home
          </Link>

          {/* Card Container */}
          <main role="main" aria-label="Registration form">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Card Header */}
              <header className="p-6 sm:p-8 pb-0">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="relative w-12 h-12 rounded-xl bg-linear-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                      <UserPlus className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Create Account
                  </h1>
                  <p className="text-sm text-gray-600">
                    {step === "form"
                      ? "Join our platform and start your journey"
                      : "Verify your email address"}
                  </p>
                </div>
              </header>

              {/* Form Content */}
              <section
                aria-labelledby="registration-form-title"
                className="p-6 sm:p-8"
              >
                <h2 id="registration-form-title" className="sr-only">
                  Registration Form
                </h2>

                {step === "form" ? (
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    aria-label="Registration form"
                  >
                    {/* Role Selection */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-700">
                        I want to join as
                      </label>
                      <div className="flex gap-3">
                        {["TUTOR", "STUDENT"].map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() =>
                              handleRoleSelect(r as "STUDENT" | "TUTOR")
                            }
                            className={`w-full py-2.5 text-sm font-medium rounded-lg border transition-all duration-200 ${
                              role === r
                                ? "bg-primary text-white border-primary shadow-sm"
                                : "bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary"
                            }`}
                            aria-pressed={role === r}
                          >
                            {r === "TUTOR" ? "Tutor" : "Student"}
                          </button>
                        ))}
                      </div>
                      {errors.role && (
                        <p
                          className="text-xs text-red-600 flex items-center space-x-1"
                          role="alert"
                          aria-live="polite"
                        >
                          <XCircle className="w-3 h-3" aria-hidden="true" />
                          <span>{errors.role}</span>
                        </p>
                      )}
                    </div>

                    {/* Name Field */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="name"
                        className="block text-xs font-medium text-gray-700"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User
                            className="h-4 w-4 text-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`text-sm pl-9 w-full px-3 py-2.5 rounded-lg border ${
                            errors.name
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-primary focus:border-primary"
                          } focus:outline-none focus:ring-1 transition-all duration-200`}
                          placeholder="John Doe"
                          aria-describedby={
                            errors.name ? "name-error" : undefined
                          }
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
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`text-sm pl-9 w-full px-3 py-2.5 rounded-lg border ${
                            errors.email
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-primary focus:border-primary"
                          } focus:outline-none focus:ring-1 transition-all duration-200`}
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

                    {/* Gender Field */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="gender"
                        className="block text-xs font-medium text-gray-700"
                      >
                        Gender
                      </label>
                      <div className="relative">
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className={`text-sm w-full px-3 py-2.5 rounded-lg border ${
                            errors.gender
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-primary focus:border-primary"
                          } focus:outline-none focus:ring-1 transition-all duration-200 appearance-none`}
                          aria-describedby={
                            errors.gender ? "gender-error" : undefined
                          }
                          aria-invalid={!!errors.gender}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg
                            className="h-4 w-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                      {errors.gender && (
                        <p
                          id="gender-error"
                          className="text-xs text-red-600 flex items-center space-x-1"
                          role="alert"
                          aria-live="polite"
                        >
                          <XCircle className="w-3 h-3" aria-hidden="true" />
                          <span>{errors.gender}</span>
                        </p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="password"
                        className="block text-xs font-medium text-gray-700"
                      >
                        Password
                      </label>
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
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`text-sm pl-9 pr-9 w-full px-3 py-2.5 rounded-lg border ${
                            errors.password
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-primary focus:border-primary"
                          } focus:outline-none focus:ring-1 transition-all duration-200`}
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

                    {/* Confirm Password Field */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="confirmPassword"
                        className="block text-xs font-medium text-gray-700"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock
                            className="h-4 w-4 text-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`text-sm pl-9 pr-9 w-full px-3 py-2.5 rounded-lg border ${
                            errors.confirmPassword
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-primary focus:border-primary"
                          } focus:outline-none focus:ring-1 transition-all duration-200`}
                          placeholder="••••••••"
                          aria-describedby={
                            errors.confirmPassword
                              ? "confirm-password-error"
                              : undefined
                          }
                          aria-invalid={!!errors.confirmPassword}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          aria-label={
                            showConfirmPassword
                              ? "Hide confirm password"
                              : "Show confirm password"
                          }
                          aria-pressed={showConfirmPassword}
                        >
                          {showConfirmPassword ? (
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

                    {/* Terms & Conditions */}
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="acceptTerms"
                          name="acceptTerms"
                          type="checkbox"
                          checked={formData.acceptTerms}
                          onChange={handleInputChange}
                          className="h-3.5 w-3.5 text-primary focus:ring-primary border-gray-300 rounded"
                          aria-describedby={
                            errors.acceptTerms ? "terms-error" : undefined
                          }
                          aria-invalid={!!errors.acceptTerms}
                        />
                      </div>
                      <div className="ml-2">
                        <label
                          htmlFor="acceptTerms"
                          className="text-xs text-gray-700"
                        >
                          I agree to the{" "}
                          <Link
                            href="/terms"
                            className="font-medium text-primary hover:text-primary/80"
                            target="_blank"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            href="/privacy"
                            className="font-medium text-primary hover:text-primary/80"
                            target="_blank"
                          >
                            Privacy Policy
                          </Link>
                        </label>
                        {errors.acceptTerms && (
                          <p
                            id="terms-error"
                            className="text-xs text-red-600 flex items-center space-x-1 mt-1"
                            role="alert"
                            aria-live="polite"
                          >
                            <XCircle className="w-3 h-3" aria-hidden="true" />
                            <span>{errors.acceptTerms}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium text-sm py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                      aria-label={
                        isLoading ? "Creating account..." : "Create account"
                      }
                    >
                      {isLoading ? (
                        <>
                          <Loader2
                            className="w-4 h-4 animate-spin"
                            aria-hidden="true"
                          />
                          <span>Sending OTP...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" aria-hidden="true" />
                          <span>Send OTP</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* OTP Verification Form */
                  <form
                    onSubmit={handleVerifyOtp}
                    className="space-y-4"
                    aria-label="OTP verification form"
                  >
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-gray-700">
                        OTP Verification
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <ShieldCheck
                            className="h-4 w-4 text-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) =>
                            setOtp(
                              e.target.value.replace(/\D/g, "").slice(0, 6),
                            )
                          }
                          maxLength={6}
                          className="text-sm pl-9 w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary focus:outline-none focus:ring-1 transition-all duration-200 text-center tracking-widest"
                          placeholder="123456"
                          aria-label="Enter OTP code"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          autoComplete="one-time-code"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Enter the 6-digit code sent to{" "}
                        <span className="font-medium">{formData.email}</span>
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={isLoading || otp.length !== 6}
                        className="flex-1 bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium text-sm py-2.5 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader2
                              className="w-4 h-4 animate-spin"
                              aria-hidden="true"
                            />
                            <span>Verifying...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle
                              className="w-4 h-4"
                              aria-hidden="true"
                            />
                            <span>Verify OTP</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isLoading || !canResendOtp}
                        className="flex-1 border border-gray-300 hover:border-primary text-gray-700 hover:text-primary font-medium text-sm py-2.5 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed relative"
                      >
                        {remainingSeconds ? (
                          <span>Resend ({remainingSeconds}s)</span>
                        ) : (
                          "Resend OTP"
                        )}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep("form")}
                      className="text-xs text-gray-600 hover:text-primary flex items-center justify-center space-x-1"
                      aria-label="Go back to registration form"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Back to registration</span>
                    </button>
                  </form>
                )}

                {/* Divider */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                  </div>
                </div>

                {/* Login Navigation */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        className="font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center group"
                        aria-label="Sign in to your account"
                      >
                        <User
                          className="w-3 h-3 mr-1 group-hover:scale-110 transition-transform"
                          aria-hidden="true"
                        />
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

export default RegistrationPage;
