import { useState, Children, cloneElement } from "react";

export function Select({ value, onValueChange, children, className = "" }) {
  return (
    <div className={`inline-block ${className}`}>
      {Children.map(children, child => 
        child ? cloneElement(child, { value, onValueChange }) : child
      )}
    </div>
  );
}

export function SelectTrigger({ className = "", value, onValueChange, children }) {
  const [open, setOpen] = useState(false);
  
  // Encontrar el label del valor seleccionado
  const getSelectedLabel = () => {
    const selectValueChild = Children.toArray(children).find(child => child.type === SelectValue);
    if (selectValueChild && value) {
      return value;
    }
    return selectValueChild?.props?.placeholder || "Seleccionar...";
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full min-w-[180px] flex items-center justify-between rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm px-4 py-3 text-left text-sm shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300/30 focus:border-blue-400"
      >
        <span className="text-slate-700">{getSelectedLabel()}</span>
        <span className={`ml-2 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-sm shadow-xl">
            {Children.map(children, child => {
              if (child?.type === SelectContent) {
                return cloneElement(child, {
                  onSelect: (v) => {
                    onValueChange?.(v);
                    setOpen(false);
                  }
                });
              }
              return null;
            })}
          </div>
        </>
      )}
    </div>
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
