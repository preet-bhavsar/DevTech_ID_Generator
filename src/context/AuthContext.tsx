import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, isFirebaseConfigured } from '../services/firebase';
import { signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'superadmin' | 'hr' | string;
}

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isHRAdmin: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginAsDemoSuperAdmin: () => void;
  loginAsDemoHR: () => void;
  logout: () => Promise<void>;
  isFirebaseMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_SUPER_ADMIN: AdminUser = {
  uid: 'DT-ADM-0001',
  email: 'admin@devtechitsolution.com',
  displayName: 'Super Administrator',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  role: 'superadmin',
};

const DEMO_HR_ADMIN: AdminUser = {
  uid: 'DT-HR-0001',
  email: 'hr@devtechitsolution.com',
  displayName: 'HR Administrator',
  photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  role: 'hr',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    const savedDemo = localStorage.getItem('devtech_admin_user');
    return savedDemo ? JSON.parse(savedDemo) : DEMO_SUPER_ADMIN;
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          const emailStr = fbUser.email?.toLowerCase() || '';
          const isSup = emailStr.includes('admin') || emailStr.includes('super');
          const adminUser: AdminUser = {
            uid: fbUser.uid,
            email: fbUser.email || 'admin@devtechitsolution.com',
            displayName: fbUser.displayName || (isSup ? 'Super Administrator' : 'HR Administrator'),
            photoURL: fbUser.photoURL || undefined,
            role: isSup ? 'superadmin' : 'hr',
          };
          setUser(adminUser);
          localStorage.setItem('devtech_admin_user', JSON.stringify(adminUser));
        } else {
          const saved = localStorage.getItem('devtech_admin_user');
          if (!saved) setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        await signInWithEmailAndPassword(auth, email, pass);
      } else {
        const emailLower = email.toLowerCase();
        const isSup = emailLower.includes('admin') || emailLower.includes('super');
        const demoUser: AdminUser = {
          uid: isSup ? 'DT-ADM-0001' : 'DT-HR-0001',
          email,
          displayName: isSup ? 'Super Administrator' : 'HR Administrator',
          role: isSup ? 'superadmin' : 'hr',
        };
        setUser(demoUser);
        localStorage.setItem('devtech_admin_user', JSON.stringify(demoUser));
      }
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemoSuperAdmin = () => {
    setUser(DEMO_SUPER_ADMIN);
    localStorage.setItem('devtech_admin_user', JSON.stringify(DEMO_SUPER_ADMIN));
  };

  const loginAsDemoHR = () => {
    setUser(DEMO_HR_ADMIN);
    localStorage.setItem('devtech_admin_user', JSON.stringify(DEMO_HR_ADMIN));
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.error(e);
      }
    }
    setUser(null);
    localStorage.removeItem('devtech_admin_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: Boolean(user),
        isSuperAdmin: user?.role === 'superadmin',
        isHRAdmin: user?.role === 'hr',
        login,
        loginAsDemoSuperAdmin,
        loginAsDemoHR,
        logout,
        isFirebaseMode: isFirebaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
