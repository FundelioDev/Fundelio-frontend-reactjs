export default function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full px-3 py-2 border border-border rounded-sm bg-white dark:bg-darker-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none ${className}`}
      {...props}
    />
  )
}
