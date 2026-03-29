import { createContext, useContext, useState } from 'react';
import { getSession, login as authLogin, signup as authSignup, logout as authLogout, updateUser as authUpdate } from './auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSession());

  async function login(email, password) {
    const result = authLogin(email, password);
    if (result.ok) setUser(result.user);
    return result;
  }

  async function signup(name, email, password) {
    const result = authSignup(name, email, password);
    if (result.ok) setUser(result.user);
    return result;
  }

  function logout() {
    authLogout();
    setUser(null);
  }

  function updateUser(fields) {
    const updated = authUpdate(fields);
    if (updated) setUser(updated);
    return updated;
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
