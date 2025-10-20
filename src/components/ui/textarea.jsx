export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-300/30 focus:border-blue-400 transition-all duration-300 w-full min-h-[120px] bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-slate-700 placeholder:text-slate-400 resize-y ${className}`}
      {...props}
    />
  );
}
