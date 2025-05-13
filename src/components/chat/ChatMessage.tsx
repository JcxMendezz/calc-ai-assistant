
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
const dollarRegex = /\$\$(.*?)\$\$/g;
const inlineLatexRegex = /\$(.*?)\$/g;

export default function ChatMessage({ message }: ChatMessageProps) {
  const { content, role } = message;
  
  // Procesa el contenido para renderizar LaTeX y Markdown
  const processContent = () => {
    let processedContent = content;
    
    // Primero extraemos los bloques de LaTeX y los reemplazamos con placeholders
    const latexBlocks: string[] = [];
    processedContent = processedContent.replace(dollarRegex, (match, latex) => {
      latexBlocks.push(latex);
      return `$$LATEX_BLOCK_${latexBlocks.length - 1}$$`;
    });
    
    // Luego extraemos LaTeX inline
    const inlineLatex: string[] = [];
    processedContent = processedContent.replace(inlineLatexRegex, (match, latex) => {
      inlineLatex.push(latex);
      return `$INLINE_LATEX_${inlineLatex.length - 1}$`;
    });
    
    // Renderizamos el markdown con componentes personalizados para manejar nuestros placeholders
    return (
      <ReactMarkdown
        components={{
          p: ({ node, children, ...props }) => {
            const content = children?.toString() || "";
            
            // Si contiene un placeholder de LaTeX block
            if (typeof content === 'string' && content.includes('$$LATEX_BLOCK_')) {
              const blockIndex = parseInt(content.match(/LATEX_BLOCK_(\d+)/)?.[1] || "0");
              return <div className="katex-container overflow-x-auto py-2"><BlockMath math={latexBlocks[blockIndex]} /></div>;
            }
            
            // Si contiene placeholders de LaTeX inline
            if (typeof content === 'string' && content.includes('$INLINE_LATEX_')) {
              // Dividimos el texto en partes, alternando entre texto plano y LaTeX inline
              const parts = content.split(/(\$INLINE_LATEX_\d+\$)/g);
              return (
                <p {...props}>
                  {parts.map((part, index) => {
                    if (part.startsWith('$INLINE_LATEX_')) {
                      const inlineIndex = parseInt(part.match(/INLINE_LATEX_(\d+)/)?.[1] || "0");
                      return <InlineMath key={index} math={inlineLatex[inlineIndex]} />;
                    }
                    return <span key={index}>{part}</span>;
                  })}
                </p>
              );
            }
            
            // Para párrafos normales
            return <p {...props}>{children}</p>;
          },
          // Configuración para otros elementos markdown
          code: ({ node, children, ...props }) => {
            if (props.inline) {
              return <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props}>{children}</code>;
            }
            return <pre className="p-3 rounded-md bg-muted overflow-x-auto"><code {...props}>{children}</code></pre>;
          },
          h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold mt-5 mb-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-bold mt-4 mb-2">{children}</h3>,
          ul: ({ children }) => <ul className="list-disc pl-6 my-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-6 my-2">{children}</ol>,
          li: ({ children }) => <li className="my-1">{children}</li>,
        }}
        className={cn(
          "prose prose-sm max-w-none",
          "prose-pre:bg-muted prose-pre:rounded-md",
          "prose-headings:font-semibold prose-headings:mb-2 prose-headings:mt-4",
          "prose-p:my-2 prose-li:my-0"
        )}
      >
        {processedContent}
      </ReactMarkdown>
    );
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
