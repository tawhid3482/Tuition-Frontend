export enum UserRole {
    STUDENT = 'STUDENT',
    TUTOR = 'TUTOR'
}

export interface FormData {
    name: string;
    email: string;
    phone: string;
    gender: string;
    password: string;
    confirmPassword: string;
    role: UserRole;
    district?: string;
    thana?: string;
    areas?: string[];
    subjects?: string[];
    medium?: string[];
    otp: string;
    otpSent: boolean;
    otpVerified: boolean;
}

export interface District {
    id: string;
    name: string;
    thanas: string[];
}