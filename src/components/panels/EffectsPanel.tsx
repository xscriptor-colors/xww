import type { WallpaperSettings, WallpaperStyle } from '../../config/app'
import { Slider } from '../controls/Slider'

interface EffectsPanelProps {
  settings: WallpaperSettings
  onChange: (partial: Partial<WallpaperSettings>) => void
  style: WallpaperStyle
}

export const EffectsPanel = ({ settings, onChange, style }: EffectsPanelProps) => (
  <div className="panel-grid">
    {style === 'liquid' && (
      <section className="panel-section">
        <span className="panel-title">Liquid</span>
        <Slider
          label="Pixelation"
          value={settings.pixelation}
          min={0}
          max={1}
          step={0.01}
          onChange={(value) => onChange({ pixelation: value })}
          format={(value) => value.toFixed(2)}
        />
        <Slider
          label="Distortion"
          value={settings.distortion}
          min={0}
          max={2}
          step={0.01}
          onChange={(value) => onChange({ distortion: value })}
          format={(value) => value.toFixed(2)}
        />
        <Slider
          label="Relief"
          value={settings.relief}
          min={0}
          max={2}
          step={0.01}
          onChange={(value) => onChange({ relief: value })}
          format={(value) => value.toFixed(2)}
        />
        <Slider
          label="Flow direction"
          value={settings.flowAngle}
          min={0}
          max={360}
          step={1}
          onChange={(value) => onChange({ flowAngle: value })}
          format={(value) => `${value}°`}
        />
        <Slider
          label="Flow strength"
          value={settings.flowIntensity}
          min={0}
          max={2}
          step={0.05}
          onChange={(value) => onChange({ flowIntensity: value })}
          format={(value) => value.toFixed(2)}
        />
      </section>
    )}

    <section className="panel-section">
      <span className="panel-title">Render</span>
      <Slider
        label="Texture"
        value={settings.grain}
        min={0}
        max={0.3}
        step={0.01}
        onChange={(value) => onChange({ grain: value })}
        format={(value) => value.toFixed(2)}
      />
      <Slider
        label="Speed"
        value={settings.speed}
        min={0}
        max={3}
        step={0.05}
        onChange={(value) => onChange({ speed: value })}
        format={(value) => value.toFixed(2)}
      />
      <Slider
        label="Quality"
        value={settings.quality}
        min={0.5}
        max={2}
        step={0.1}
        onChange={(value) => onChange({ quality: value })}
        format={(value) => `${value.toFixed(1)}x`}
      />
    </section>

    <section className="panel-section">
      <span className="panel-title">Post-processing</span>
      <Slider
        label="Bloom"
        value={settings.bloomStrength}
        min={0}
        max={3}
        step={0.05}
        onChange={(value) => onChange({ bloomStrength: value })}
        format={(value) => value.toFixed(2)}
      />
      <Slider
        label="Bloom threshold"
        value={settings.bloomThreshold}
        min={0}
        max={1}
        step={0.01}
        onChange={(value) => onChange({ bloomThreshold: value })}
        format={(value) => value.toFixed(2)}
      />
      <Slider
        label="Chromatic aberration"
        value={settings.aberration}
        min={0}
        max={0.05}
        step={0.001}
        onChange={(value) => onChange({ aberration: value })}
        format={(value) => value.toFixed(3)}
      />
      <Slider
        label="Vignette"
        value={settings.vignette}
        min={0}
        max={0.8}
        step={0.01}
        onChange={(value) => onChange({ vignette: value })}
        format={(value) => value.toFixed(2)}
      />
      <Slider
        label="Saturation"
        value={settings.saturation}
        min={-1}
        max={1}
        step={0.05}
        onChange={(value) => onChange({ saturation: value })}
        format={(value) => value.toFixed(2)}
      />
      <Slider
        label="Brightness"
        value={settings.brightness}
        min={-0.5}
        max={0.5}
        step={0.01}
        onChange={(value) => onChange({ brightness: value })}
        format={(value) => value.toFixed(2)}
      />
    </section>
  </div>
)
