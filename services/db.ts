import { User, Role, Content, Settings, Ad, PaymentRecord, SubscriptionType, ContentType, Plan, AuditLog } from '../types';

// Storage Keys
const USERS_KEY = 'growup_users';
const CONTENT_KEY = 'growup_content';
const SETTINGS_KEY = 'growup_settings';
const ADS_KEY = 'growup_ads';
const PAYMENTS_KEY = 'growup_payments';
const AUDIT_KEY = 'growup_audit';
const PLANS_KEY = 'growup_plans';

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
      watermarkFields: ['NAME', 'MOBILE', 'CLASS'],
      logoUrl: '',
      showLogo: true,
      logoPlacement: 'HEADER',
      enableAds: true,
      adMobCode: '',
      footerLinks: [
        { label: 'Privacy Policy', url: '#', visible: true },
        { label: 'Terms of Service', url: '#', visible: true }
      ]
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
  }

  if (!localStorage.getItem(PLANS_KEY)) {
    const plans: Plan[] = [
      { id: 'p1', name: 'Class 10 - Single Subject', type: SubscriptionType.CLASS_WISE, price: 500, durationDays: 365, description: 'Access to one class content', active: true },
      { id: 'p2', name: 'Overall Access', type: SubscriptionType.OVERALL, price: 2000, durationDays: 365, description: 'Access to all content', active: true }
    ];
    localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
  }

  if (!localStorage.getItem(USERS_KEY)) {
    const users: User[] = [
      {
        id: 'admin-1',
        name: 'Alok Sir (Admin)',
        email: 'admin@growup.com',
        mobile: '9999999999',
        passwordHash: 'admin123',
        role: Role.ADMIN,
        createdAt: Date.now(),
        showMobile: true,
        isBlocked: false
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
        isBlocked: false
      },
      {
        id: 'student-1',
        name: 'Rahul Kumar',
        email: 'student@growup.com',
        mobile: '7777777777',
        passwordHash: 'student123',
        role: Role.STUDENT,
        createdAt: Date.now(),
        classGrade: '10',
        subscriptionType: SubscriptionType.CLASS_WISE,
        isPaid: false,
        isBlocked: false
      }
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
             isVisible: true,
             isDownloadable: true,
             createdAt: Date.now(),
             views: 0,
             downloads: 0
         }
     ]
     localStorage.setItem(CONTENT_KEY, JSON.stringify(contents));
  }
};

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
      db.audit.log('SYSTEM', 'USER_CREATE', `Created user ${user.email}`);
      return user;
    },
    update: (id: string, updates: Partial<User>, adminId: string = 'SYSTEM') => {
      const users = getItems<User>(USERS_KEY);
      const idx = users.findIndex(u => u.id === id);
      if (idx === -1) throw new Error('User not found');
      
      const oldUser = users[idx];
      users[idx] = { ...users[idx], ...updates };
      setItems(USERS_KEY, users);
      
      // Audit log for critical changes
      if (updates.role) db.audit.log(adminId, 'USER_ROLE_CHANGE', `Changed ${oldUser.email} role to ${updates.role}`);
      if (updates.isBlocked !== undefined) db.audit.log(adminId, 'USER_BLOCK_STATUS', `${updates.isBlocked ? 'Blocked' : 'Unblocked'} ${oldUser.email}`);
      if (updates.isPaid !== undefined) db.audit.log(adminId, 'USER_PAYMENT_STATUS', `Changed ${oldUser.email} paid status to ${updates.isPaid}`);
      
      return users[idx];
    },
    delete: (id: string, adminId: string) => {
      const users = getItems<User>(USERS_KEY).filter(u => u.id !== id);
      setItems(USERS_KEY, users);
      db.audit.log(adminId, 'USER_DELETE', `Deleted user ${id}`);
    }
  },
  content: {
    getAll: () => getItems<Content>(CONTENT_KEY),
    getByClass: (classGrade: string) => getItems<Content>(CONTENT_KEY).filter(c => c.classGrade === classGrade && c.isVisible),
    create: (content: Content, adminId: string) => {
      const items = getItems<Content>(CONTENT_KEY);
      items.push(content);
      setItems(CONTENT_KEY, items);
      db.audit.log(adminId, 'CONTENT_UPLOAD', `Uploaded ${content.title}`);
      return content;
    },
    update: (id: string, updates: Partial<Content>, adminId: string) => {
        const items = getItems<Content>(CONTENT_KEY);
        const idx = items.findIndex(c => c.id === id);
        if (idx !== -1) {
            items[idx] = { ...items[idx], ...updates };
            setItems(CONTENT_KEY, items);
            db.audit.log(adminId, 'CONTENT_UPDATE', `Updated content ${id}`);
        }
    },
    delete: (id: string, adminId: string) => {
        const items = getItems<Content>(CONTENT_KEY).filter(c => c.id !== id);
        setItems(CONTENT_KEY, items);
        db.audit.log(adminId, 'CONTENT_DELETE', `Deleted content ${id}`);
    }
  },
  settings: {
    get: (): Settings => {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? JSON.parse(data) : {} as Settings;
    },
    update: (updates: Partial<Settings>, adminId: string) => {
      const current = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
      const updated = { ...current, ...updates };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      db.audit.log(adminId, 'SETTINGS_UPDATE', 'Updated system settings');
      return updated;
    }
  },
  plans: {
      getAll: () => getItems<Plan>(PLANS_KEY),
      create: (plan: Plan, adminId: string) => {
          const items = getItems<Plan>(PLANS_KEY);
          items.push(plan);
          setItems(PLANS_KEY, items);
          db.audit.log(adminId, 'PLAN_CREATE', `Created plan ${plan.name}`);
      },
      update: (id: string, updates: Partial<Plan>, adminId: string) => {
          const items = getItems<Plan>(PLANS_KEY);
          const idx = items.findIndex(p => p.id === id);
          if (idx !== -1) {
              items[idx] = { ...items[idx], ...updates };
              setItems(PLANS_KEY, items);
              db.audit.log(adminId, 'PLAN_UPDATE', `Updated plan ${items[idx].name}`);
          }
      }
  },
  ads: {
      getAll: () => getItems<Ad>(ADS_KEY),
      create: (ad: Ad, adminId: string) => {
          const items = getItems<Ad>(ADS_KEY);
          items.push(ad);
          setItems(ADS_KEY, items);
          db.audit.log(adminId, 'AD_CREATE', `Created ad ${ad.title}`);
      },
      update: (id: string, updates: Partial<Ad>, adminId: string) => {
          const items = getItems<Ad>(ADS_KEY);
          const idx = items.findIndex(a => a.id === id);
          if (idx !== -1) {
              items[idx] = { ...items[idx], ...updates };
              setItems(ADS_KEY, items);
              db.audit.log(adminId, 'AD_UPDATE', `Updated ad ${id}`);
          }
      },
      delete: (id: string, adminId: string) => {
          const items = getItems<Ad>(ADS_KEY).filter(a => a.id !== id);
          setItems(ADS_KEY, items);
          db.audit.log(adminId, 'AD_DELETE', `Deleted ad ${id}`);
      }
  },
  payments: {
    create: (payment: PaymentRecord) => {
        const items = getItems<PaymentRecord>(PAYMENTS_KEY);
        items.push(payment);
        setItems(PAYMENTS_KEY, items);
    },
    getAll: () => getItems<PaymentRecord>(PAYMENTS_KEY)
  },
  audit: {
      log: (adminId: string, action: string, details: string) => {
          const logs = getItems<AuditLog>(AUDIT_KEY);
          logs.unshift({
              id: Date.now().toString(),
              adminId,
              action,
              details,
              timestamp: Date.now()
          });
          // Keep last 1000 logs
          if (logs.length > 1000) logs.pop();
          setItems(AUDIT_KEY, logs);
      },
      getAll: () => getItems<AuditLog>(AUDIT_KEY)
  }
};
