/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, UserPlus, Loader2, ArrowLeft, Phone, Camera, User } from "lucide-react";
import toast from "react-hot-toast";
import { useSignupUserMutation } from "@/src/redux/features/user/userApi";
import { useLoginUserMutation } from "@/src/redux/features/auth/authApi";

const imageHostingKey = process.env.NEXT_PUBLIC_IMAGE_HOSTING_KEY;
const imageHostingApi = imageHostingKey
  ? `https://api.imgbb.com/1/upload?key=${imageHostingKey}`
  : null;

const RegistrationPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerUser] = useSignupUserMutation();
  const [loginUser] = useLoginUserMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    avatar: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, avatar: file }));
  };

  const uploadImageToImgBB = async (file: File): Promise<string | null> => {
    if (!imageHostingApi) return null;

    const body = new FormData();
    body.append("image", file);

    const response = await fetch(imageHostingApi, {
      method: "POST",
      body,
    });

    const data = await response.json();
    return data?.success ? data?.data?.url : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 2) newErrors.name = "Name is required (min 2 chars)";
    if (!validateEmail(formData.email)) newErrors.email = "Valid email is required";
    if (!formData.phone || formData.phone.length < 6) newErrors.phone = "Valid phone number is required";
    if (!formData.password || formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Object.values(newErrors).forEach((msg) => toast.error(msg));
      setIsLoading(false);
      return;
    }

    try {
      let avatarUrl: string | null = null;

      if (formData.avatar) {
        const toastId = toast.loading("Uploading profile image...");
        avatarUrl = await uploadImageToImgBB(formData.avatar);
        toast.dismiss(toastId);
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        avatar: avatarUrl ?? undefined,
      };

      const signupRes = await registerUser(payload).unwrap();

      if (!signupRes?.success) {
        throw new Error(signupRes?.message || "Registration failed");
      }

      await loginUser({ email: formData.email, password: formData.password }).unwrap();

      toast.success("Account created successfully");
      router.push("/");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 via-white to-primary/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Link href="/" className="inline-flex items-center text-xs font-medium text-gray-600 hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Back to home
        </Link>

        <main className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h1>
          <p className="text-sm text-gray-600 mb-6">Start your secure shopping journey.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                <input name="name" value={formData.name} onChange={handleInputChange} className="w-full pl-9 px-3 py-2.5 rounded-lg border border-gray-300 text-black" />
              </div>
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full pl-9 px-3 py-2.5 rounded-lg border border-gray-300 text-black" />
              </div>
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
              <div className="relative">
                <Phone className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full pl-9 px-3 py-2.5 rounded-lg border border-gray-300 text-black" />
              </div>
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-9 pr-9 px-3 py-2.5 rounded-lg border border-gray-300 text-black"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3">
                  {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-9 pr-9 px-3 py-2.5 rounded-lg border border-gray-300 text-black"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3">
                  {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Profile Picture (optional)</label>
              <div className="relative">
                <Camera className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="w-full pl-9 px-3 py-2.5 rounded-lg border border-gray-300 text-black"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white font-medium text-sm py-2.5 px-4 rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Creating account..." : "Create Account"}
              {!isLoading && <UserPlus className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-600">
            Already have an account? {" "}
            <Link href="/login" className="text-primary font-medium hover:text-primary/80">
              Sign in
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RegistrationPage;

