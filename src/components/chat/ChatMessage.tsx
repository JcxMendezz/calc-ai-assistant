import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import ReactMarkdown from 'react-markdown';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { UserIcon, BrainIcon } from 'lucide-react';
import { type Message } from './ChatInterface';

interface ChatMessageProps {
  message: Message;
}

// Expresiones regulares mejoradas para detectar LaTeX
const dollarRegex = /\$\$(.*?)\$\$/gs;
// Regex mejorado para evitar conflictos con símbolos $ en texto normal
const inlineLatexRegex = /(?<!\$)\$(?!\$)((?:\\.|[^\\$\\])+?)\$/g;

export default function ChatMessage({ message }: ChatMessageProps) {
  const { content, role, image } = message;
  
  // Procesa el contenido para renderizar LaTeX y Markdown
  const processContent = () => {
    // Preparamos un array para construir el resultado
    const parts: JSX.Element[] = [];
    let lastIndex = 0;
    let key = 0;
    
    // Primero extraemos los bloques de LaTeX
    const contentCopy = content;
    let match;

    // Procesar bloques de LaTeX ($$...$$)
    while ((match = dollarRegex.exec(contentCopy)) !== null) {
      // Añadir texto antes del bloque LaTeX
      if (match.index > lastIndex) {
        const textBefore = contentCopy.slice(lastIndex, match.index);
        parts.push(
          <div key={key++} className="inline">
            <ReactMarkdown>{textBefore}</ReactMarkdown>
          </div>
        );
      }
      
      // Añadir el bloque LaTeX
      try {
        const latexContent = match[1].trim();
        parts.push(
          <div key={key++} className="py-2 overflow-x-auto">
            <BlockMath math={latexContent} />
          </div>
        );
      } catch (error) {
        parts.push(<span key={key++} className="text-red-500">Error al renderizar LaTeX</span>);
      }
      
      lastIndex = match.index + match[0].length;
    }
    
    // Añadir el texto restante después del último bloque
    if (lastIndex < contentCopy.length) {
      const remainingContent = contentCopy.slice(lastIndex);
      
      // Usar enfoque de marcadores para procesar LaTeX inline
      const latexSegments: string[] = [];
      const processedContent = remainingContent.replace(inlineLatexRegex, (match, formula) => {
        const marker = `__LATEX_INLINE_${latexSegments.length}__`;
        latexSegments.push(formula.trim());
        return marker;
      });
      
      // Si hay marcadores de LaTeX, procesarlos
      if (latexSegments.length > 0) {
        // Dividir el contenido en segmentos basados en los marcadores
        const segments: (string | JSX.Element)[] = [];
        let lastPos = 0;
        let markerMatch;
        const markerRegex = /__LATEX_INLINE_(\d+)__/g;
        
        while ((markerMatch = markerRegex.exec(processedContent)) !== null) {
          // Añadir texto antes del marcador
          if (markerMatch.index > lastPos) {
            segments.push(processedContent.substring(lastPos, markerMatch.index));
          }
          
          // Reemplazar el marcador con el componente LaTeX
          const index = parseInt(markerMatch[1]);
          try {
            segments.push(
              <InlineMath key={`inline-${key++}`} math={latexSegments[index]} />
            );
          } catch (error) {
            segments.push(
              <span key={`inline-error-${key++}`} className="text-red-500">Error LaTeX</span>
            );
          }
          
          lastPos = markerMatch.index + markerMatch[0].length;
        }
        
        // Añadir el texto restante después del último marcador
        if (lastPos < processedContent.length) {
          segments.push(processedContent.substring(lastPos));
        }
        
        // Convertir segmentos a JSX
        let currentText = "";
        const finalSegments: JSX.Element[] = [];
        
        segments.forEach((segment, ) => {
          if (typeof segment === 'string') {
            currentText += segment;
          } else {
            // Renderizar texto acumulado antes del componente LaTeX
            if (currentText) {
              finalSegments.push(
                <span key={`text-${key++}`} className="inline">
                  <ReactMarkdown>{currentText}</ReactMarkdown>
                </span>
              );
              currentText = "";
            }
            finalSegments.push(segment);
          }
        });
        
        // Renderizar cualquier texto restante
        if (currentText) {
          finalSegments.push(
            <span key={`text-${key++}`} className="inline">
              <ReactMarkdown>{currentText}</ReactMarkdown>
            </span>
          );
        }
        
        parts.push(
          <div key={`combined-${key++}`} className="inline">
            {finalSegments}
          </div>
        );
      } else {
        // No hay LaTeX inline, renderizar normalmente
        parts.push(
          <div key={key++}>
            <ReactMarkdown>{processedContent}</ReactMarkdown>
          </div>
        );
      }
    }
    
    return <div className="message-content">{parts}</div>;
  };

  return (
    <div className={cn(
      "flex gap-3 py-4 -mx-2 px-2 rounded-lg animate-fade-in",
      role === "assistant" ? "bg-muted/30" : ""
    )}>
      <div className="flex-shrink-0 mt-1">
        <Avatar className={cn(
          "h-8 w-8 rounded-md flex items-center justify-center",
          role === "assistant" ? "bg-primary/20" : "bg-secondary"
        )}>
          {role === "assistant" ? (
            <BrainIcon className="h-4 w-4 text-primary" />
          ) : (
            <UserIcon className="h-4 w-4" />
          )}
        </Avatar>
      </div>
      <div className="chat-message flex-1 break-words overflow-x-auto">
        {image && (
          <div className="mb-2 rounded-md overflow-hidden border border-border max-h-72 w-fit">
            <img 
              src={image} 
              alt="Imagen cargada" 
              className="object-contain max-h-72"
            />
          </div>
        )}
        {processContent()}
      </div>
    </div>
  );
}