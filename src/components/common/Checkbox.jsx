export default function Checkbox({ checked, onChange, label, ...props }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-border cursor-pointer"
        {...props}
      />
      {label && <span className="text-foreground">{label}</span>}
    </label>
  )
}