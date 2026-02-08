/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useGetAllDistrictQuery } from "@/src/redux/features/district/districtApi";
import {
  useGetAllClassesQuery,
  useGetAllMediumQuery,
  useGetAllSubjectsQuery,
} from "@/src/redux/features/platformControl/platformControlApi";
import { useCreateTutorRequestMutation } from "@/src/redux/features/tutorReqest/tutorRequestApi";
import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import {
  X,
  Check,
  ChevronDown,
  MapPin,
  Book,
  GraduationCap,
  Users,
  Globe,
} from "lucide-react";
import useAuth from "@/src/hooks/useAuth";
import { District, FormData } from "@/src/types/tuition";

const daysOptions = [
  { value: "1", label: "1 day/week" },
  { value: "2", label: "2 days/week" },
  { value: "3", label: "3 days/week" },
  { value: "4", label: "4 days/week" },
  { value: "5", label: "5 days/week" },
  { value: "6", label: "6 days/week" },
  { value: "7", label: "7 days/week" },
];

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const tutorGenderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Any", label: "Any" },
];

const TuitionRequestForm = () => {
  // RTK Queries
  const { data: subjectsData, isLoading: loadingSubjects } =
    useGetAllSubjectsQuery(undefined);
  const { data: classesData, isLoading: loadingClasses } =
    useGetAllClassesQuery(undefined);
  const { data: mediumData, isLoading: loadingMedium } =
    useGetAllMediumQuery(undefined);
  const { data: districtData, isLoading: loadingDistricts } =
    useGetAllDistrictQuery(undefined);
  const [createTutorRequest, { isLoading: isSubmitting }] =
    useCreateTutorRequestMutation();

  const { user } = useAuth();

  // Local state for dropdowns
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null,
  );
  const [availableThanas, setAvailableThanas] = useState<string[]>([]);
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);

  // Dropdown states
  const [subjectsDropdownOpen, setSubjectsDropdownOpen] = useState(false);
  const [classesDropdownOpen, setClassesDropdownOpen] = useState(false);
  const [mediumDropdownOpen, setMediumDropdownOpen] = useState(false);
  const [areasDropdownOpen, setAreasDropdownOpen] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      student_name: "",
      phone: "",
      subject: [],
      classes: [],
      medium: [],
      days_per_week: "",
      district: "",
      thana: "",
      area: [],
      min_salary: "",
      max_salary: "",
      negotiable: false,
      additional_requirements: "",
      student_number: "",
      student_gender: "Male",
      tutor_gender: undefined,
    },
  });

  // Watch values
  const watchDistrict = watch("district");
  const watchSubjects = watch("subject");
  const watchClasses = watch("classes");
  const watchMedium = watch("medium");
  const watchAreas = watch("area");

  // Effect to update thanas when district changes
  useEffect(() => {
    if (districtData?.data && watchDistrict) {
      const district = districtData.data.find(
        (d: District) => d.name === watchDistrict,
      );
      if (district) {
        setSelectedDistrict(district);
        setAvailableThanas(district.thanas);
        setAvailableAreas(district.areas);
        // Reset thana and areas when district changes
        setValue("thana", "");
        setValue("area", []);
      }
    }
  }, [watchDistrict, districtData, setValue]);

  // Custom MultiSelect Dropdown Component
  interface MultiSelectProps {
    label: string;
    items: Array<{ id: string; name: string }> | string[];
    selectedItems: string[];
    onToggle: (name: string) => void;
    onRemove?: (name: string) => void;
    isOpen: boolean;
    onToggleOpen: () => void;
    placeholder?: string;
    icon?: React.ReactNode;
    required?: boolean;
    error?: string;
  }

  const MultiSelectDropdown = ({
    label,
    items,
    selectedItems,
    onToggle,
    onRemove,
    isOpen,
    onToggleOpen,
    placeholder = "Select options",
    icon,
    required = false,
    error,
  }: MultiSelectProps) => {
    // Check if items is array of strings or objects
    const isStringArray = items.length > 0 && typeof items[0] === "string";

    const getItemName = (item: any): string => {
      return typeof item === "string" ? item : item.name;
    };

    const getSelectedNames = () => {
      return selectedItems.join(", ");
    };

    return (
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && "*"}
        </label>

        <button
          type="button"
          onClick={onToggleOpen}
          className={`w-full px-4 py-3 border rounded-lg flex items-center justify-between ${
            error ? "border-red-500" : "border-gray-300"
          } hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary transition-colors`}
        >
          <div className="flex items-center gap-2">
            {icon}
            <span
              className={
                selectedItems.length > 0 ? "text-gray-800" : "text-gray-500"
              }
            >
              {placeholder}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {selectedItems.length > 0 && (
              <span className="bg-blue-100 text-primary text-xs px-2 py-1 rounded-full">
                {selectedItems.length}
              </span>
            )}
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={onToggleOpen} />
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
              {items.length === 0 ? (
                <div className="px-4 py-3 text-gray-500 text-center">
                  No options available
                </div>
              ) : (
                items.map((item, index) => {
                  const itemName = getItemName(item);
                  // Generate a unique key based on whether it's a string or object
                  const key = isStringArray
                    ? `${itemName}-${index}`
                    : (item as { id: string; name: string }).id;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => onToggle(itemName)}
                      className={`w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center justify-between border-b border-gray-100 last:border-b-0 ${
                        selectedItems.includes(itemName)
                          ? "bg-blue-50 text-primary"
                          : ""
                      }`}
                    >
                      <span>{itemName}</span>
                      {selectedItems.includes(itemName) && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* Selected items with remove buttons */}
        {selectedItems.length > 0 && onRemove && (
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedItems.map((itemName) => (
              <div
                key={itemName}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-primary rounded-full text-sm font-medium"
              >
                {itemName}
                <button
                  type="button"
                  onClick={() => onRemove(itemName)}
                  className="ml-1 hover:text-blue-900 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  };

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      // Prepare final form data
      const finalFormData: FormData = {
        ...data,
      };

      // Add userId only if user exists and has id
      if (user?.id) {
        finalFormData.userId = user.id;
      }

      // Validate at least one subject is selected
      if (finalFormData.subject.length === 0) {
        toast.error("Please select at least one subject");
        return;
      }

      // Validate at least one class is selected
      if (finalFormData.classes.length === 0) {
        toast.error("Please select at least one class");
        return;
      }

      // Validate at least one medium is selected
      if (finalFormData.medium.length === 0) {
        toast.error("Please select at least one medium");
        return;
      }

      // Validate salary range
      const minSalary = parseInt(finalFormData.min_salary) || 0;
      const maxSalary = parseInt(finalFormData.max_salary) || 0;

      if (minSalary > 0 && maxSalary > 0 && minSalary > maxSalary) {
        toast.error("Minimum salary cannot be greater than maximum salary");
        return;
      }

      console.log("Final Form Data:", finalFormData);

      // Send data to backend - backend will generate jobs_id automatically
      const response = await createTutorRequest(finalFormData).unwrap();
      if (response) {
        toast.success("Tuition job posted successfully!");
      }

      // Reset form
      reset();
      setSelectedDistrict(null);
      setAvailableThanas([]);
      setAvailableAreas([]);
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to post tuition job. Please try again.",
      );
      console.error("Submission error:", error);
    }
  };

  // Custom dropdown component for single select
  const CustomSelect = ({
    name,
    options,
    value,
    onChange,
    placeholder,
    error,
    icon,
  }: {
    name: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    error?: string;
    icon?: React.ReactNode;
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 border rounded-lg flex items-center justify-between ${
            error ? "border-red-500" : "border-gray-300"
          } hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-blue-200 transition-colors`}
        >
          <div className="flex items-center gap-2">
            {icon}
            <span className={value ? "text-gray-800" : "text-gray-500"}>
              {value
                ? options.find((opt) => opt.value === value)?.label || value
                : placeholder}
            </span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center justify-between border-b border-gray-100 last:border-b-0 ${
                    value === option.value ? "bg-blue-50 text-primary" : ""
                  }`}
                >
                  <span>{option.label}</span>
                  {value === option.value && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  };

  return (
    <>
      <Toaster position="top-right" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-100 rounded-2xl shadow-xl p-6 md:p-8"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Post a Tuition Job
          </h2>
          <p className="text-gray-600">
            Fill in the details to find the perfect tutor for your needs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Student & Academic Info */}
          <div className="space-y-8">
            {/* Student Information */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Student Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    {...register("student_name", {
                      required: "Student name is required",
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.student_name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter student name"
                  />
                  {errors.student_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.student_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{11}$/,
                        message: "Please enter a valid 11-digit phone number",
                      },
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="01XXXXXXXXX"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student Gender *
                    </label>
                    <Controller
                      name="student_gender"
                      control={control}
                      rules={{ required: "Student gender is required" }}
                      render={({ field }) => (
                        <CustomSelect
                          name="student_gender"
                          options={genderOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select gender"
                          error={errors.student_gender?.message}
                        />
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Tutor Gender
                    </label>
                    <Controller
                      name="tutor_gender"
                      control={control}
                      render={({ field }) => (
                        <CustomSelect
                          name="tutor_gender"
                          options={tutorGenderOptions}
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Tutor Gender"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Requirements */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Book className="w-5 h-5" />
                Academic Requirements
              </h3>

              <div className="space-y-6">
                {/* Subjects Dropdown */}
                <div>
                  {loadingSubjects ? (
                    <div className="text-gray-500">Loading subjects...</div>
                  ) : (
                    <MultiSelectDropdown
                      label="Subjects Required *"
                      items={subjectsData?.data || []}
                      selectedItems={watchSubjects || []}
                      onToggle={(subjectName) => {
                        const currentSubjects = watchSubjects || [];
                        if (currentSubjects.includes(subjectName)) {
                          setValue(
                            "subject",
                            currentSubjects.filter(
                              (sub) => sub !== subjectName,
                            ),
                          );
                        } else {
                          setValue("subject", [
                            ...currentSubjects,
                            subjectName,
                          ]);
                        }
                      }}
                      onRemove={(subjectName) => {
                        const currentSubjects = watchSubjects || [];
                        setValue(
                          "subject",
                          currentSubjects.filter((sub) => sub !== subjectName),
                        );
                      }}
                      isOpen={subjectsDropdownOpen}
                      onToggleOpen={() =>
                        setSubjectsDropdownOpen(!subjectsDropdownOpen)
                      }
                      placeholder="Select subjects"
                      icon={<Book className="w-4 h-4" />}
                      required
                      error={errors.subject?.message}
                    />
                  )}
                </div>

                {/* Classes Dropdown */}
                <div>
                  {loadingClasses ? (
                    <div className="text-gray-500">Loading classes...</div>
                  ) : (
                    <MultiSelectDropdown
                      label="Class Level *"
                      items={classesData?.data || []}
                      selectedItems={watchClasses || []}
                      onToggle={(className) => {
                        const currentClasses = watchClasses || [];
                        if (currentClasses.includes(className)) {
                          setValue(
                            "classes",
                            currentClasses.filter((cls) => cls !== className),
                          );
                        } else {
                          setValue("classes", [...currentClasses, className]);
                        }
                      }}
                      onRemove={(className) => {
                        const currentClasses = watchClasses || [];
                        setValue(
                          "classes",
                          currentClasses.filter((cls) => cls !== className),
                        );
                      }}
                      isOpen={classesDropdownOpen}
                      onToggleOpen={() =>
                        setClassesDropdownOpen(!classesDropdownOpen)
                      }
                      placeholder="Select classes"
                      icon={<GraduationCap className="w-4 h-4" />}
                      required
                      error={errors.classes?.message}
                    />
                  )}
                </div>

                {/* Medium Dropdown - MULTIPLE SELECT */}
                <div>
                  {loadingMedium ? (
                    <div className="text-gray-500">
                      Loading medium options...
                    </div>
                  ) : (
                    <MultiSelectDropdown
                      label="Medium of Instruction *"
                      items={mediumData?.data || []}
                      selectedItems={watchMedium || []}
                      onToggle={(mediumName) => {
                        const currentMedium = watchMedium || [];
                        if (currentMedium.includes(mediumName)) {
                          setValue(
                            "medium",
                            currentMedium.filter((m) => m !== mediumName),
                          );
                        } else {
                          setValue("medium", [...currentMedium, mediumName]);
                        }
                      }}
                      onRemove={(mediumName) => {
                        const currentMedium = watchMedium || [];
                        setValue(
                          "medium",
                          currentMedium.filter((m) => m !== mediumName),
                        );
                      }}
                      isOpen={mediumDropdownOpen}
                      onToggleOpen={() =>
                        setMediumDropdownOpen(!mediumDropdownOpen)
                      }
                      placeholder="Select medium"
                      icon={<Globe className="w-4 h-4" />}
                      required
                      error={errors.medium?.message}
                    />
                  )}
                </div>

                {/* Days Per Week */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Days Per Week *
                  </label>
                  <Controller
                    name="days_per_week"
                    control={control}
                    rules={{ required: "Days per week is required" }}
                    render={({ field }) => (
                      <CustomSelect
                        name="days_per_week"
                        options={daysOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select days"
                        error={errors.days_per_week?.message}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Location & Salary */}
          <div className="space-y-8">
            {/* Location Information */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District *
                  </label>
                  {loadingDistricts ? (
                    <div className="text-gray-500">Loading districts...</div>
                  ) : (
                    <Controller
                      name="district"
                      control={control}
                      rules={{ required: "District is required" }}
                      render={({ field }) => (
                        <CustomSelect
                          name="district"
                          options={
                            districtData?.data?.map((d: District) => ({
                              value: d.name,
                              label: d.name,
                            })) || []
                          }
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select district"
                          error={errors.district?.message}
                          icon={<MapPin className="w-4 h-4" />}
                        />
                      )}
                    />
                  )}
                </div>

                {availableThanas.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thana *
                    </label>
                    <Controller
                      name="thana"
                      control={control}
                      rules={{ required: "Thana is required" }}
                      render={({ field }) => (
                        <CustomSelect
                          name="thana"
                          options={availableThanas.map((thana) => ({
                            value: thana,
                            label: thana,
                          }))}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select thana"
                          error={errors.thana?.message}
                        />
                      )}
                    />
                  </div>
                )}

                {/* Areas Dropdown */}
                {availableAreas.length > 0 && (
                  <div>
                    {watchDistrict && (
                      <MultiSelectDropdown
                        label="Select Areas"
                        items={availableAreas}
                        selectedItems={watchAreas || []}
                        onToggle={(areaName) => {
                          const currentAreas = watchAreas || [];
                          if (currentAreas.includes(areaName)) {
                            setValue(
                              "area",
                              currentAreas.filter((a) => a !== areaName),
                            );
                          } else {
                            setValue("area", [...currentAreas, areaName]);
                          }
                        }}
                        onRemove={(areaName) => {
                          const currentAreas = watchAreas || [];
                          setValue(
                            "area",
                            currentAreas.filter((a) => a !== areaName),
                          );
                        }}
                        isOpen={areasDropdownOpen}
                        onToggleOpen={() =>
                          setAreasDropdownOpen(!areasDropdownOpen)
                        }
                        placeholder="Select areas"
                        icon={<MapPin className="w-4 h-4" />}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Salary Information */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Salary & Requirements
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Salary (BDT)
                    </label>
                    <input
                      type="number"
                      {...register("min_salary", {
                        min: { value: 0, message: "Salary must be positive" },
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.min_salary ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Min amount"
                    />
                    {errors.min_salary && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.min_salary.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Salary (BDT)
                    </label>
                    <input
                      type="number"
                      {...register("max_salary", {
                        min: { value: 0, message: "Salary must be positive" },
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.max_salary ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Max amount"
                    />
                    {errors.max_salary && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.max_salary.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("negotiable")}
                      className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Salary Negotiable
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Requirements
                  </label>
                  <textarea
                    {...register("additional_requirements")}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Any specific requirements or notes for the tutor..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number Of Student
                  </label>
                  <input
                    type="text"
                    {...register("student_number")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Number Of Student"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-linear-to-r from-primary to-primary text-white font-semibold rounded-lg hover:from-primary hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Posting Tuition Job...
              </>
            ) : (
              "Post Tuition Job"
            )}
          </button>

          <p className="mt-3 text-sm text-gray-500 text-center">
            * Required fields. Your information will be shared with qualified
            tutors.
          </p>
        </div>
      </form>
    </>
  );
};

export default TuitionRequestForm;
