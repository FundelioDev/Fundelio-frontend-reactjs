export default function Input({ error, className = "", ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 border rounded-sm bg-white dark:bg-darker-2 text-text-secondary dark:text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
        error ? "border-destructive" : "border-border"
      } ${className}`}
      {...props}
    />
  )
}
