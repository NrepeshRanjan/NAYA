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
  isBlocked: boolean; // New field for Admin
  
  // Student Specific
  classGrade?: string; // e.g., "10", "11", "12"
  subscriptionType?: SubscriptionType;
  isPaid?: boolean;
  paymentId?: string;
  subscriptionExpiry?: number;
  
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
  isVisible: boolean; // Admin toggle
  isDownloadable: boolean; // Admin toggle
  createdAt: number;
  views: number;
  downloads: number;
}

export interface Settings {
  id: string; // Singleton 'default'
  institutionName: string;
  adminAddress: string;
  showAdminAddress: boolean;
  adminMobile: string;
  showAdminMobile: boolean;
  
  // Watermark
  enableWatermark: boolean; // Global
  watermarkFields: ('NAME' | 'MOBILE' | 'CLASS')[];
  
  // Branding
  logoUrl: string;
  showLogo: boolean;
  logoPlacement: 'HEADER' | 'FOOTER' | 'BOTH';
  
  // Ads
  enableAds: boolean;
  adMobCode: string;
  
  // Footer
  footerLinks: { label: string; url: string; visible: boolean }[];
}

export interface Ad {
  id: string;
  title: string;
  content: string; // HTML or Image URL
  type: 'ADMOB' | 'CUSTOM';
  placement: 'HEADER' | 'FOOTER' | 'CONTENT';
  active: boolean;
}

export interface Plan {
  id: string;
  name: string;
  type: SubscriptionType;
  price: number;
  durationDays: number;
  description: string;
  active: boolean;
}

export interface AuditLog {
  id: string;
  adminId: string;
  action: string; // e.g., "USER_UPDATE", "CONTENT_DELETE"
  details: string;
  timestamp: number;
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
