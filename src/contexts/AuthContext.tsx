
import React, { createContext, useState, useContext, ReactNode } from 'react';

export type UserRole = 'admin' | 'employee';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  position?: string;
  joiningDate?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Mock users data for demo
const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@worknest.com',
    role: 'admin' as UserRole,
    department: 'Management',
    position: 'Administrator',
    joiningDate: '2023-01-01',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff',
  },
  {
    id: '2',
    name: 'John Employee',
    email: 'john@worknest.com',
    role: 'employee' as UserRole,
    department: 'Engineering',
    position: 'Software Developer',
    joiningDate: '2023-03-15',
    avatar: 'https://ui-avatars.com/api/?name=John+Employee&background=27AE60&color=fff',
  },
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string, role: UserRole): boolean => {
    // In a real app, this would validate against a backend
    // For demo, just check if the email matches our mock data and role
    const foundUser = MOCK_USERS.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && u.role === role
    );
    
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
