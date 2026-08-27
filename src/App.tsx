import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import * as THREE from 'three'
import './App.css'
import { CanvasScene } from './components/CanvasScene'
import { ControlDock } from './components/ControlDock'
import { OverlayPreview } from './components/OverlayPreview'
import { StatusBanner } from './components/StatusBanner'
import {
  DEFAULT_PALETTE,
  DEFAULT_SETTINGS,
  getDefaultStyleParams,
  type ExportFormat,
  type ExportSize,
  type StyleParams,
  type WallpaperSettings,
  type WallpaperStyle,
} from './config/app'
import { useAnimatedTransition } from './hooks/useAnimatedTransition'
import { useSignatureVerification, type VerificationStatus } from './hooks/useSignatureVerification'
import { useWallpaperExport } from './hooks/useWallpaperExport'
import { useLatestRef } from './hooks/useLatestRef'
import type { ExportRenderer, ExportPostSettings } from './three/exportRenderer'
import { createSceneState } from './three/sceneState'

const hslToHex = (hue: number, saturation: number, lightness: number) => {
  const s = saturation / 100
  const l = lightness / 100
  const k = (n: number) => (n + hue / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const toChannel = (n: number) =>
    Math.round((l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))) * 255)
      .toString(16)
      .padStart(2, '0')

  return `#${toChannel(0)}${toChannel(8)}${toChannel(4)}`
}

const randomPalette = () =>
  Array.from({ length: 16 }, () => hslToHex(Math.random() * 360, 45 + Math.random() * 30, 40 + Math.random() * 25))

function App() {
  const [style, setStyle] = useState<WallpaperStyle>('liquid')
  const [colors, setColors] = useState<string[]>([...DEFAULT_PALETTE])
  const [seed, setSeed] = useState(() => Math.random())
  const [settings, setSettings] = useState<WallpaperSettings>(DEFAULT_SETTINGS)
  const [styleParams, setStyleParams] = useState<StyleParams>(() => getDefaultStyleParams('liquid'))
  const [overlayText, setOverlayText] = useState('')
  const [overlayPosition, setOverlayPosition] = useState<'center' | 'bottom'>('center')
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png')
  const [exportSize, setExportSize] = useState<ExportSize>('4k')
  const [exportQuality, setExportQuality] = useState(0.92)
  const [status, setStatus] = useState<VerificationStatus>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [signaturePickerRequest, setSignaturePickerRequest] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const exportRendererRef = useRef<ExportRenderer | null>(null)

  const sceneStateRef = useRef(createSceneState())

  const { animateTransition, transitionProgress } = useAnimatedTransition(() => {
    setSeed(Math.random())
  })

  const { verifyFile } = useSignatureVerification({
    onStatusChange: setStatus,
  })

  const flowVector = useMemo(
    () =>
      new THREE.Vector2(
        Math.cos((settings.flowAngle * Math.PI) / 180) * settings.flowIntensity,
        Math.sin((settings.flowAngle * Math.PI) / 180) * settings.flowIntensity,
      ),
    [settings.flowAngle, settings.flowIntensity],
  )

  useEffect(() => {
    const scene = sceneStateRef.current
    scene.colors = colors
    scene.seed = seed
    scene.grain = settings.grain
    scene.speed = settings.speed
    scene.transition = transitionProgress
    scene.pixelation = settings.pixelation
    scene.distortion = settings.distortion
    scene.relief = settings.relief
    scene.flow.copy(flowVector)
    scene.styleParams = styleParams
    scene.octaves = settings.octaves
  }, [colors, seed, settings, styleParams, transitionProgress, flowVector])

  useEffect(() => {
    const renderer = exportRendererRef.current

    return () => {
      renderer?.dispose()
    }
  }, [])

  const styleRef = useLatestRef(style)
  const formatRef = useLatestRef(exportFormat)
  const sizeRef = useLatestRef(exportSize)
  const qualityRef = useLatestRef(exportQuality)
  const overlayTextRef = useLatestRef(overlayText)
  const overlayPositionRef = useLatestRef(overlayPosition)
  const postRef = useLatestRef<ExportPostSettings>({
    bloomStrength: settings.bloomStrength,
    bloomThreshold: settings.bloomThreshold,
    aberration: settings.aberration,
    vignette: settings.vignette,
    saturation: settings.saturation,
    brightness: settings.brightness,
  })

  const { exportWallpaper, isExporting: exportInProgress } = useWallpaperExport({
    sceneStateRef,
    styleRef,
    formatRef,
    sizeRef,
    qualityRef,
    overlayTextRef,
    overlayPositionRef,
    postRef,
    onStatusChange: setStatus,
  })

  useEffect(() => {
    setIsExporting(exportInProgress)
  }, [exportInProgress])

  useEffect(() => {
    if (signaturePickerRequest === 0) {
      return
    }

    fileInputRef.current?.click()
  }, [signaturePickerRequest])

  useEffect(() => {
    if (!status) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setStatus(null)
    }, 5000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [status])

  const handleStyleChange = useCallback((nextStyle: WallpaperStyle) => {
    setStyle(nextStyle)
    setStyleParams(getDefaultStyleParams(nextStyle))
  }, [])

  const handleSettingsChange = useCallback((partial: Partial<WallpaperSettings>) => {
    setSettings((previous) => ({ ...previous, ...partial }))
  }, [])

  const handleColorChange = useCallback((index: number, color: string) => {
    setColors((previous) => previous.map((candidate, candidateIndex) => (candidateIndex === index ? color : candidate)))
  }, [])

  const handleFileSelection = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    await verifyFile(file)
    event.target.value = ''
  }, [verifyFile])

  return (
    <div className="app-container">
      <input
        ref={fileInputRef}
        className="sr-only"
        type="file"
        accept="image/png"
        onChange={(event) => {
          void handleFileSelection(event)
        }}
      />

      <StatusBanner status={status} onDismiss={() => setStatus(null)} />

      <div className="canvas-wrapper">
        <CanvasScene
          stateRef={sceneStateRef}
          style={style}
          dpr={settings.quality}
          bloomStrength={settings.bloomStrength}
          bloomThreshold={settings.bloomThreshold}
          aberration={settings.aberration}
          vignette={settings.vignette}
          saturation={settings.saturation}
          brightness={settings.brightness}
        />

        <OverlayPreview text={overlayText} position={overlayPosition} />
      </div>

      <ControlDock
        colors={colors}
        onColorChange={handleColorChange}
        onRandomizePalette={() => setColors(randomPalette())}
        style={style}
        onStyleChange={handleStyleChange}
        styleParams={styleParams}
        onStyleParamsChange={(partial) => setStyleParams((previous) => ({ ...previous, ...partial }))}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        octaves={settings.octaves}
        onOctavesChange={(octaves) => handleSettingsChange({ octaves })}
        onRepaint={() => animateTransition()}
        overlayText={overlayText}
        onOverlayTextChange={setOverlayText}
        overlayPosition={overlayPosition}
        onOverlayPositionChange={setOverlayPosition}
        exportFormat={exportFormat}
        onExportFormatChange={setExportFormat}
        exportSize={exportSize}
        onExportSizeChange={setExportSize}
        exportQuality={exportQuality}
        onExportQualityChange={setExportQuality}
        onDownload={() => {
          void exportWallpaper()
        }}
        onVerify={() => setSignaturePickerRequest((value) => value + 1)}
        isExporting={isExporting}
      />

      <div className="overlay" style={{ opacity: isExporting ? 0 : 1 }}>
        <h1>X Web Wallpaper</h1>
        <a href="https://github.com/xscriptor-colors/xww" target="_blank" rel="noopener noreferrer" title="View Source">
          <svg height="20" width="20" viewBox="0 0 16 16" fill="white">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </a>
      </div>
    </div>
  )
}

export default App
