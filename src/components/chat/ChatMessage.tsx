
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

// Expresiones regulares para detectar LaTeX
const dollarRegex = /\$\$(.*?)\$\$/gs;
const inlineLatexRegex = /\$(.*?)\$/g;

export default function ChatMessage({ message }: ChatMessageProps) {
  const { content, role } = message;
  
  // Procesa el contenido para renderizar LaTeX y Markdown
  const processContent = () => {
    // Preparamos un array para construir el resultado
    const parts: JSX.Element[] = [];
    let lastIndex = 0;
    let key = 0;
    
    // Primero extraemos los bloques de LaTeX
    let contentCopy = content;
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
      
      // Procesar inline LaTeX ($...$) en el texto restante
      let inlineLastIndex = 0;
      let inlineParts: (string | JSX.Element)[] = [];
      let inlineMatch;
      
      while ((inlineMatch = inlineLatexRegex.exec(remainingContent)) !== null) {
        // Añadir texto antes del inline LaTeX
        if (inlineMatch.index > inlineLastIndex) {
          inlineParts.push(remainingContent.slice(inlineLastIndex, inlineMatch.index));
        }
        
        // Añadir el inline LaTeX
        try {
          const inlineLatexContent = inlineMatch[1].trim();
          inlineParts.push(<InlineMath key={`inline-${key++}`} math={inlineLatexContent} />);
        } catch (error) {
          inlineParts.push(<span key={`inline-${key++}`} className="text-red-500">Error LaTeX</span>);
        }
        
        inlineLastIndex = inlineMatch.index + inlineMatch[0].length;
      }
      
      // Añadir el texto restante después del último inline LaTeX
      if (inlineLastIndex < remainingContent.length) {
        inlineParts.push(remainingContent.slice(inlineLastIndex));
      }
      
      // Convertir las partes inline a JSX
      if (inlineParts.length > 0) {
        const combinedInlineContent = inlineParts.map((part, idx) => {
          if (typeof part === 'string') {
            return (
              <div key={`md-${idx}`}>
                <ReactMarkdown>{part}</ReactMarkdown>
              </div>
            );
          }
          return part;
        });
        
        parts.push(<>{combinedInlineContent}</>);
      } else {
        parts.push(
          <div key={key++}>
            <ReactMarkdown>{remainingContent}</ReactMarkdown>
          </div>
        );
      }
    }
    
    return <>{parts}</>;
  };

  return (
    <div className={cn(
      "flex gap-3 py-4 -mx-2 px-2 rounded-lg animate-fade-in",
      role === "assistant" ? "bg-muted/30" : ""
    )}>
      <Avatar className={cn(
        "h-8 w-8 rounded-md",
        role === "assistant" ? "bg-primary/20" : "bg-secondary"
      )}>
        {role === "assistant" ? (
          <BrainIcon className="h-4 w-4 text-primary" />
        ) : (
          <UserIcon className="h-4 w-4" />
        )}
      </Avatar>
      <div className="chat-message flex-1 overflow-hidden">
        {processContent()}
      </div>
    </div>
  );
}
