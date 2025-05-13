
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="text-center max-w-lg mx-auto px-4 py-12 animate-fade-in">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Página no encontrada
      </p>
      <Button onClick={() => navigate('/')}>Volver al inicio</Button>
    </div>
  );
}
