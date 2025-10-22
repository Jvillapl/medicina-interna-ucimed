import { useState, Children, cloneElement, useEffect, useRef } from "react";

export function Select({ value, onValueChange, children, className = "" }) {
  const [open, setOpen] = useState(false);
  const selectRef = useRef(null);
  
  // Cerrar dropdown cuando se hace clic afuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open]);

  // Buscar SelectTrigger y SelectContent
  const trigger = Children.toArray(children).find(child => child.type === SelectTrigger);
  const content = Children.toArray(children).find(child => child.type === SelectContent);
  
  return (
    <div ref={selectRef} className={`relative ${className}`}>
      {/* Render trigger siempre */}
      {trigger ? cloneElement(trigger, { value, onValueChange, open, setOpen }) : null}
      
      {/* Render content solo cuando open es true */}
      {open && content && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-sm shadow-xl">
          {cloneElement(content, {
            onSelect: (v) => {
              onValueChange?.(v);
              setOpen(false);
            }
          })}
        </div>
      )}
    </div>
  );
}

export function SelectTrigger({ className = "", value, onValueChange, open = false, setOpen, children }) {
  
  // Encontrar el label del valor seleccionado
  const getSelectedLabel = () => {
    const selectValueChild = Children.toArray(children).find(child => child.type === SelectValue);
    if (selectValueChild && value) {
      return value;
    }
    return selectValueChild?.props?.placeholder || "Seleccionar...";
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen?.(!open);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-full flex items-center justify-between rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm px-4 py-3 text-left text-sm shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300/30 focus:border-blue-400 ${className}`}
    >
      <span className="text-slate-700">{getSelectedLabel()}</span>
      <span className={`ml-2 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
    </button>
  );
}

export function SelectContent({ children, onSelect }) {
  return (
    <div className="max-h-60 overflow-auto py-2">
      {Children.map(children, child =>
        child ? cloneElement(child, { onSelect }) : child
      )}
    </div>
  );
}

export function SelectItem({ value, children, onSelect }) {
  return (
    <div
      className="cursor-pointer px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors duration-200 text-slate-700"
      onClick={() => onSelect?.(value)}
    >
      {children}
    </div>
  );
}

export function SelectValue({ placeholder }) {
  return <span className="text-slate-400">{placeholder}</span>;
}
