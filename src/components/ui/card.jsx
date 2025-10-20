export function Card({ className = "", ...props }) {
  return (
    <div 
      className={`card-enhanced rounded-3xl border border-white/20 bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-2 group ${className}`} 
      {...props} 
    />
  );
}

export function CardHeader({ className = "", ...props }) {
  return (
    <div 
      className={`p-6 border-b border-slate-100/60 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 rounded-t-3xl ${className}`} 
      {...props} 
    />
  );
}

export function CardTitle({ className = "", ...props }) {
  return (
    <h3 
      className={`text-xl font-bold leading-tight text-slate-800 group-hover:text-blue-700 transition-colors duration-300 ${className}`} 
      {...props} 
    />
  );
}

export function CardContent({ className = "", ...props }) {
  return (
    <div 
      className={`p-6 ${className}`} 
      {...props} 
    />
  );
}
