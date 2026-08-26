interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  format?: (value: number) => string
}

export const Slider = ({ label, value, min, max, step, onChange, format }: SliderProps) => (
  <label className="slider">
    <span className="slider__head">
      <span className="slider__label">{label}</span>
      <span className="slider__value">{format ? format(value) : value}</span>
    </span>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  </label>
)
