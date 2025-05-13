
import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'sonner';

interface User {
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Comprobar si hay un usuario en localStorage
    const storedUser = localStorage.getItem('calculusUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('calculusUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simular una verificación de credenciales para usuario demo
    if (email === 'demo@demo.com' && password === 'demo123') {
      const newUser = { email, name: 'Usuario Demo' };
      setUser(newUser);
      localStorage.setItem('calculusUser', JSON.stringify(newUser));
      toast.success('¡Sesión iniciada correctamente!');
      setIsLoading(false);
      return true;
    }
    
    // Aquí se podría implementar una autenticación real con API
    toast.error('Credenciales incorrectas. Utiliza demo@demo.com / demo123');
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('calculusUser');
    localStorage.removeItem('chatHistory');
    toast.info('Sesión cerrada');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
