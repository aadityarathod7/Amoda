import { createContext, useContext, useState } from 'react';
import { adminLogin, adminLogout } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('adminAuth')
  );

  const login = async (email, password) => {
    await adminLogin({ email, password });
    localStorage.setItem('adminAuth', 'true');
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await adminLogout();
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
