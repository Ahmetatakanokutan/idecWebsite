import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  sub: string;
  roles: string[];
  exp: number;
}

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean; // Add isLoading state
  roles: string[];
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start as loading

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: User = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsLoggedIn(true);
          setRoles(decodedToken.roles);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false); // Finished loading
  }, []);

  const login = (token: string) => {
    try {
      const decodedToken: User = jwtDecode(token);
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      setRoles(decodedToken.roles);
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setRoles([]);
    // Redirect to login to ensure clean state
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, roles, login, logout }}>
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
