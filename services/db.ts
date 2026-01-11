import { User, Role, Content, Settings, Ad, PaymentRecord, SubscriptionType, ContentType } from '../types';

// Storage Keys
const USERS_KEY = 'growup_users';
const CONTENT_KEY = 'growup_content';
const SETTINGS_KEY = 'growup_settings';
const ADS_KEY = 'growup_ads';
const PAYMENTS_KEY = 'growup_payments';
const SESSION_KEY = 'growup_session';

// --- Initialization & Seeding ---

const seedData = () => {
  if (!localStorage.getItem(SETTINGS_KEY)) {
    const defaultSettings: Settings = {
      id: 'default',
      institutionName: 'Grow-up Coaching Center',
      adminAddress: '123 Education Lane, Knowledge City',
      showAdminAddress: true,
      adminMobile: '9876543210',
      showAdminMobile: true,
      enableWatermark: true,
      enableAds: true,
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
  }

  if (!localStorage.getItem(USERS_KEY)) {
    const users: User[] = [
      {
        id: 'admin-1',
        name: 'Alok Sir (Admin)',
        email: 'admin@growup.com',
        mobile: '9999999999',
        passwordHash: 'admin123', // In real app, use bcrypt
        role: Role.ADMIN,
        createdAt: Date.now(),
        showMobile: true,
      },
      {
        id: 'teacher-1',
        name: 'Physics Faculty',
        email: 'teacher@growup.com',
        mobile: '8888888888',
        passwordHash: 'teacher123',
        role: Role.TEACHER,
        createdAt: Date.now(),
        showMobile: false,
      },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  if (!localStorage.getItem(CONTENT_KEY)) {
     const contents: Content[] = [
         {
             id: 'demo-1',
             title: 'Introduction to Calculus',
             type: ContentType.VIDEO,
             url: 'https://www.youtube.com/watch?v=dummy',
             uploadedBy: 'admin-1',
             classGrade: '12',
             subject: 'Maths',
             chapter: 'Calculus',
             isWatermarked: true,
             createdAt: Date.now(),
             views: 0
         }
     ]
     localStorage.setItem(CONTENT_KEY, JSON.stringify(contents));
  }
};

// Initialize DB
seedData();

// --- Helpers ---

const getItems = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setItems = <T>(key: string, items: T[]) => {
  localStorage.setItem(key, JSON.stringify(items));
};

// --- API ---

export const db = {
  users: {
    getAll: () => getItems<User>(USERS_KEY),
    getById: (id: string) => getItems<User>(USERS_KEY).find(u => u.id === id),
    findByEmail: (email: string) => getItems<User>(USERS_KEY).find(u => u.email === email),
    create: (user: User) => {
      const users = getItems<User>(USERS_KEY);
      if (users.find(u => u.email === user.email)) throw new Error('User already exists');
      users.push(user);
      setItems(USERS_KEY, users);
      return user;
    },
    update: (id: string, updates: Partial<User>) => {
      const users = getItems<User>(USERS_KEY);
      const idx = users.findIndex(u => u.id === id);
      if (idx === -1) throw new Error('User not found');
      users[idx] = { ...users[idx], ...updates };
      setItems(USERS_KEY, users);
      return users[idx];
    },
    delete: (id: string) => {
      const users = getItems<User>(USERS_KEY).filter(u => u.id !== id);
      setItems(USERS_KEY, users);
    }
  },
  content: {
    getAll: () => getItems<Content>(CONTENT_KEY),
    getByClass: (classGrade: string) => getItems<Content>(CONTENT_KEY).filter(c => c.classGrade === classGrade),
    create: (content: Content) => {
      const items = getItems<Content>(CONTENT_KEY);
      items.push(content);
      setItems(CONTENT_KEY, items);
      return content;
    },
    delete: (id: string) => {
        const items = getItems<Content>(CONTENT_KEY).filter(c => c.id !== id);
        setItems(CONTENT_KEY, items);
    }
  },
  settings: {
    get: (): Settings => {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? JSON.parse(data) : {} as Settings;
    },
    update: (updates: Partial<Settings>) => {
      const current = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
      const updated = { ...current, ...updates };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      return updated;
    }
  },
  payments: {
    create: (payment: PaymentRecord) => {
        const items = getItems<PaymentRecord>(PAYMENTS_KEY);
        items.push(payment);
        setItems(PAYMENTS_KEY, items);
    },
    getAll: () => getItems<PaymentRecord>(PAYMENTS_KEY)
  }
};
