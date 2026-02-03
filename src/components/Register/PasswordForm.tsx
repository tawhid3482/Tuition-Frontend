/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { FormData, UserRole } from '@/src/types/auth';
import { Eye, EyeOff, Lock, Check, X } from 'lucide-react';

interface PasswordFormProps {
    formData: FormData;
    updateFormData: (field: string, value: any) => void;
    onNext: () => void;
    onPrev: () => void;
    userRole: UserRole;
}

const PasswordForm: React.FC<PasswordFormProps> = ({
    formData,
    updateFormData,
    onNext,
    onPrev,
    userRole
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const passwordRequirements = [
        { label: 'At least 8 characters', regex: /.{8,}/ },
        { label: 'Contains uppercase letter', regex: /[A-Z]/ },
        { label: 'Contains lowercase letter', regex: /[a-z]/ },
        { label: 'Contains number', regex: /\d/ },
        { label: 'Contains special character', regex: /[@$!%*?&]/ }
    ];

    const getPasswordStrength = (password: string) => {
        if (!password) return 0;
        return passwordRequirements.filter(req => req.regex.test(password)).length;
    };

    const strength = getPasswordStrength(formData.password);
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        
        if (strength < 3) {
            alert("Please use a stronger password!");
            return;
        }
        
        onNext();
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Create Password</h2>
            <p className="text-gray-600">Create a secure password for your account</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Password *
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={formData.password}
                                onChange={(e) => updateFormData('password', e.target.value)}
                                className="pl-10 pr-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Password Strength Indicator */}
                    {formData.password && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Password Strength:</span>
                                <span className={`font-medium ${
                                    strength >= 4 ? 'text-green-600' :
                                    strength >= 3 ? 'text-blue-600' :
                                    strength >= 2 ? 'text-yellow-600' :
                                    strength >= 1 ? 'text-orange-600' : 'text-red-600'
                                }`}>
                                    {strengthLabels[strength - 1] || 'Very Weak'}
                                </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${strengthColors[strength - 1] || 'bg-red-500'} transition-all duration-300`}
                                    style={{ width: `${(strength / 5) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Password Requirements */}
                    <div className="space-y-2 pt-2">
                        <p className="text-sm font-medium text-gray-700">Password must contain:</p>
                        <div className="space-y-1">
                            {passwordRequirements.map((req, index) => {
                                const met = req.regex.test(formData.password);
                                return (
                                    <div key={index} className="flex items-center gap-2">
                                        {met ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <X className="h-4 w-4 text-gray-400" />
                                        )}
                                        <span className={`text-sm ${met ? 'text-green-600' : 'text-gray-500'}`}>
                                            {req.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Confirm Password *
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                value={formData.confirmPassword}
                                onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                                className="pl-10 pr-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Confirm your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between pt-6">
                    <button
                        type="button"
                        onClick={onPrev}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        disabled={!formData.password || !formData.confirmPassword || formData.password !== formData.confirmPassword || strength < 3}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {userRole === UserRole.TUTOR ? 'Continue to Verification' : 'Send OTP'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PasswordForm;