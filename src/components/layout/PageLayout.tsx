
import Header from './Header';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

interface PageLayoutProps {
  requireAuth?: boolean;
}

export default function PageLayout({ requireAuth = false }: PageLayoutProps) {
  const { user, isLoading } = useAuth();

  // Esperar a que se verifique la autenticación
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si se requiere autenticación y no hay usuario, redirigir a login
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario y está en la página de login, redirigir a chat
  if (user && window.location.pathname === '/login') {
    return <Navigate to="/chat" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <Outlet />
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground border-t">
        <p>Calculus AI &copy; {new Date().getFullYear()} - Asistente de Cálculo Integral</p>
      </footer>
    </div>
  );
}
