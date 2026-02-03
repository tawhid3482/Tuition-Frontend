/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { FormData } from '@/src/types/auth';
import { MapPin } from 'lucide-react';

interface LocationSelectionProps {
    formData: FormData;
    updateFormData: (field: string, value: any) => void;
    onNext: () => void;
    onPrev: () => void;
    districts: any[];
}

const LocationSelection: React.FC<LocationSelectionProps> = ({
    formData,
    updateFormData,
    onNext,
    onPrev,
    districts
}) => {
    const [thanas, setThanas] = useState<string[]>([]);
    const [areas, setAreas] = useState<string[]>([]);
    const [customArea, setCustomArea] = useState('');

    useEffect(() => {
        if (formData.district) {
            const selectedDistrict = districts.find(d => d.name === formData.district);
            setThanas(selectedDistrict?.thanas || []);
            if (!selectedDistrict?.thanas?.includes(formData.thana)) {
                updateFormData('thana', '');
            }
        }
    }, [formData.district, districts]);

    const handleAddArea = () => {
        if (customArea.trim() && !areas.includes(customArea.trim())) {
            const newAreas = [...areas, customArea.trim()];
            setAreas(newAreas);
            updateFormData('areas', newAreas);
            setCustomArea('');
        }
    };

    const handleRemoveArea = (areaToRemove: string) => {
        const newAreas = areas.filter(area => area !== areaToRemove);
        setAreas(newAreas);
        updateFormData('areas', newAreas);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext();
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Location Information</h2>
            <p className="text-gray-600">Where do you want to provide tuition?</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            District *
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                required
                                value={formData.district}
                                onChange={(e) => updateFormData('district', e.target.value)}
                                className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select District</option>
                                {districts.map((district) => (
                                    <option key={district.id} value={district.name}>
                                        {district.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Thana *
                        </label>
                        <select
                            required
                            disabled={!formData.district}
                            value={formData.thana}
                            onChange={(e) => updateFormData('thana', e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                        >
                            <option value="">Select Thana</option>
                            {thanas.map((thana) => (
                                <option key={thana} value={thana}>{thana}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Specific Areas (Optional)
                    </label>
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={customArea}
                                onChange={(e) => setCustomArea(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddArea())}
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Gulshan-1, Banani road 11"
                            />
                            <button
                                type="button"
                                onClick={handleAddArea}
                                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                        
                        {areas.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {areas.map((area) => (
                                    <div
                                        key={area}
                                        className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full"
                                    >
                                        <span>{area}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveArea(area)}
                                            className="text-gray-500 hover:text-red-500"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
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

export default LocationSelection;