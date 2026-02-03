import React from 'react';
import { GraduationCap, School } from 'lucide-react';
import { UserRole } from '@/src/types/auth';

interface RoleSelectionProps {
    selectedRole: UserRole;
    onRoleSelect: (role: UserRole) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ selectedRole, onRoleSelect }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Select Your Role</h2>
            <p className="text-gray-600">Choose how you want to use our platform</p>
            
            <div className="grid md:grid-cols-2 gap-6">
                <button
                    onClick={() => onRoleSelect(UserRole.STUDENT)}
                    className={`
                        p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02]
                        ${selectedRole === UserRole.STUDENT 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300'
                        }
                    `}
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                            <School className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Student</h3>
                        <p className="text-gray-600 mb-4">
                            I want to learn from experienced tutors and improve my academic performance
                        </p>
                        <div className="text-sm text-gray-500">
                            <ul className="list-disc list-inside space-y-1 text-left">
                                <li>Find qualified tutors</li>
                                <li>Flexible schedule</li>
                                <li>Personalized learning</li>
                                <li>Track progress</li>
                            </ul>
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => onRoleSelect(UserRole.TUTOR)}
                    className={`
                        p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02]
                        ${selectedRole === UserRole.TUTOR 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'border-gray-200 hover:border-purple-300'
                        }
                    `}
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                            <GraduationCap className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Tutor</h3>
                        <p className="text-gray-600 mb-4">
                            I want to share my knowledge and help students achieve their academic goals
                        </p>
                        <div className="text-sm text-gray-500">
                            <ul className="list-disc list-inside space-y-1 text-left">
                                <li>Set your own rates</li>
                                <li>Flexible working hours</li>
                                <li>Build your reputation</li>
                                <li>Help students succeed</li>
                            </ul>
                        </div>
                    </div>
                </button>
            </div>

            <div className="flex justify-center mt-8">
                <button
                    onClick={() => onRoleSelect(selectedRole)}
                    className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Continue as {selectedRole === UserRole.STUDENT ? 'Student' : 'Tutor'}
                </button>
            </div>
        </div>
    );
};

export default RoleSelection;