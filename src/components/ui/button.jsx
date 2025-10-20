export function Button({ className = "", variant = "default", size = "md", children, ...props }) {
  const variantClasses = {
    default: "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300",
    ghost: "bg-transparent border border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300",
    outline: "border border-blue-300 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-400 shadow-sm hover:shadow-md transition-all duration-300",
    secondary: "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
  }[variant] || "";

  const sizeClasses = {
    sm: "text-sm px-4 py-2 font-medium",
    md: "text-sm px-6 py-2.5 font-semibold",
    lg: "text-base px-8 py-3 font-semibold",
  }[size] || "";

  return (
    <button
      className={`rounded-full transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-blue-300/50 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
