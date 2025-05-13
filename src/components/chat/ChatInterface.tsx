import { useState, useEffect, useRef } from 'react';
import { SendIcon, BookOpenIcon, RotateCcwIcon, Settings2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import ChatMessage from './ChatMessage';
import ChatSettings from './ChatSettings';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// Tipo para los mensajes
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

// Ejemplo de ejercicios prácticos
const practiceExercises = [
  "Calcular la integral: ∫(x^2 + 2x + 1) dx",
  "Resolver la integral definida: ∫_0^1 x·e^x dx",
  "¿Cómo calcular la integral de ∫ sin(x)·cos(x) dx?",
  "Encontrar la integral: ∫ 1/(x^2 + 1) dx",
  "Calcular el área bajo la curva f(x) = x^2 desde x=-1 hasta x=2"
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast: toastHook } = useToast();
  const { user } = useAuth();

  // Cargar mensajes y API key del localStorage al iniciar
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    const savedApiKey = localStorage.getItem('deepseekApiKey');
    
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
    
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Error parsing chat history:', error);
      }
    } else {
      // Mensaje de bienvenida
      const welcomeMessage: Message = {
        id: 'welcome',
        content: `# Bienvenido al Asistente de Cálculo Integral\n\nPuedo ayudarte con:\n\n- Resolver problemas de cálculo integral\n- Explicar paso a paso la solución\n- Generar ejercicios para que practiques\n\nPuedes escribir ecuaciones usando la sintaxis LaTeX. Por ejemplo:\n\n$$\\int x^2 dx = \\frac{x^3}{3} + C$$\n\n¿En qué puedo ayudarte hoy?`,
        role: 'assistant',
        timestamp: Date.now()
      };
      setMessages([welcomeMessage]);
      localStorage.setItem('chatHistory', JSON.stringify([welcomeMessage]));
    }
  }, []);

  // Guardar mensajes en localStorage cuando cambien
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  // Guardar API key en localStorage cuando cambie
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('deepseekApiKey', apiKey);
    }
  }, [apiKey]);

  // Scroll al fondo cuando se añaden mensajes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleApiKeyChange = (newApiKey: string) => {
    setApiKey(newApiKey);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim()) return;
    
    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      if (apiKey) {
        // Llamada a la API de DeepSeek
        await sendToDeepSeek(userMessage.content);
      } else {
        // Simulación de respuesta si no hay API key
        setTimeout(() => {
          generateAIResponse(userMessage.content);
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toastHook({
        title: "Error",
        description: "No se pudo enviar el mensaje. Inténtalo de nuevo.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const sendToDeepSeek = async (message: string) => {
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'Eres un asistente especializado en cálculo integral. Responde en español y utiliza LaTeX para las fórmulas matemáticas. Utiliza $$ para fórmulas en bloque y $ para fórmulas inline.'
            },
            {
              role: 'user',
              content: message
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status}`);
      }

      const data = await response.json();
      
      // Añadir la respuesta de DeepSeek
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.choices[0].message.content,
        role: 'assistant',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error con la API de DeepSeek:', error);
      toast.error('Error al conectar con DeepSeek. Verifica tu API key.');
      setIsLoading(false);
      
      // Respuesta de respaldo
      generateAIResponse(message);
    }
  };

  const generateAIResponse = (userInput: string) => {
    let response = "";
    
    // Simular respuestas del asistente con formato LaTeX
    if (userInput.toLowerCase().includes("integral") || userInput.includes("∫")) {
      if (userInput.toLowerCase().includes("como") || userInput.toLowerCase().includes("cómo") || userInput.toLowerCase().includes("explicar")) {
        response = `Para calcular una integral, debes aplicar las reglas básicas de integración:\n\n1. **Regla de potencia**: $$\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$$ (para $n \\neq -1$)\n\n2. **Integración de funciones trigonométricas**: $$\\int \\sin(x) dx = -\\cos(x) + C$$\n$$\\int \\cos(x) dx = \\sin(x) + C$$\n\n3. **Integración por partes**: $$\\int u dv = uv - \\int v du$$\n\nVamos paso a paso con un ejemplo.\n\nSupongamos que queremos calcular: $$\\int x^2 dx$$\n\nAplicamos la regla de potencia con $n = 2$:\n$$\\int x^2 dx = \\frac{x^{2+1}}{2+1} + C = \\frac{x^3}{3} + C$$`;
      } else {
        response = `Vamos a resolver esta integral paso a paso:\n\n$$\\int x^2 dx = \\frac{x^3}{3} + C$$\n\nSi tienes una integral más específica, escríbela usando la notación adecuada y te ayudaré a resolverla en detalle.`;
      }
    } else if (userInput.toLowerCase().includes("ejercicio") || userInput.toLowerCase().includes("práctica") || userInput.toLowerCase().includes("practica")) {
      const randomIndex = Math.floor(Math.random() * practiceExercises.length);
      response = `Aquí tienes un ejercicio para practicar:\n\n**${practiceExercises[randomIndex]}**\n\nCuando tengas tu respuesta, envíamela y revisaré tu solución paso a paso.`;
    } else if (userInput.toLowerCase().includes("teorema") || userInput.toLowerCase().includes("fundamental")) {
      response = `El Teorema Fundamental del Cálculo establece la conexión entre la derivación y la integración.\n\nSe divide en dos partes:\n\n**Primera parte**: Si $f$ es continua en $[a, b]$ y definimos $F(x) = \\int_a^x f(t) dt$, entonces $F'(x) = f(x)$ para todo $x$ en $[a, b]$.\n\n**Segunda parte**: Si $f$ es continua en $[a, b]$ y $F$ es cualquier antiderivada de $f$, entonces:\n\n$$\\int_a^b f(x) dx = F(b) - F(a)$$\n\nEsto nos permite calcular integrales definidas encontrando solo una antiderivada y evaluándola en los límites de integración.`;
    } else {
      response = `Gracias por tu mensaje. Como asistente especializado en cálculo integral, puedo ayudarte con:\n\n- Resolver integrales paso a paso\n- Explicar conceptos del cálculo integral\n- Proponer ejercicios de práctica\n\nPuedes escribir ecuaciones usando la sintaxis LaTeX, por ejemplo: $\\int x^2 dx$\n\n¿Hay alguna integral o concepto específico que te gustaría trabajar?`;
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: response,
      role: 'assistant',
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleGenerateExercise = () => {
    const randomIndex = Math.floor(Math.random() * practiceExercises.length);
    const exercisePrompt = `Dame un ejercicio para practicar cálculo integral`;
    
    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      content: exercisePrompt,
      role: 'user',
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Simular respuesta del asistente
    setTimeout(() => {
      const response = `Aquí tienes un ejercicio para practicar:\n\n**${practiceExercises[randomIndex]}**\n\nCuando tengas tu respuesta, envíamela y revisaré tu solución paso a paso.`;
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleClearChat = () => {
    // Mantener solo el mensaje de bienvenida
    const welcomeMessage: Message = {
      id: 'welcome',
      content: `# Bienvenido al Asistente de Cálculo Integral\n\nPuedo ayudarte con:\n\n- Resolver problemas de cálculo integral\n- Explicar paso a paso la solución\n- Generar ejercicios para que practiques\n\nPuedes escribir ecuaciones usando la sintaxis LaTeX. Por ejemplo:\n\n$$\\int x^2 dx = \\frac{x^3}{3} + C$$\n\n¿En qué puedo ayudarte hoy?`,
      role: 'assistant',
      timestamp: Date.now()
    };
    
    setMessages([welcomeMessage]);
    localStorage.setItem('chatHistory', JSON.stringify([welcomeMessage]));
    toast.success('Historial de chat borrado');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Si se muestra la vista de configuración
  if (showSettings) {
    return (
      <div className="flex flex-col h-full max-w-4xl w-full mx-auto">
        <ChatSettings 
          onBack={() => setShowSettings(false)}
          apiKey={apiKey}
          onApiKeyChange={handleApiKeyChange}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl w-full mx-auto">
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-xl font-bold">Asistente de Cálculo Integral</h2>
        <div className="flex gap-2">
          <Button 
            onClick={handleGenerateExercise}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            disabled={isLoading}
          >
            <BookOpenIcon className="w-4 h-4" /> 
            <span className="hidden sm:inline">Generar ejercicio</span>
            <span className="inline sm:hidden">Ejercicio</span>
          </Button>
          <Button 
            onClick={() => setShowSettings(true)}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Settings2Icon className="w-4 h-4" />
            <span className="hidden sm:inline">Configuración</span>
            <span className="inline sm:hidden">Ajustes</span>
          </Button>
          <Button 
            onClick={handleClearChat}
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
          >
            <RotateCcwIcon className="w-4 h-4" /> 
            <span className="hidden sm:inline">Reiniciar chat</span>
            <span className="inline sm:hidden">Reiniciar</span>
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-grow mb-4 border rounded-lg bg-background overflow-hidden">
        <div className="p-4 space-y-4 min-h-full">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-center text-muted-foreground animate-pulse">
              <div className="h-2 w-2 bg-muted-foreground/50 rounded-full mx-1"></div>
              <div className="h-2 w-2 bg-muted-foreground/50 rounded-full mx-1 animate-bounce delay-75"></div>
              <div className="h-2 w-2 bg-muted-foreground/50 rounded-full mx-1 animate-bounce delay-150"></div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
      
      <form onSubmit={handleSubmit} className="flex gap-2 items-end">
        <div className="flex-grow relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu consulta sobre cálculo integral..."
            className="resize-none min-h-[80px] pr-12"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute bottom-2 right-2 h-8 w-8 rounded-full"
            disabled={isLoading || !input.trim()}
          >
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
