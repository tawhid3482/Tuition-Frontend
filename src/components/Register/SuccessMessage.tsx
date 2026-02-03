/* eslint-disable react/no-unescaped-entities */
import React, { useEffect } from 'react';
import { UserRole } from '@/src/types/auth';
import { CheckCircle, Home, UserCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SuccessMessageProps {
    userRole: UserRole;
    userName: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ userRole, userName }) => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/');
        }, 5000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Registration Successful!
            </h2>
            
            <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-6">
                <UserCheck className="h-5 w-5 text-blue-600" />
                <span className="text-blue-700 font-medium">
                    Welcome, {userName}!
                </span>
            </div>

            <div className="max-w-md mx-auto space-y-4 text-gray-600">
                <p className="text-lg">
                    {userRole === UserRole.TUTOR 
                        ? 'Your tutor account has been created successfully.'
                        : 'Your student account has been created successfully.'
                    }
                </p>
                
                <div className="bg-gray-50 rounded-xl p-6 space-y-4 text-left">
                    <h3 className="font-semibold text-gray-900">What's next?</h3>
                    <ul className="space-y-2">
                        {userRole === UserRole.TUTOR ? (
                            <>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                                    <span>Complete your profile to attract more students</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                                    <span>Set your availability and teaching preferences</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                                    <span>Start receiving teaching requests from students</span>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                                    <span>Browse and find the perfect tutor for your needs</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                                    <span>Schedule your first lesson with your chosen tutor</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                                    <span>Track your learning progress and achievements</span>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>

            <div className="mt-8">
                <div className="inline-flex items-center gap-2 text-gray-500 mb-4">
                    <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse"></div>
                    <p>Redirecting to home page in 5 seconds...</p>
                </div>
                
                <button
                    onClick={() => router.push('/')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Home className="h-5 w-5" />
                    Go to Home Page
                </button>
            </div>
        </div>
    );
};

export default SuccessMessage;