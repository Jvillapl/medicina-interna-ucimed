export function Badge({ className = "", variant = "secondary", children, ...props }) {
  const variantClasses = {
    secondary: "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200/50 shadow-sm",
    default: "bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-md",
    success: "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200/50 shadow-sm",
    warning: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200/50 shadow-sm",
    danger: "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200/50 shadow-sm"
  }[variant] || "";
  
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 hover:scale-105 hover:shadow-md ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
