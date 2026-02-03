/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { FormData } from '@/src/types/auth';
import { User, Mail, Phone } from 'lucide-react';

interface PersonalInfoFormProps {
    formData: FormData;
    updateFormData: (field: string, value: any) => void;
    onNext: () => void;
    onPrev: () => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
    formData,
    updateFormData,
    onNext,
    onPrev
}) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext();
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
            <p className="text-gray-600">Tell us about yourself</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Full Name *
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => updateFormData('name', e.target.value)}
                                className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Email Address *
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => updateFormData('email', e.target.value)}
                                className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="your.email@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Phone Number *
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => updateFormData('phone', e.target.value)}
                                className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="01XXXXXXXXX"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Gender *
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {['Male', 'Female', 'Other'].map((gender) => (
                                <button
                                    key={gender}
                                    type="button"
                                    onClick={() => updateFormData('gender', gender)}
                                    className={`
                                        py-2 px-4 rounded-lg border text-sm font-medium transition-colors
                                        ${formData.gender === gender 
                                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                            : 'border-gray-300 hover:border-gray-400 text-gray-700'
                                        }
                                    `}
                                >
                                    {gender}
                                </button>
                            ))}
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
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Continue
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PersonalInfoForm;