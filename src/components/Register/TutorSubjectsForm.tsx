/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { FormData } from '@/src/types/auth';
import { BookOpen, Globe } from 'lucide-react';

interface TutorSubjectsFormProps {
    formData: FormData;
    updateFormData: (field: string, value: any) => void;
    onNext: () => void;
    onPrev: () => void;
}

const TutorSubjectsForm: React.FC<TutorSubjectsFormProps> = ({
    formData,
    updateFormData,
    onNext,
    onPrev
}) => {
    const [customSubject, setCustomSubject] = useState('');

    const subjects = [
        'Mathematics', 'Physics', 'Chemistry', 'Biology',
        'English', 'Bangla', 'ICT', 'Accounting',
        'Economics', 'Business Studies', 'General Science'
    ];

    const mediums = ['Bangla', 'English', 'Arabic', 'Both Bangla & English'];

    const handleSubjectToggle = (subject: string) => {
        const currentSubjects = formData.subjects || [];
        const newSubjects = currentSubjects.includes(subject)
            ? currentSubjects.filter(s => s !== subject)
            : [...currentSubjects, subject];
        updateFormData('subjects', newSubjects);
    };

    const handleMediumToggle = (medium: string) => {
        const currentMediums = formData.medium || [];
        const newMediums = currentMediums.includes(medium)
            ? currentMediums.filter(m => m !== medium)
            : [...currentMediums, medium];
        updateFormData('medium', newMediums);
    };

    const handleAddCustomSubject = () => {
        if (customSubject.trim() && !formData.subjects?.includes(customSubject.trim())) {
            const newSubjects = [...(formData.subjects || []), customSubject.trim()];
            updateFormData('subjects', newSubjects);
            setCustomSubject('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext();
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Teaching Preferences</h2>
            <p className="text-gray-600">What subjects and medium do you teach?</p>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Subjects Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Subjects</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {subjects.map((subject) => (
                            <button
                                key={subject}
                                type="button"
                                onClick={() => handleSubjectToggle(subject)}
                                className={`
                                    p-3 rounded-lg border text-sm font-medium transition-all
                                    ${formData.subjects?.includes(subject)
                                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                        : 'border-gray-300 hover:border-gray-400 text-gray-700'
                                    }
                                `}
                            >
                                {subject}
                            </button>
                        ))}
                    </div>

                    {/* Custom Subject */}
                    <div className="pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Add Other Subjects
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={customSubject}
                                onChange={(e) => setCustomSubject(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomSubject())}
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter subject name"
                            />
                            <button
                                type="button"
                                onClick={handleAddCustomSubject}
                                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Selected Subjects */}
                    {formData.subjects && formData.subjects.length > 0 && (
                        <div className="pt-4">
                            <p className="text-sm text-gray-600 mb-2">Selected Subjects:</p>
                            <div className="flex flex-wrap gap-2">
                                {formData.subjects.map((subject) => (
                                    <div
                                        key={subject}
                                        className="inline-flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full"
                                    >
                                        <span className="text-blue-700 text-sm">{subject}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleSubjectToggle(subject)}
                                            className="text-blue-700 hover:text-blue-900"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Medium Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-purple-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Teaching Medium</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {mediums.map((medium) => (
                            <button
                                key={medium}
                                type="button"
                                onClick={() => handleMediumToggle(medium)}
                                className={`
                                    p-3 rounded-lg border text-sm font-medium transition-all
                                    ${formData.medium?.includes(medium)
                                        ? 'border-purple-500 bg-purple-50 text-purple-700' 
                                        : 'border-gray-300 hover:border-gray-400 text-gray-700'
                                    }
                                `}
                            >
                                {medium}
                            </button>
                        ))}
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
                        disabled={!formData.subjects?.length || !formData.medium?.length}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Continue
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TutorSubjectsForm;