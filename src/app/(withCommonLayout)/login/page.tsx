/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from 'react';
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    LogIn,
    User,
    ArrowLeft,
    CheckCircle,
    XCircle,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Login = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState('');

    // Validation rules
    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return 'Email is required';
        if (!re.test(email)) return 'Please enter a valid email';
        return '';
    };

    const validatePassword = (password: string) => {
        if (!password) return 'Password is required';
        if (password.length < 6) return 'Password must be at least 6 characters';
        return '';
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');

        // Validate form
        const newErrors: Record<string, string> = {};

        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;

        const passwordError = validatePassword(formData.password);
        if (passwordError) newErrors.password = passwordError;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        // Simulate API call
        setTimeout(() => {
            // Login success
            setSuccessMessage('Successfully logged in! Redirecting...');
            setLoading(false);

            // Reset form
            setFormData({
                email: '',
                password: '',
                rememberMe: false,
            });

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        }, 1500);
    };

    const handleForgotPassword = () => {
        router.push('/forgot-password');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Card Container */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Card Header */}
                    <div className="p-6 sm:p-8 pb-0">
                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
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
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="mx-6 sm:mx-8 mt-6">
                            <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-start space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-green-800">{successMessage}</p>
                            </div>
                        </div>
                    )}

                    {/* Form Content */}
                    <div className="p-6 sm:p-8">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email Field */}
                            <div className="space-y-1.5">
                                <label htmlFor="email" className="block text-xs font-medium text-gray-700">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`text-sm pl-9 w-full px-3 py-2.5 rounded-lg border ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'} focus:outline-none focus:ring-1 transition-all duration-200`}
                                        placeholder="you@example.com"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-xs text-red-600 flex items-center space-x-1">
                                        <XCircle className="w-3 h-3" />
                                        <span>{errors.email}</span>
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-xs font-medium text-gray-700">
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
                                        <Lock className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`text-sm pl-9 pr-9 w-full px-3 py-2.5 rounded-lg border ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'} focus:outline-none focus:ring-1 transition-all duration-200`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-red-600 flex items-center space-x-1">
                                        <XCircle className="w-3 h-3" />
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
                                <label htmlFor="rememberMe" className="ml-2 text-xs text-gray-700">
                                    Remember me for 30 days
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium text-sm py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-4 h-4" />
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
                                    Don't have an account?{' '}
                                    <Link
                                        href="/signup"
                                        className="font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center group"
                                    >
                                        <User className="w-3 h-3 mr-1 group-hover:scale-110 transition-transform" />
                                        Create an account
                                    </Link>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Get started with our platform in just a few clicks
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="mt-6 text-center">
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-gray-500">
                        <Link href="/privacy" className="hover:text-gray-700 transition-colors">
                            Privacy Policy
                        </Link>
                        <span className="text-gray-300">•</span>
                        <Link href="/terms" className="hover:text-gray-700 transition-colors">
                            Terms of Service
                        </Link>
                        <span className="text-gray-300">•</span>
                        <Link href="/help" className="hover:text-gray-700 transition-colors">
                            Help Center
                        </Link>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                        © {new Date().getFullYear()} Your Company. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;