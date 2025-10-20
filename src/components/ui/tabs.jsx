import { useState } from "react";

export function Tabs({ 
  defaultValue, 
  value: controlledValue, 
  onValueChange, 
  children, 
  className = "" 
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  
  const setValue = (newValue) => {
    if (isControlled && onValueChange) {
      onValueChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  return (
    <div className={className}>
      {Array.isArray(children)
        ? children.map((child, i) =>
            child && child.type
              ? <child.type key={i} value={value} setValue={setValue} {...child.props} />
              : child
          )
        : children}
    </div>
  );
}

export function TabsList({ children, className = "", value, setValue }) {
  return (
    <div className={`flex gap-1 ${className}`}>
      {Array.isArray(children)
        ? children.map((child, i) =>
            child && child.type
              ? <child.type key={i} value={value} setValue={setValue} {...child.props} />
              : child
          )
        : children}
    </div>
  );
}

export function TabsTrigger({ value: tabValue, children, value, setValue, className = "" }) {
  const active = value === tabValue;
  return (
    <button
      onClick={() => setValue(tabValue)}
      className={`px-4 py-2.5 text-sm transition-all duration-300 ${
        active 
          ? "bg-white shadow-md text-blue-700 font-semibold" 
          : "text-slate-600 hover:text-slate-800 hover:bg-white/50"
      } ${className}`}
    >
      {children}
    </button>
  );
}
