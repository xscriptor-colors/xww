interface SegmentedOption<T extends string> {
  value: T
  label: string
}

interface SegmentedProps<T extends string> {
  label?: string
  value: T
  options: SegmentedOption<T>[]
  onChange: (value: T) => void
}

export const Segmented = <T extends string>({ label, value, options, onChange }: SegmentedProps<T>) => (
  <div className="segmented-wrap">
    {label && <span className="control-label">{label}</span>}
    <div className="segmented" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
)
