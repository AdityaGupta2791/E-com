import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api.js';

const AuthContext = createContext(null);

const getStoredAuth = () => {
  try {
    const token = localStorage.getItem('token');
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
};

export function AuthProvider({ children }) {
  const stored = getStoredAuth();
  const [token, setToken] = useState(stored.token);
  const [user, setUser] = useState(stored.user);
  const [checking, setChecking] = useState(Boolean(stored.token));

  const signIn = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    try {
      if (nextToken) localStorage.setItem('token', nextToken);
      if (nextUser) localStorage.setItem('user', JSON.stringify(nextUser));
    } catch {
      // ignore localStorage errors
    }
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
    setChecking(false);
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch {
      // ignore localStorage errors
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadMe = async () => {
      if (!token) {
        setChecking(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (!isMounted) return;
        const nextUser = res?.data?.user;
        if (nextUser) {
          setUser(nextUser);
          try {
            localStorage.setItem('user', JSON.stringify(nextUser));
          } catch {
            // ignore localStorage errors
          }
        }
      } catch {
        if (!isMounted) return;
        signOut();
      } finally {
        if (isMounted) setChecking(false);
      }
    };
    loadMe();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthed: Boolean(token),
      checking,
      signIn,
      signOut,
      setUser,
      setToken,
    }),
    [token, user, checking]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
