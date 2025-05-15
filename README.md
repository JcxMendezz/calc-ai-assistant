# 📘 Cálculo Integral - Tutor IA

Un tutor interactivo especializado en cálculo integral que ofrece soluciones paso a paso, explicaciones detalladas y ejercicios prácticos.

---

## 📚 Características Principales

- **Resolución de Integrales:** Soluciones paso a paso con explicaciones detalladas.  
- **Identificación de Tipos:** Reconoce automáticamente el tipo de integral a resolver.  
- **Visualización Matemática:** Renderizado LaTeX para fórmulas matemáticas.  
- **Ejercicios Prácticos:** Generación de ejercicios personalizados.  
- **Interfaz Conversacional:** Interactúa naturalmente en español.  
- **Enfoque Tutorial:** Explicaciones pedagógicas adaptadas al nivel del estudiante.  

---

## 🛠️ Tecnologías

- **Frontend:** React + TypeScript  
- **Estilizado:** Tailwind CSS + shadcn/ui  
- **Renderizado Matemático:** KaTeX + react-katex  
- **Markdown:** ReactMarkdown  
- **Empaquetado:** Vite  
- **IA:** Integración con DeepSeek API  

---

## 📂 Estructura del Proyecto

calc-ai-assistant/
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatInterface.tsx    # Componente principal de la interfaz
│   │   │   ├── ChatMessage.tsx      # Renderizado de mensajes con LaTeX
│   │   │   └── data.ts              # Ejercicios de práctica y ejemplos
│   │   └── ui/                      # Componentes de UI reutilizables
│   ├── hooks/
│   │   └── use-mobile.tsx           # Hook para detectar dispositivos móviles
│   ├── lib/
│   │   └── utils.ts                 # Utilidades comunes
│   └── App.tsx                      # Punto de entrada de la aplicación
└── public/
    └── assets/                      # Imágenes y recursos estáticos

---

## 🚀 Cómo Usar

- **Preguntar sobre integrales:** Escribe una integral en formato LaTeX (ej: `∫ x^2 dx`).  
- **Generar ejercicios:** Usa el botón "Generar Ejercicio" para practicar.  
- **Explicaciones conceptuales:** Pregunta sobre teoremas y conceptos del cálculo integral.  
- **Verificar soluciones:** Envía tus soluciones para recibir retroalimentación.  

---

## ⚙️ Configuración y Ejecución Local

### Clonar el repositorio

git clone <https://github.com/TuUsuario/calc-ai-assistant.git>

### Navegar al directorio

cd calc-ai-assistant

### Instalar dependencias

npm install

### Iniciar servidor de desarrollo

npm run dev

---

## 📝 Notas para Desarrolladores

- La clase `ChatInterface` maneja la lógica principal de la aplicación.  
- El renderizado de LaTeX se realiza en `ChatMessage` mediante expresiones regulares.  
- Las respuestas se generan mediante la API de DeepSeek o a través de respuestas simuladas.  
- Los ejercicios de práctica están definidos en `data.ts`.  

---

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Consulta el archivo `LICENSE` para más detalles.

---

## 👥 Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar este proyecto, por favor crea un *pull request* o abre un *issue* para discutir tus ideas.

---

**Desarrollado con ❤️ para ayudar a estudiantes de cálculo integral.**
