import {
  EXPORT_FORMATS,
  EXPORT_FORMAT_LABELS,
  EXPORT_SIZES,
  EXPORT_SIZE_LABELS,
  type ExportFormat,
  type ExportSize,
} from '../../config/app'
import { Segmented } from '../controls/Segmented'
import { Slider } from '../controls/Slider'

interface ExportPanelProps {
  format: ExportFormat
  onFormatChange: (format: ExportFormat) => void
  size: ExportSize
  onSizeChange: (size: ExportSize) => void
  quality: number
  onQualityChange: (quality: number) => void
  overlayText: string
  onOverlayTextChange: (text: string) => void
  overlayPosition: 'center' | 'bottom'
  onOverlayPositionChange: (position: 'center' | 'bottom') => void
  onDownload: () => void
  onVerify: () => void
  isExporting: boolean
}

export const ExportPanel = ({
  format,
  onFormatChange,
  size,
  onSizeChange,
  quality,
  onQualityChange,
  overlayText,
  onOverlayTextChange,
  overlayPosition,
  onOverlayPositionChange,
  onDownload,
  onVerify,
  isExporting,
}: ExportPanelProps) => (
  <div className="panel-grid">
    <section className="panel-section">
      <span className="panel-title">Export</span>
      <div className="export-row">
        <Segmented
          label="Format"
          value={format}
          options={EXPORT_FORMATS.map((candidate) => ({
            value: candidate,
            label: EXPORT_FORMAT_LABELS[candidate],
          }))}
          onChange={onFormatChange}
        />
        <Segmented
          label="Size"
          value={size}
          options={EXPORT_SIZES.map((candidate) => ({
            value: candidate,
            label: EXPORT_SIZE_LABELS[candidate],
          }))}
          onChange={onSizeChange}
        />
      </div>
      {format !== 'png' && (
        <Slider
          label="Quality"
          value={quality}
          min={0.5}
          max={1}
          step={0.01}
          onChange={onQualityChange}
          format={(value) => `${Math.round(value * 100)}%`}
        />
      )}
      <p className="panel-hint">
        {format === 'png'
          ? 'PNG embeds a verifiable X Web Wallpaper signature (LSB steganography).'
          : 'JPG and WebP do not embed the X Web Wallpaper signature.'}
      </p>
    </section>

    <section className="panel-section">
      <span className="panel-title">Text overlay</span>
      <input
        className="text-input"
        type="text"
        value={overlayText}
        onChange={(event) => onOverlayTextChange(event.target.value)}
        placeholder="Text shown on the wallpaper"
      />
      <Segmented
        label="Position"
        value={overlayPosition}
        options={[
          { value: 'center', label: 'Center' },
          { value: 'bottom', label: 'Bottom' },
        ]}
        onChange={onOverlayPositionChange}
      />
    </section>

    <section className="panel-section panel-section--actions">
      <button
        type="button"
        className="button button--primary button--large"
        onClick={onDownload}
        disabled={isExporting}
      >
        {isExporting ? 'Rendering...' : `Download ${EXPORT_SIZE_LABELS[size]}`}
      </button>
      <button type="button" className="button" onClick={onVerify} disabled={isExporting}>
        Verify signature
      </button>
    </section>
  </div>
)
