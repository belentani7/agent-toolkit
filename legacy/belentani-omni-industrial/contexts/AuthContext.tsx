import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  uid: string;
  email: string;
  displayName?: string;
}

interface UserProfile {
  tier: 'free' | 'premium' | 'admin';
  email: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular verificación de autenticación
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('belentani_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setProfile({
            tier: 'free',
            email: userData.email,
            createdAt: new Date(),
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simular login
      const userData: User = {
        uid: 'user_' + Date.now(),
        email,
        displayName: email.split('@')[0],
      };
      setUser(userData);
      setProfile({
        tier: 'free',
        email,
        createdAt: new Date(),
      });
      localStorage.setItem('belentani_user', JSON.stringify(userData));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('belentani_user');
  };

  const signup = async (email: string, password: string) => {
    await login(email, password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
