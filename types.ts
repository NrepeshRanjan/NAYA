export enum Role {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

export enum SubscriptionType {
  CLASS_WISE = 'CLASS_WISE',
  OVERALL = 'OVERALL',
}

export enum ContentType {
  PDF = 'PDF',
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
  DOC = 'DOC',
  ZIP = 'ZIP',
  LINK = 'LINK',
  LIVE = 'LIVE',
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  passwordHash: string; // Simulated hash
  role: Role;
  createdAt: number;
  
  // Student Specific
  classGrade?: string; // e.g., "10", "11", "12"
  subscriptionType?: SubscriptionType;
  isPaid?: boolean;
  paymentId?: string;
  
  // Teacher/Admin Specific
  showMobile?: boolean;
}

export interface Content {
  id: string;
  title: string;
  description?: string;
  type: ContentType;
  url: string; // In real app, secure blob URL
  uploadedBy: string; // Teacher/Admin ID
  classGrade: string; // Which class this belongs to
  subject: string;
  chapter: string;
  topic?: string;
  isWatermarked: boolean;
  createdAt: number;
  views: number;
}

export interface Settings {
  id: string; // Singleton 'default'
  institutionName: string;
  adminAddress: string;
  showAdminAddress: boolean;
  adminMobile: string;
  showAdminMobile: boolean;
  enableWatermark: boolean;
  enableAds: boolean;
  adMobId?: string;
  logoUrl?: string;
}

export interface Ad {
  id: string;
  title: string;
  imageUrl?: string;
  linkUrl: string;
  placement: 'HEADER' | 'FOOTER' | 'CONTENT';
  active: boolean;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  amount: number;
  date: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  subscriptionType: SubscriptionType;
  targetClass?: string;
}
