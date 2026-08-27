import { useCallback, useRef, useState, type RefObject } from 'react'
import {
  EXPORT_DIMENSIONS,
  X_WEB_WALLPAPER_SIGNATURE,
  type ExportFormat,
  type ExportSize,
} from '../config/app'
import { ExportRenderer, type ExportPostSettings, type ExportSceneState } from '../three/exportRenderer'
import type { SceneState } from '../three/sceneState'
import { drawTextOverlay, embedLSBInCanvas, loadImage } from '../utils/steganography'
import { useLatestRef } from './useLatestRef'

export type ExportStatus = { tone: 'info' | 'success' | 'error'; message: string } | null

interface UseWallpaperExportOptions {
  sceneStateRef: RefObject<SceneState>
  styleRef: RefObject<string>
  formatRef: RefObject<ExportFormat>
  sizeRef: RefObject<ExportSize>
  qualityRef: RefObject<number>
  overlayTextRef: RefObject<string>
  overlayPositionRef: RefObject<'center' | 'bottom'>
  postRef: RefObject<ExportPostSettings>
  onStatusChange: (status: ExportStatus) => void
}

export const useWallpaperExport = ({
  sceneStateRef,
  styleRef,
  formatRef,
  sizeRef,
  qualityRef,
  overlayTextRef,
  overlayPositionRef,
  postRef,
  onStatusChange,
}: UseWallpaperExportOptions) => {
  const [isExporting, setIsExporting] = useState(false)
  const rendererRef = useRef<ExportRenderer | null>(null)
  const statusChangeRef = useLatestRef(onStatusChange)

  const exportWallpaper = useCallback(async () => {
    if (!rendererRef.current) {
      rendererRef.current = new ExportRenderer()
    }

    const scene = sceneStateRef.current
    const state: ExportSceneState = {
      colors: scene.colors,
      seed: scene.seed,
      grain: scene.grain,
      time: scene.time,
      transition: scene.transition,
      pixelation: scene.pixelation,
      distortion: scene.distortion,
      relief: scene.relief,
      flow: scene.flow,
      styleParams: scene.styleParams,
      octaves: scene.octaves,
      style: styleRef.current as ExportSceneState['style'],
    }

    scene.frozen = true
    setIsExporting(true)
    statusChangeRef.current({
      tone: 'info',
      message: 'Rendering high-resolution frame...',
    })

    try {
      const dataUrl = rendererRef.current.render(state, postRef.current)
      const image = await loadImage(dataUrl)
      const dimensions = EXPORT_DIMENSIONS[sizeRef.current]
      const target = document.createElement('canvas')
      target.width = dimensions.width
      target.height = dimensions.height

      const ctx = target.getContext('2d')

      if (!ctx) {
        throw new Error('Could not get a 2D context for the export.')
      }

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(image, 0, 0, dimensions.width, dimensions.height)

      if (overlayTextRef.current) {
        drawTextOverlay(ctx, dimensions.width, dimensions.height, overlayTextRef.current, overlayPositionRef.current)
      }

      const format = formatRef.current
      let href: string

      if (format === 'png') {
        href = embedLSBInCanvas(target, X_WEB_WALLPAPER_SIGNATURE)
      } else {
        href = target.toDataURL(`image/${format}`, qualityRef.current)
      }

      const extension = format === 'jpeg' ? 'jpg' : format
      const link = document.createElement('a')
      link.download = `x-web-wallpaper-${Date.now()}.${extension}`
      link.href = href
      link.click()

      statusChangeRef.current({
        tone: 'success',
        message: `Wallpaper exported as ${format.toUpperCase()}.`,
      })
    } catch (error) {
      console.error('Export failed', error)
      statusChangeRef.current({
        tone: 'error',
        message: 'Export failed. Please try again in a few seconds.',
      })
    } finally {
      scene.frozen = false
      setIsExporting(false)
    }
  }, [postRef, qualityRef, sizeRef, statusChangeRef, formatRef, overlayPositionRef, overlayTextRef, sceneStateRef, styleRef])

  return { exportWallpaper, isExporting }
}
