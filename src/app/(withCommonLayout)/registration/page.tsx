/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  UserPlus,
  ArrowLeft,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  useLoginUserMutation,
  useResendOtpMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/src/redux/features/auth/authApi";
import { useSignupUserMutation } from "@/src/redux/features/user/userApi";

const RegistrationPage = () => {
  const router = useRouter();

  // Redux mutations
  const [createUsers] = useSignupUserMutation();
  const [loginUser] = useLoginUserMutation();
  const [sendOtp] = useSendOtpMutation();
  const [verifyOtp] = useVerifyOtpMutation();
  const [resendOtp] = useResendOtpMutation();

  // ---------------- State ----------------
  const [role, setRole] = useState<"STUDENT" | "TUTOR">("TUTOR"); // ✅ default tutor
  const [step, setStep] = useState<"form" | "otp">("form");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    acceptTerms: false,
  });

  // ---------------- Input handler ----------------
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

  // ---------------- Validation ----------------
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!role) newErrors.role = "Please select a role";
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.acceptTerms)
      newErrors.acceptTerms = "You must accept terms & conditions";

    return newErrors;
  };

  // ---------------- Submit (Send OTP) ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMessage("");

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setLoading(false);
      return;
    }

    try {
      await sendOtp({ email: formData.email }).unwrap();
      setStep("otp");
      setSuccessMessage("OTP sent to your email");
    } catch (err: any) {
      setErrors({ email: err?.data?.message || "Failed to send OTP" });
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Verify OTP & Create User ----------------
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      setErrors({ otp: "OTP is required" });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await verifyOtp({ email: formData.email, otp }).unwrap();

      await createUsers({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        role,
      }).unwrap();

      await loginUser({
        email: formData.email,
        password: formData.password,
      });

      setSuccessMessage("Account created successfully 🎉");
      router.push("/");
    } catch (err: any) {
      setErrors({ otp: err?.data?.message || "Invalid OTP" });
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Resend OTP ----------------
  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await resendOtp({ email: formData.email }).unwrap();
      setSuccessMessage("OTP resent successfully");
    } catch (err: any) {
      setErrors({ otp: err?.data?.message || "Failed to resend OTP" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 via-white to-primary/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <UserPlus className="text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-sm text-gray-600">
              {step === "form" ? "Sign up to get started" : "Verify OTP"}
            </p>
          </div>

          {successMessage && (
            <div className="mx-6 mb-4 bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-700 flex gap-2">
              <CheckCircle className="w-4 h-4" />
              {successMessage}
            </div>
          )}

          <div className="p-6">
            {step === "form" && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Role */}
                <div className="flex gap-3">
                  {["TUTOR", "STUDENT"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r as any)}
                      className={`w-full py-2 rounded-lg border ${
                        role === r ? "bg-primary text-white" : "border-gray-300"
                      }`}
                    >
                      {r === "TUTOR" ? "TUTOR" : "STUDENT"}
                    </button>
                  ))}
                </div>

                <input
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input"
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input"
                />

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>

                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>

                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                  />
                  I agree to Terms & Privacy
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-2 rounded-lg"
                >
                  {loading ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : (
                    "Continue"
                  )}
                </button>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <input
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="input"
                />

                <button className="w-full bg-primary text-white py-2 rounded-lg">
                  {loading ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : (
                    "Verify OTP"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="w-full border border-primary text-primary py-2 rounded-lg"
                >
                  Resend OTP
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
