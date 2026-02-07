// src/components/navbar/types.ts
export interface NavItem {
  name: string;
  icon: React.ReactNode;
  href: string;
  exact?: boolean;
  dropdown?: { name: string; href: string }[];
}

export interface User {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  role?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  notification?: {
    title: string;
    message: string;
  };
}