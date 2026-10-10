import React, { useRef, useEffect, useState, type MouseEvent } from 'react';

interface RichTextEditorProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  isInvalid?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Escriba el texto aquí...',
  className = '',
  isInvalid = false,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeStates, setActiveStates] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  // Inicializa o actualiza el contenido cuando cambia el valor externo (por ejemplo, al cargar datos)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const updateActiveStates = () => {
    try {
      setActiveStates({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
      });
    } catch {
      // Ignorar errores de selección
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      let content = editorRef.current.innerHTML;
      // Si está vacío o solo contiene etiquetas vacías, retornar string vacío
      if (content === '<br>' || content === '<p><br></p>') {
        content = '';
      }
      onChange(content);
      updateActiveStates();
    }
  };

  const executeCommand = (e: MouseEvent<HTMLButtonElement>, command: string, value: string | undefined = undefined) => {
    e.preventDefault();
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      handleInput();
    }
  };

  const handleInsertParagraph = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertParagraph', false);
      handleInput();
    }
  };

  return (
    <div className={`rich-text-editor-container ${isInvalid ? 'is-invalid' : ''} ${className}`}>
      <div className="rich-text-toolbar" onMouseDown={(e) => e.preventDefault()}>
        <button
          type="button"
          className={`btn-toolbar-item ${activeStates.bold ? 'active' : ''}`}
          onClick={(e) => executeCommand(e, 'bold')}
          title="Negrita (Bold)"
        >
          <strong>B</strong>
        </button>

        <button
          type="button"
          className={`btn-toolbar-item ${activeStates.italic ? 'active' : ''}`}
          onClick={(e) => executeCommand(e, 'italic')}
          title="Cursiva (Italic)"
        >
          <em>I</em>
        </button>

        <button
          type="button"
          className={`btn-toolbar-item ${activeStates.underline ? 'active' : ''}`}
          onClick={(e) => executeCommand(e, 'underline')}
          title="Subrayado (Underline)"
        >
          <u>U</u>
        </button>

        <div className="toolbar-divider" />

        <button
          type="button"
          className="btn-toolbar-item"
          onClick={handleInsertParagraph}
          title="Punto Aparte (Nuevo Párrafo)"
        >
          ↵ Párrafo
        </button>

        <button
          type="button"
          className="btn-toolbar-item text-danger border-0 ms-auto"
          onClick={(e) => executeCommand(e, 'removeFormat')}
          title="Limpiar Formato"
        >
          ✕ Limpiar
        </button>
      </div>

      <div
        ref={editorRef}
        className="rich-text-input-area"
        contentEditable
        onInput={handleInput}
        onKeyUp={updateActiveStates}
        onMouseUp={updateActiveStates}
        onSelect={updateActiveStates}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  );
};

export default RichTextEditor;
