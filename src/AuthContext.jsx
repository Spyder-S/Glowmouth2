import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from './services/authService.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // pull current session on mount
    authService.getSession().then(sess => {
      setUser(sess ? sess.user : null);
      setLoading(false);
      setInitializing(false);
    });

    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password, isSignup, name) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    if (isSignup && !name) {
      throw new Error('Name is required');
    }

    if (isSignup) {
      const u = await authService.signUp({ email, password, name });
      setUser(u);
      return u;
    } else {
      const u = await authService.signIn({ email, password });
      setUser(u);
      return u;
    }
  };

  const logout = async () => {
    await authService.signOut();
    setUser(null);
  };

  const resetPassword = async email => {
    return authService.resetPassword(email);
  };

  const updatePassword = async (newPassword, accessToken) => {
    return authService.updatePassword(newPassword, accessToken);
  };

  return (
    <AuthContext.Provider value={{ user, loading, initializing, login, logout, resetPassword, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
