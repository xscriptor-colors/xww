import { Leva, useControls, button } from 'leva'
import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import * as THREE from 'three'
import './App.css'
import { CanvasScene } from './components/CanvasScene'
import { OverlayPreview } from './components/OverlayPreview'
import { StatusBanner } from './components/StatusBanner'
import { DEFAULT_PALETTE, LEVA_THEME } from './config/app'
import { useAnimatedTransition } from './hooks/useAnimatedTransition'
import { useSignatureVerification, type VerificationStatus } from './hooks/useSignatureVerification'
import { useWallpaperExport } from './hooks/useWallpaperExport'

function App() {
  const [seed, setSeed] = useState(() => Math.random())
  const [status, setStatus] = useState<VerificationStatus>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [signaturePickerRequest, setSignaturePickerRequest] = useState(0)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { animateTransition, transitionProgress } = useAnimatedTransition(() => {
    setSeed(Math.random())
  })

  const { verifyFile } = useSignatureVerification({
    onStatusChange: setStatus,
  })

  const {
    color0, color1, color2, color3, color4, color5, color6, color7,
    color8, color9, color10, color11, color12, color13, color14, color15,
    grain, speed,
    pixelRatio,
    pixelation, distortion, relief,
    // Add new controls
    flowAngle, flowIntensity, bloomStr, bloomThresh, aberration, vignette,
    saturation, brightness,
    overlayText, overlayPosition
  } = useControls('Settings', {
    color0: DEFAULT_PALETTE[0],
    color1: DEFAULT_PALETTE[1],
    color2: DEFAULT_PALETTE[2],
    color3: DEFAULT_PALETTE[3],
    color4: DEFAULT_PALETTE[4],
    color5: DEFAULT_PALETTE[5],
    color6: DEFAULT_PALETTE[6],
    color7: DEFAULT_PALETTE[7],
    color8: DEFAULT_PALETTE[8],
    color9: DEFAULT_PALETTE[9],
    color10: DEFAULT_PALETTE[10],
    color11: DEFAULT_PALETTE[11],
    color12: DEFAULT_PALETTE[12],
    color13: DEFAULT_PALETTE[13],
    color14: DEFAULT_PALETTE[14],
    color15: DEFAULT_PALETTE[15],
    grain: { value: 0.12, min: 0.0, max: 0.3, step: 0.01, label: 'Texture' },
    speed: { value: 0.15, min: 0.0, max: 3.0, step: 0.05, label: 'Speed' },
    flowAngle: { value: 0, min: 0, max: 360, step: 1, label: 'Flow Direction' },
    flowIntensity: { value: 0.0, min: 0.0, max: 2.0, step: 0.05, label: 'Flow Strength' },
    pixelRatio: { value: 1.5, min: 0.5, max: 3, step: 0.1, label: 'Quality' },
    pixelation: { value: 0.0, min: 0.0, max: 1.0, step: 0.01, label: 'Pixelation' },
    distortion: { value: 1.0, min: 0.0, max: 2.0, step: 0.01, label: 'Distortion' },
    relief: { value: 1.0, min: 0.0, max: 2.0, step: 0.01, label: 'Relief' },

    // Post-Processing
    bloomStr: { value: 0.0, min: 0.0, max: 3.0, step: 0.05, label: 'Bloom Intensity' },
    bloomThresh: { value: 0.5, min: 0.0, max: 1.0, step: 0.01, label: 'Bloom Threshold' },
    aberration: { value: 0.0, min: 0.0, max: 0.05, step: 0.001, label: 'Aberration' },
    vignette: { value: 0.0, min: 0.0, max: 0.8, step: 0.01, label: 'Vignette' },
    saturation: { value: 0.2, min: -1.0, max: 1.0, step: 0.05, label: 'Saturation' },
    brightness: { value: 0.05, min: -0.5, max: 0.5, step: 0.01, label: 'Brightness' },

    overlayText: { value: '', label: 'Overlay Text' },
    overlayPosition: { options: { Center: 'center', Bottom: 'bottom' }, value: 'center', label: 'Position' },
    'Randomize & repaint': button(() => animateTransition()),
    'Download PNG (4K)': button(() => {
      void exportWallpaper()
    }),
    'Verify Signature': button(() => {
      setSignaturePickerRequest((value) => value + 1)
    }),
  }, { collapsed: false })

  const { exportWallpaper, isExporting: exportInProgress } = useWallpaperExport({
    canvasRef,
    wrapperRef,
    overlayText,
    overlayPosition: overlayPosition as 'center' | 'bottom',
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

  const flowVector = useMemo(
    () => new THREE.Vector2(
      Math.cos((flowAngle * Math.PI) / 180) * flowIntensity,
      Math.sin((flowAngle * Math.PI) / 180) * flowIntensity,
    ),
    [flowAngle, flowIntensity],
  )

  const colors = useMemo(
    () => [
      color0, color1, color2, color3, color4, color5, color6, color7,
      color8, color9, color10, color11, color12, color13, color14, color15,
    ],
    [
      color0, color1, color2, color3, color4, color5, color6, color7,
      color8, color9, color10, color11, color12, color13, color14, color15,
    ],
  )

  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas
  }, [])

  const handleFileSelection = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    await verifyFile(file)
    event.target.value = ''
  }, [verifyFile])

  return (
    <div className="app-container">
      <div className="custom-leva-wrapper">
        <Leva theme={LEVA_THEME} hidden={isExporting} />
      </div>

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

      <div className="canvas-wrapper" ref={wrapperRef}>
        <CanvasScene
          colors={colors}
          seed={seed}
          grain={grain}
          speed={speed}
          transition={transitionProgress}
          pixelRatio={pixelRatio}
          pixelation={pixelation}
          distortion={distortion}
          relief={relief}
          flowVector={flowVector}
          bloomStrength={bloomStr}
          bloomThreshold={bloomThresh}
          aberration={aberration}
          vignette={vignette}
          saturation={saturation}
          brightness={brightness}
          isExporting={isExporting}
          onCanvasReady={handleCanvasReady}
        />

        <OverlayPreview text={overlayText} position={overlayPosition as 'center' | 'bottom'} />
      </div>

      <div className="overlay" style={{ opacity: isExporting ? 0 : 1 }}>
        <h1>Xwall</h1>
        <a href="https://github.com/xscriptor/xwall" target="_blank" rel="noopener noreferrer" title="View Source">
          <svg height="20" width="20" viewBox="0 0 16 16" fill="white">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </a>
      </div>
    </div>
  )
}

export default App
