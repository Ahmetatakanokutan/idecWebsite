import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  sub: string;
  roles: string[];
  fullName: string; // Add fullName
  exp: number;
}

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  roles: string[];
  fullName: string | null; // Add fullName
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [fullName, setFullName] = useState<string | null>(null); // State for fullName
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: User = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsLoggedIn(true);
          setRoles(decodedToken.roles);
          setFullName(decodedToken.fullName); // Set fullName
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  // Notify external widgets (like KarbonBot) about login status
  useEffect(() => {
    if (!isLoading) {
      window.postMessage({ 
        type: 'KYDDTR_LOGIN_STATUS', 
        isLoggedIn: isLoggedIn 
      }, '*');
    }
  }, [isLoggedIn, isLoading]);

  const login = (token: string) => {
    try {
      const decodedToken: User = jwtDecode(token);
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      setRoles(decodedToken.roles);
      setFullName(decodedToken.fullName); // Set fullName
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setRoles([]);
    setFullName(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, roles, fullName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
