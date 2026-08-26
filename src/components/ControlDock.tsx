import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactElement } from 'react'
import type {
  ExportFormat,
  ExportSize,
  StyleParams,
  WallpaperSettings,
  WallpaperStyle,
} from '../config/app'
import { EffectsPanel } from './panels/EffectsPanel'
import { ExportPanel } from './panels/ExportPanel'
import { PalettePanel } from './panels/PalettePanel'
import { StylePanel } from './panels/StylePanel'

type DockTab = 'palette' | 'style' | 'effects' | 'export'

interface ControlDockProps {
  colors: string[]
  onColorChange: (index: number, color: string) => void
  onRandomizePalette: () => void
  style: WallpaperStyle
  onStyleChange: (style: WallpaperStyle) => void
  styleParams: StyleParams
  onStyleParamsChange: (params: Partial<StyleParams>) => void
  settings: WallpaperSettings
  onSettingsChange: (partial: Partial<WallpaperSettings>) => void
  octaves: number
  onOctavesChange: (octaves: number) => void
  onRepaint: () => void
  overlayText: string
  onOverlayTextChange: (text: string) => void
  overlayPosition: 'center' | 'bottom'
  onOverlayPositionChange: (position: 'center' | 'bottom') => void
  exportFormat: ExportFormat
  onExportFormatChange: (format: ExportFormat) => void
  exportSize: ExportSize
  onExportSizeChange: (size: ExportSize) => void
  exportQuality: number
  onExportQualityChange: (quality: number) => void
  onDownload: () => void
  onVerify: () => void
  isExporting: boolean
}

const TABS: { id: DockTab; label: string; icon: ReactElement }[] = [
  {
    id: 'palette',
    label: 'Palette',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 21a9 9 0 1 1 9-9c0 2.5-2 3.5-4 3.5h-2a2.5 2.5 0 0 0-2.5 2.5c0 .6.2 1.2.5 1.7.4.7.1 1.3-.7 1.3Z" />
        <circle cx="7.5" cy="11.5" r="1" fill="currentColor" />
        <circle cx="10.5" cy="7.5" r="1" fill="currentColor" />
        <circle cx="15" cy="7.5" r="1" fill="currentColor" />
        <circle cx="18" cy="11.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'style',
    label: 'Style',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 5c3-2 15-2 18 0M3 12c3-2 15-2 18 0M3 19c3-2 15-2 18 0" />
      </svg>
    ),
  },
  {
    id: 'effects',
    label: 'Effects',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 6h16M4 12h16M4 18h16" />
        <circle cx="9" cy="6" r="2" fill="currentColor" stroke="none" />
        <circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" />
        <circle cx="7" cy="18" r="2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: 'export',
    label: 'Export',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
      </svg>
    ),
  },
]

const TAB_ORDER: DockTab[] = TABS.map((tab) => tab.id)

export const ControlDock = ({
  colors,
  onColorChange,
  onRandomizePalette,
  style,
  onStyleChange,
  styleParams,
  onStyleParamsChange,
  settings,
  onSettingsChange,
  octaves,
  onOctavesChange,
  onRepaint,
  overlayText,
  onOverlayTextChange,
  overlayPosition,
  onOverlayPositionChange,
  exportFormat,
  onExportFormatChange,
  exportSize,
  onExportSizeChange,
  exportQuality,
  onExportQualityChange,
  onDownload,
  onVerify,
  isExporting,
}: ControlDockProps) => {
  const [activeTab, setActiveTab] = useState<DockTab | null>('style')
  const [isClosing, setIsClosing] = useState(false)
  const tabRefs = useRef<Record<DockTab, HTMLButtonElement | null>>({
    palette: null,
    style: null,
    effects: null,
    export: null,
  })
  const closeTimerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current)
      }
    }
  }, [])

  const closePanel = useCallback(() => {
    if (activeTab === null) {
      return
    }

    setIsClosing(true)
    closeTimerRef.current = window.setTimeout(() => {
      setActiveTab(null)
      setIsClosing(false)
      closeTimerRef.current = null
    }, 260)
  }, [activeTab])

  const openPanel = useCallback((tab: DockTab) => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    setIsClosing(false)
    setActiveTab(tab)
  }, [])

  const togglePanel = useCallback((tab: DockTab) => {
    setActiveTab((current) => {
      if (current === tab) {
        setIsClosing(true)
        closeTimerRef.current = window.setTimeout(() => {
          setActiveTab(null)
          setIsClosing(false)
          closeTimerRef.current = null
        }, 260)
        return current
      }

      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current)
        closeTimerRef.current = null
      }

      setIsClosing(false)
      return tab
    })
  }, [])

  const focusTab = useCallback((tab: DockTab) => {
    tabRefs.current[tab]?.focus()
  }, [])

  const handleTabKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      const current = activeTab ?? 'style'
      const index = TAB_ORDER.indexOf(current)
      let next: DockTab | null = null

      if (event.key === 'ArrowRight') {
        next = TAB_ORDER[(index + 1) % TAB_ORDER.length]
      } else if (event.key === 'ArrowLeft') {
        next = TAB_ORDER[(index - 1 + TAB_ORDER.length) % TAB_ORDER.length]
      } else if (event.key === 'Home') {
        next = TAB_ORDER[0]
      } else if (event.key === 'End') {
        next = TAB_ORDER[TAB_ORDER.length - 1]
      } else if (event.key === 'Escape') {
        closePanel()
        return
      }

      if (next) {
        event.preventDefault()
        openPanel(next)
        focusTab(next)
      }
    },
    [activeTab, closePanel, focusTab, openPanel],
  )

  const dock = (
    <div className="dock" role="tablist" aria-label="Wallpaper controls" aria-orientation="horizontal">
      {TABS.map((tab) => {
        const selected = activeTab === tab.id

        return (
          <button
            key={tab.id}
            ref={(element) => {
              tabRefs.current[tab.id] = element
            }}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`dock-panel-${tab.id}`}
            id={`dock-tab-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            className="dock__tab"
            title={tab.label}
            onClick={() => togglePanel(tab.id)}
            onKeyDown={handleTabKeyDown}
          >
            {tab.icon}
            <span className="dock__label">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )

  return (
    <div className={`dock-root${isExporting ? ' dock-root--hidden' : ''}`} aria-hidden={isExporting}>
      {activeTab && (
        <section
          id={`dock-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`dock-tab-${activeTab}`}
          className={`dock__panel${isClosing ? ' dock__panel--closing' : ''}`}
        >
          {activeTab === 'palette' && (
            <PalettePanel colors={colors} onChangeColor={onColorChange} onRandomizePalette={onRandomizePalette} />
          )}
          {activeTab === 'style' && (
            <StylePanel
              style={style}
              onStyleChange={onStyleChange}
              styleParams={styleParams}
              onStyleParamsChange={onStyleParamsChange}
              octaves={octaves}
              onOctavesChange={onOctavesChange}
              onRepaint={onRepaint}
            />
          )}
          {activeTab === 'effects' && (
            <EffectsPanel settings={settings} onChange={onSettingsChange} style={style} />
          )}
          {activeTab === 'export' && (
            <ExportPanel
              format={exportFormat}
              onFormatChange={onExportFormatChange}
              size={exportSize}
              onSizeChange={onExportSizeChange}
              quality={exportQuality}
              onQualityChange={onExportQualityChange}
              overlayText={overlayText}
              onOverlayTextChange={onOverlayTextChange}
              overlayPosition={overlayPosition}
              onOverlayPositionChange={onOverlayPositionChange}
              onDownload={onDownload}
              onVerify={onVerify}
              isExporting={isExporting}
            />
          )}
        </section>
      )}
      {dock}
    </div>
  )
}
