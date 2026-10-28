import { useEffect, useState } from 'react';
import { fetchCurrentUser, getStoredUser, logout as apiLogout } from '../api/auth.js';
import { AuthContext } from './auth-context.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser().then((u) => {
        if (u) setUser(u);
      });
    }

    function handleAuthLogout() {
      setUser(null);
    }

    window.addEventListener('auth:logout', handleAuthLogout);
    return () => window.removeEventListener('auth:logout', handleAuthLogout);
  }, []);

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  const refreshUser = async () => {
    const u = await fetchCurrentUser();
    if (u) setUser(u);
    return u;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
