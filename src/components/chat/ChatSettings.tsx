
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeftIcon, SaveIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ChatSettingsProps {
  onBack: () => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export default function ChatSettings({ onBack, apiKey, onApiKeyChange }: ChatSettingsProps) {
  const [currentApiKey, setCurrentApiKey] = useState(apiKey);

  const handleSave = () => {
    onApiKeyChange(currentApiKey);
    toast.success('Configuración guardada');
  };

  return (
    <div className="flex flex-col h-full w-full animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <Button 
          onClick={onBack} 
          variant="ghost" 
          size="sm"
          className="flex items-center gap-1"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Volver al chat
        </Button>

        <h2 className="text-xl font-bold">Configuración</h2>
        
        <Button 
          onClick={handleSave} 
          size="sm"
          className="flex items-center gap-1"
        >
          <SaveIcon className="h-4 w-4" />
          Guardar
        </Button>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border p-4 bg-card">
          <h3 className="text-lg font-medium mb-3">API de DeepSeek</h3>
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium">
              API Key
            </label>
            <Input
              id="apiKey"
              type="password"
              value={currentApiKey}
              onChange={(e) => setCurrentApiKey(e.target.value)}
              placeholder="Ingresa tu API key para usar DeepSeek"
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Si no proporcionas una API key, se usarán respuestas simuladas.
              Puedes obtener una API key en <a href="https://deepseek.com" target="_blank" rel="noopener noreferrer" className="underline text-primary">deepseek.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
