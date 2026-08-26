import {
  STYLE_DETAILS,
  WALLPAPER_STYLES,
  type StyleParams,
  type WallpaperStyle,
} from '../../config/app'
import { Slider } from '../controls/Slider'

interface StylePanelProps {
  style: WallpaperStyle
  onStyleChange: (style: WallpaperStyle) => void
  styleParams: StyleParams
  onStyleParamsChange: (params: Partial<StyleParams>) => void
  octaves: number
  onOctavesChange: (octaves: number) => void
  onRepaint: () => void
}

export const StylePanel = ({
  style,
  onStyleChange,
  styleParams,
  onStyleParamsChange,
  octaves,
  onOctavesChange,
  onRepaint,
}: StylePanelProps) => {
  const details = STYLE_DETAILS[style]

  return (
    <div className="panel-grid">
      <section className="panel-section">
        <span className="panel-title">Style</span>
        <div className="style-picker" role="group" aria-label="Wallpaper style">
          {WALLPAPER_STYLES.map((candidate) => (
            <button
              key={candidate}
              type="button"
              aria-pressed={style === candidate}
              onClick={() => onStyleChange(candidate)}
            >
              {STYLE_DETAILS[candidate].label}
            </button>
          ))}
        </div>
      </section>

      {style !== 'liquid' && (
        <section className="panel-section">
          <span className="panel-title">{details.label} details</span>
          {details.params.map((param) => (
            <Slider
              key={param.key}
              label={param.label}
              value={styleParams[param.key]}
              min={param.min}
              max={param.max}
              step={param.step}
              onChange={(value) => onStyleParamsChange({ [param.key]: value })}
              format={(value) => value.toFixed(2)}
            />
          ))}
        </section>
      )}

      <section className="panel-section">
        <span className="panel-title">Pattern</span>
        <Slider
          label="Noise detail"
          value={octaves}
          min={2}
          max={6}
          step={1}
          onChange={onOctavesChange}
          format={(value) => `${value} octaves`}
        />
        <button type="button" className="button button--primary" onClick={onRepaint}>
          Repaint pattern
        </button>
      </section>
    </div>
  )
}
