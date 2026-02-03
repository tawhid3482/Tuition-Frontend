/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useSignupUserMutation, useSendOtpMutation, useVerifyOtpMutation, useResendOtpMutation } from '@/src/redux/features/auth/authApi';
import { useGetAllDistrictQuery } from '@/src/redux/features/district/districtApi';
import Head from 'next/head';
import { Toaster, toast } from 'react-hot-toast';
import { UserRole } from '@/src/types/auth';
import RoleSelection from '@/src/components/Register/RoleSelection';
import PersonalInfoForm from '@/src/components/Register/PersonalInfoForm';
import LocationSelection from '@/src/components/Register/LocationSelection';
import TutorSubjectsForm from '@/src/components/Register/TutorSubjectsForm';
import PasswordForm from '@/src/components/Register/PasswordForm';
import OTPVerification from '@/src/components/Register/OTPVerification';
import SuccessMessage from '@/src/components/Register/SuccessMessage';

type RegistrationStep = 'role' | 'personal' | 'location' | 'subjects' | 'password' | 'otp' | 'success';

const RegistrationPage = () => {
    // API Hooks
    const { data: DistrictData } = useGetAllDistrictQuery(undefined);
    const [createUsers] = useSignupUserMutation();
    const [sendOtp] = useSendOtpMutation();
    const [verifyOtp] = useVerifyOtpMutation();
    const [resendOtp] = useResendOtpMutation();

    // State Management
    const [currentStep, setCurrentStep] = useState<RegistrationStep>('role');
    const [userRole, setUserRole] = useState<UserRole>(UserRole.STUDENT);
    const [formData, setFormData] = useState({
        // Common Fields
        name: '',
        email: '',
        phone: '',
        gender: '',
        password: '',
        confirmPassword: '',
        role: UserRole.STUDENT,
        
        // Tutor Specific Fields
        district: '',
        thana: '',
        areas: [] as string[],
        subjects: [] as string[],
        medium: [] as string[],
        
        // OTP Verification
        otp: '',
        otpSent: false,
        otpVerified: false,
    });

    // Steps Configuration
    const steps = {
        student: ['role', 'personal', 'password', 'otp', 'success'],
        tutor: ['role', 'personal', 'location', 'subjects', 'password', 'otp', 'success']
    };

    const currentSteps = userRole === UserRole.STUDENT ? steps.student : steps.tutor;
    const currentStepIndex = currentSteps.indexOf(currentStep);

    // Handlers
    const handleRoleSelect = (role: UserRole) => {
        setUserRole(role);
        setFormData(prev => ({ ...prev, role }));
        setCurrentStep('personal');
    };

    const handleNextStep = () => {
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < currentSteps.length) {
            setCurrentStep(currentSteps[nextIndex] as RegistrationStep);
        }
    };

    const handlePrevStep = () => {
        const prevIndex = currentStepIndex - 1;
        if (prevIndex >= 0) {
            setCurrentStep(currentSteps[prevIndex] as RegistrationStep);
        }
    };

    const updateFormData = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSendOTP = async () => {
        try {
            const response = await sendOtp({ email: formData.email }).unwrap();
            if (response.success) {
                toast.success('OTP sent to your email!');
                updateFormData('otpSent', true);
            }
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to send OTP');
        }
    };

    const handleVerifyOTP = async () => {
        try {
            const response = await verifyOtp({
                email: formData.email,
                otp: formData.otp
            }).unwrap();

            if (response.success) {
                toast.success('OTP verified successfully!');
                updateFormData('otpVerified', true);
                await handleRegistration();
            }
        } catch (error: any) {
            toast.error(error?.data?.message || 'Invalid OTP');
        }
    };

    const handleResendOTP = async () => {
        try {
            const response = await resendOtp({ email: formData.email }).unwrap();
            if (response.success) {
                toast.success('New OTP sent to your email!');
            }
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to resend OTP');
        }
    };

    const handleRegistration = async () => {
        try {
            const registrationData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                role: userRole,
                gender: formData.gender,
                ...(userRole === UserRole.TUTOR && {
                    district: formData.district,
                    thana: formData.thana,
                    areas: formData.areas,
                    subjects: formData.subjects,
                    medium: formData.medium,
                })
            };

            const response = await createUsers(registrationData).unwrap();
            
            if (response.success) {
                setCurrentStep('success');
                toast.success('Registration successful! Redirecting to home...');
            }
        } catch (error: any) {
            toast.error(error?.data?.message || 'Registration failed');
        }
    };

    // SEO Metadata
    const pageTitle = userRole === UserRole.TUTOR 
        ? 'Become a Tutor - Join Our Teaching Platform' 
        : 'Student Registration - Start Learning Today';
    const pageDescription = userRole === UserRole.TUTOR
        ? 'Register as a tutor to teach students online. Flexible schedule, good earnings, and make a difference.'
        : 'Create your student account to find the best tutors and improve your academic performance.';

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta name="keywords" content={
                    userRole === UserRole.TUTOR 
                    ? "online tutoring, become a tutor, teaching jobs, home tuition" 
                    : "student registration, find tutors, online learning, academic help"
                } />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:type" content="website" />
                <link rel="canonical" href="https://yourdomain.com/register" />
            </Head>

            <Toaster position="top-right" />

            <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <header className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            {userRole === UserRole.TUTOR ? 'Join as a Tutor' : 'Student Registration'}
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            {userRole === UserRole.TUTOR 
                                ? 'Share your knowledge and earn money by teaching students'
                                : 'Find the perfect tutor to help you achieve academic success'
                            }
                        </p>
                    </header>

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            {currentSteps.map((step, index) => (
                                <div key={step} className="flex items-center">
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                                        ${currentStepIndex >= index 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-gray-200 text-gray-500'
                                        }
                                    `}>
                                        {index + 1}
                                    </div>
                                    <div className="ml-2 hidden sm:block">
                                        <div className="text-xs font-medium text-gray-700 capitalize">
                                            {step === 'role' ? 'Select Role' : 
                                             step === 'personal' ? 'Personal Info' :
                                             step === 'location' ? 'Location' :
                                             step === 'subjects' ? 'Subjects' :
                                             step === 'password' ? 'Password' :
                                             step === 'otp' ? 'Verify OTP' : 'Complete'}
                                        </div>
                                    </div>
                                    {index < currentSteps.length - 1 && (
                                        <div className={`
                                            h-1 w-16 sm:w-24 mx-2
                                            ${currentStepIndex > index ? 'bg-blue-600' : 'bg-gray-200'}
                                        `} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Registration Form */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
                        {currentStep === 'role' && (
                            <RoleSelection 
                                selectedRole={userRole}
                                onRoleSelect={handleRoleSelect}
                            />
                        )}

                        {currentStep === 'personal' && (
                            <PersonalInfoForm
                                formData={formData}
                                updateFormData={updateFormData}
                                onNext={handleNextStep}
                                onPrev={handlePrevStep}
                            />
                        )}

                        {currentStep === 'location' && userRole === UserRole.TUTOR && (
                            <LocationSelection
                                formData={formData}
                                updateFormData={updateFormData}
                                onNext={handleNextStep}
                                onPrev={handlePrevStep}
                                districts={DistrictData?.data || []}
                            />
                        )}

                        {currentStep === 'subjects' && userRole === UserRole.TUTOR && (
                            <TutorSubjectsForm
                                formData={formData}
                                updateFormData={updateFormData}
                                onNext={handleNextStep}
                                onPrev={handlePrevStep}
                            />
                        )}

                        {currentStep === 'password' && (
                            <PasswordForm
                                formData={formData}
                                updateFormData={updateFormData}
                                onNext={handleNextStep}
                                onPrev={handlePrevStep}
                                userRole={userRole}
                            />
                        )}

                        {currentStep === 'otp' && (
                            <OTPVerification
                                formData={formData}
                                updateFormData={updateFormData}
                                onVerify={handleVerifyOTP}
                                onResend={handleResendOTP}
                                onSend={handleSendOTP}
                                onPrev={handlePrevStep}
                            />
                        )}

                        {currentStep === 'success' && (
                            <SuccessMessage
                                userRole={userRole}
                                userName={formData.name}
                            />
                        )}
                    </div>

                    {/* Footer */}
                    <footer className="mt-8 text-center text-sm text-gray-500">
                        <p>By registering, you agree to our <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a></p>
                        <p className="mt-2">© {new Date().getFullYear()} Tutor Finder. All rights reserved.</p>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default RegistrationPage;