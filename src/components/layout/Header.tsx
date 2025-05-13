
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { SunIcon, MoonIcon, LogOutIcon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="font-bold text-xl flex items-center gap-2">
          <span className="text-primary">Calculus</span>
          <span className="text-muted-foreground">AI</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <SunIcon className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>
          
          {user && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={logout}
              title="Cerrar sesión"
            >
              <LogOutIcon className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
