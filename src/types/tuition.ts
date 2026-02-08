// types/tuition.ts
export type EGender = 'Male' | 'Female' | 'Other';

export interface Subject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Medium {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface District {
  id: string;
  name: string;
  thanas: string[];
  areas: string[];
  createdAt: string;
  updatedAt: string;
}

// Form data type matching backend schema - userId optional korsi
export interface FormData {
  userId?: string; // ✅ Optional korsi
  student_name: string;
  phone: string;
  subject: string[];
  classes: string[];
  medium: string[];
  days_per_week: string;
  district: string;
  thana: string;
  area: string[];
  min_salary: string;
  max_salary: string;
  negotiable: boolean;
  additional_requirements?: string;
  student_number: string;
  student_gender: "Male" | "Female" | "Other";
  tutor_gender?: "Male" | "Female" | "Any";
}