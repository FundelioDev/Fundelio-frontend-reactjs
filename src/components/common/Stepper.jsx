export default function Stepper({ value, onChange, min = 0, max = 100, step = 1 }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(min, value - step))}
        className="px-3 py-2 border border-border rounded-sm hover:bg-muted transition-colors"
      >
        −
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number.parseInt(e.target.value) || min)}
        className="w-16 text-center border border-border rounded-sm px-2 py-2 bg-background text-foreground"
        min={min}
        max={max}
      />
      <button
        onClick={() => onChange(Math.min(max, value + step))}
        className="px-3 py-2 border border-border rounded-sm hover:bg-muted transition-colors"
      >
        +
      </button>
    </div>
  )
}
