interface PalettePanelProps {
  colors: string[]
  onChangeColor: (index: number, color: string) => void
  onRandomizePalette: () => void
}

export const PalettePanel = ({ colors, onChangeColor, onRandomizePalette }: PalettePanelProps) => (
  <div className="palette-panel">
    <div className="panel-heading">
      <span className="panel-title">Color palette</span>
      <button type="button" className="panel-action" onClick={onRandomizePalette}>
        Randomize
      </button>
    </div>
    <div className="palette-grid" role="group" aria-label="Palette colors">
      {colors.map((color, index) => (
        <label key={index} className="swatch" title={`Color ${index}`}>
          <span className="sr-only">Color {index}</span>
          <input
            type="color"
            value={color}
            onChange={(event) => onChangeColor(index, event.target.value)}
          />
        </label>
      ))}
    </div>
  </div>
)
