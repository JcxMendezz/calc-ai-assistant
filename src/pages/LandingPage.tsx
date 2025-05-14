import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
export default function LandingPage() {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  return <div className="w-full max-w-4xl mx-auto px-4 py-12 text-center">
      <div className="animate-fade-in space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
           Tutor Calculus <span className="text-primary">AI</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-muted-foreground">
          Tu asesor personal para el aprendizaje de cálculo integral, con explicaciones paso a paso y visualización de fórmulas matemáticas
        </p>
        
        <div className="bg-muted/40 p-6 rounded-lg border max-w-xl mx-auto my-8">
          <h2 className="text-xl font-medium mb-4">Características principales</h2>
          <ul className="space-y-3 text-left">
            <li className="flex items-start">
              <span className="bg-primary/20 text-primary p-1 rounded mr-3">✓</span>
              <span>Respuestas detalladas a preguntas de cálculo integral</span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary/20 text-primary p-1 rounded mr-3">✓</span>
              <span>Visualización perfecta de fórmulas matemáticas con LaTeX</span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary/20 text-primary p-1 rounded mr-3">✓</span>
              <span>Explicaciones paso a paso de la resolución de problemas</span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary/20 text-primary p-1 rounded mr-3">✓</span>
              <span>Generación de ejercicios para practicar</span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary/20 text-primary p-1 rounded mr-3">✓</span>
              <span>Integración con DeepSeek AI para respuestas avanzadas</span>
            </li>
          </ul>
        </div>

        <div className="math-display mx-auto my-8 p-6 border rounded-lg bg-card max-w-xl overflow-x-auto">
          <div className="katex-display">
            <BlockMath math={String.raw`\int x^n dx = \frac{x^{n+1}}{n+1} + C \quad \text{para} \quad n \neq -1`} />
          </div>
        </div>

        <div className="mx-auto flex gap-4 justify-center">
          <Button size="lg" onClick={() => navigate(user ? '/chat' : '/login')}>
            {user ? 'Ir al chat' : 'Comenzar ahora'}
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
            {user ? 'Probar otra cuenta' : 'Acceder con usuario demo'}
          </Button>
        </div>
      </div>
    </div>;
}