/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from 'react';
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    UserPlus,
    ArrowLeft,
    CheckCircle,
    XCircle,
    Loader2,
    Check,
    LogIn
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Register = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState('');

    // Validation rules
    const validateName = (name: string) => {
        if (!name) return 'This field is required';
        if (name.length < 2) return 'Must be at least 2 characters';
        return '';
    };

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return 'Email is required';
        if (!re.test(email)) return 'Please enter a valid email';
        return '';
    };

    const validatePassword = (password: string) => {
        if (!password) return 'Password is required';
        if (password.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])/.test(password)) return 'Must contain lowercase letter';
        if (!/(?=.*[A-Z])/.test(password)) return 'Must contain uppercase letter';
        if (!/(?=.*\d)/.test(password)) return 'Must contain number';
        if (!/(?=.*[@$!%*?&])/.test(password)) return 'Must contain special character';
        return '';
    };

    const validateConfirmPassword = (password: string, confirmPassword: string) => {
        if (!confirmPassword) return 'Please confirm your password';
        if (password !== confirmPassword) return 'Passwords do not match';
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

    // Password strength indicator
    const getPasswordStrength = (password: string) => {
        if (!password) return { score: 0, color: 'bg-gray-200' };

        let score = 0;
        const requirements = [
            password.length >= 8,
            /[a-z]/.test(password),
            /[A-Z]/.test(password),
            /\d/.test(password),
            /[@$!%*?&]/.test(password)
        ];

        score = requirements.filter(Boolean).length;

        const strength = [
            { color: 'bg-red-500', width: '20%' },
            { color: 'bg-orange-500', width: '40%' },
            { color: 'bg-yellow-500', width: '60%' },
            { color: 'bg-blue-500', width: '80%' },
            { color: 'bg-green-500', width: '100%' }
        ];

        return strength[Math.min(score, strength.length - 1)];
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');

        // Validate form
        const newErrors: Record<string, string> = {};

        const firstNameError = validateName(formData.firstName);
        if (firstNameError) newErrors.firstName = firstNameError;

        const lastNameError = validateName(formData.lastName);
        if (lastNameError) newErrors.lastName = lastNameError;

        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;

        const passwordError = validatePassword(formData.password);
        if (passwordError) newErrors.password = passwordError;

        const confirmError = validateConfirmPassword(formData.password, formData.confirmPassword);
        if (confirmError) newErrors.confirmPassword = confirmError;

        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'You must accept the terms and conditions';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        // Simulate API call
        setTimeout(() => {
            setSuccessMessage('Account created successfully! Redirecting to login...');
            setLoading(false);

            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                acceptTerms: false,
            });

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        }, 1500);
    };

    const passwordStrength = getPasswordStrength(formData.password);

    // Password requirements checklist
    const passwordRequirements = [
        { label: 'At least 8 characters', met: formData.password.length >= 8 },
        { label: 'Contains lowercase letter', met: /[a-z]/.test(formData.password) },
        { label: 'Contains uppercase letter', met: /[A-Z]/.test(formData.password) },
        { label: 'Contains number', met: /\d/.test(formData.password) },
        { label: 'Contains special character', met: /[@$!%*?&]/.test(formData.password) },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Back to Home */}
                <div className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-gray-600 hover:text-primary transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to home
                    </Link>
                </div>

                {/* Card Container */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Card Header */}
                    <div className="p-6 sm:p-8 pb-0">
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
                                Sign up to get started with our platform
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
                            {/* Name Fields */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label htmlFor="firstName" className="block text-xs font-medium text-gray-700">
                                        First Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            autoComplete="given-name"
                                            required
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className={`text-sm pl-9 w-full px-3 py-2.5 rounded-lg border ${errors.firstName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'} focus:outline-none focus:ring-1 transition-all duration-200`}
                                            placeholder="John"
                                        />
                                    </div>
                                    {errors.firstName && (
                                        <p className="text-xs text-red-600 flex items-center space-x-1">
                                            <XCircle className="w-3 h-3" />
                                            <span>{errors.firstName}</span>
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="lastName" className="block text-xs font-medium text-gray-700">
                                        Last Name
                                    </label>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        autoComplete="family-name"
                                        required
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className={`text-sm w-full px-3 py-2.5 rounded-lg border ${errors.lastName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'} focus:outline-none focus:ring-1 transition-all duration-200`}
                                        placeholder="Doe"
                                    />
                                    {errors.lastName && (
                                        <p className="text-xs text-red-600 flex items-center space-x-1">
                                            <XCircle className="w-3 h-3" />
                                            <span>{errors.lastName}</span>
                                        </p>
                                    )}
                                </div>
                            </div>

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
                                <label htmlFor="password" className="block text-xs font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
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

                                {/* Password Strength Indicator */}
                                {formData.password && (
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-600">Password strength:</span>
                                            <span className={`text-xs font-medium ${passwordStrength.color.replace('bg-', 'text-')}`}>
                                                {passwordStrength.width === '100%' ? 'Strong' :
                                                    passwordStrength.width === '80%' ? 'Good' :
                                                        passwordStrength.width === '60%' ? 'Fair' :
                                                            passwordStrength.width === '40%' ? 'Weak' : 'Very Weak'}
                                            </span>
                                        </div>
                                        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                                style={{ width: passwordStrength.width }}
                                            />
                                        </div>

                                        {/* Password Requirements */}
                                        <div className="space-y-1 pt-1">
                                            {passwordRequirements.map((req, index) => (
                                                <div key={index} className="flex items-center">
                                                    <div className={`w-3 h-3 rounded-full mr-2 flex items-center justify-center ${req.met ? 'bg-green-500' : 'bg-gray-300'}`}>
                                                        {req.met && <Check className="w-2 h-2 text-white" />}
                                                    </div>
                                                    <span className={`text-xs ${req.met ? 'text-green-600' : 'text-gray-500'}`}>
                                                        {req.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {errors.password && (
                                    <p className="text-xs text-red-600 flex items-center space-x-1">
                                        <XCircle className="w-3 h-3" />
                                        <span>{errors.password}</span>
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1.5">
                                <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`text-sm pl-9 pr-9 w-full px-3 py-2.5 rounded-lg border ${errors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'} focus:outline-none focus:ring-1 transition-all duration-200`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-xs text-red-600 flex items-center space-x-1">
                                        <XCircle className="w-3 h-3" />
                                        <span>{errors.confirmPassword}</span>
                                    </p>
                                )}
                            </div>

                            {/* Terms and Conditions */}
                            <div className="space-y-1.5">
                                <div className="flex items-start">
                                    <input
                                        id="acceptTerms"
                                        name="acceptTerms"
                                        type="checkbox"
                                        checked={formData.acceptTerms}
                                        onChange={handleInputChange}
                                        className="h-3.5 w-3.5 text-primary focus:ring-primary border-gray-300 rounded mt-0.5"
                                    />
                                    <label htmlFor="acceptTerms" className="ml-2 text-xs text-gray-700">
                                        I agree to the{' '}
                                        <Link href="/terms" className="text-primary hover:text-primary/80 font-medium">
                                            Terms of Service
                                        </Link>{' '}
                                        and{' '}
                                        <Link href="/privacy" className="text-primary hover:text-primary/80 font-medium">
                                            Privacy Policy
                                        </Link>
                                    </label>
                                </div>
                                {errors.acceptTerms && (
                                    <p className="text-xs text-red-600 flex items-center space-x-1">
                                        <XCircle className="w-3 h-3" />
                                        <span>{errors.acceptTerms}</span>
                                    </p>
                                )}
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
                                        <span>Creating account...</span>
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4" />
                                        <span>Create Account</span>
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
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                                </div>
                            </div>

                            {/* Social Signup Buttons */}
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    disabled={loading}
                                    className="w-full inline-flex justify-center items-center py-2 px-3 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                        <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    Facebook
                                </button>
                                <button
                                    type="button"
                                    disabled={loading}
                                    className="w-full inline-flex justify-center items-center py-2 px-3 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                        <path fill="#000000" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                    GitHub
                                </button>
                            </div>
                        </div>

                        {/* Login Navigation */}
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <div className="text-center">
                                <p className="text-xs text-gray-600">
                                    Already have an account?{' '}
                                    <Link
                                        href="/login"
                                        className="font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center group"
                                    >
                                        <LogIn className="w-3 h-3 mr-1 group-hover:scale-110 transition-transform" />
                                        Sign in here
                                    </Link>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Welcome back to our platform
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features/Benefits */}
                <div className="mt-6 grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100">
                        <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-1">
                            <Check className="w-3 h-3 text-primary" />
                        </div>
                        <p className="text-xs font-medium text-gray-700">No credit card</p>
                    </div>
                    <div className="p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100">
                        <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-1">
                            <Check className="w-3 h-3 text-primary" />
                        </div>
                        <p className="text-xs font-medium text-gray-700">Free trial</p>
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

export default Register;