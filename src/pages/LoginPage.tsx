
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="w-full max-w-lg mx-auto p-4 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Calculus AI</h1>
        <p className="text-muted-foreground mb-6">
          Tu asistente personal para el aprendizaje de cálculo integral
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
