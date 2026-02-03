/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { FormData } from '@/src/types/auth';
import { Shield, RotateCw, CheckCircle } from 'lucide-react';

interface OTPVerificationProps {
    formData: FormData;
    updateFormData: (field: string, value: any) => void;
    onVerify: () => Promise<void>;
    onResend: () => Promise<void>;
    onSend: () => Promise<void>;
    onPrev: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
    formData,
    updateFormData,
    onVerify,
    onResend,
    onSend,
    onPrev
}) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (formData.otpSent && !formData.otpVerified) {
            const interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [formData.otpSent]);

    useEffect(() => {
        if (!formData.otpSent) {
            onSend();
        }
    }, []);

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        const otpString = newOtp.join('');
        updateFormData('otp', otpString);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        if (otpString.length === 6) {
            handleVerify();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        await onVerify();
    };

    const handleResendOTP = async () => {
        await onResend();
        setTimer(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                    <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
                <p className="text-gray-600 mt-2">
                    We've sent a 6-digit code to<br />
                    <span className="font-semibold text-gray-900">{formData.email}</span>
                </p>
            </div>

            {formData.otpVerified ? (
                <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Verified!</h3>
                    <p className="text-gray-600">Your email has been successfully verified.</p>
                    <div className="mt-6">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                        <p className="text-gray-500 mt-2">Completing registration...</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700 text-center">
                                Enter the 6-digit code
                            </label>
                            <div className="flex justify-center gap-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => { inputRefs.current[index] = el; }}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-12 text-center text-xl font-semibold rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Didn't receive the code?{' '}
                                {canResend ? (
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        className="text-blue-600 font-medium hover:text-blue-700"
                                    >
                                        Resend Code
                                    </button>
                                ) : (
                                    <span className="text-gray-500">
                                        Resend code in {formatTime(timer)}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6">
                        <button
                            type="button"
                            onClick={onPrev}
                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Back
                        </button>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={!canResend}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <RotateCw className="h-4 w-4" />
                                Resend OTP
                            </button>
                            <button
                                type="button"
                                onClick={handleVerify}
                                disabled={otp.join('').length !== 6}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Verify & Continue
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default OTPVerification;