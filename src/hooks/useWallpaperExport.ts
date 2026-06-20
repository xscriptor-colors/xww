import { useCallback, useState, type RefObject } from 'react'
import { EXPORT_SIZE, XWALL_SIGNATURE } from '../config/app'
import { useLatestRef } from './useLatestRef'
import { encodeLSB } from '../utils/steganography'

type OverlayPosition = 'center' | 'bottom'
type ExportStatus = { tone: 'info' | 'success' | 'error'; message: string } | null

interface UseWallpaperExportOptions {
  canvasRef: RefObject<HTMLCanvasElement | null>
  wrapperRef: RefObject<HTMLDivElement | null>
  overlayText: string
  overlayPosition: OverlayPosition
  onStatusChange: (status: ExportStatus) => void
}

const waitForRender = (delay = 500) =>
  new Promise<void>((resolve) => {
    window.setTimeout(() => resolve(), delay)
  })

const waitForNextFrame = () =>
  new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve())
  })

export const useWallpaperExport = ({
  canvasRef,
  wrapperRef,
  overlayText,
  overlayPosition,
  onStatusChange,
}: UseWallpaperExportOptions) => {
  const [isExporting, setIsExporting] = useState(false)
  const overlayTextRef = useLatestRef(overlayText)
  const overlayPositionRef = useLatestRef(overlayPosition)
  const statusChangeRef = useLatestRef(onStatusChange)

  const exportWallpaper = useCallback(async () => {
    const wrapper = wrapperRef.current

    if (!wrapper) {
      statusChangeRef.current({
        tone: 'error',
        message: 'The render container is not ready yet.',
      })
      return
    }

    setIsExporting(true)
    statusChangeRef.current({
      tone: 'info',
      message: 'Preparing 4K export...',
    })

    const originalStyles = {
      width: wrapper.style.width,
      height: wrapper.style.height,
      position: wrapper.style.position,
      zIndex: wrapper.style.zIndex,
      top: wrapper.style.top,
      left: wrapper.style.left,
    }

    try {
      wrapper.style.width = `${EXPORT_SIZE.width}px`
      wrapper.style.height = `${EXPORT_SIZE.height}px`
      wrapper.style.position = 'fixed'
      wrapper.style.zIndex = '-9999'
      wrapper.style.top = '0'
      wrapper.style.left = '0'

      await waitForNextFrame()
      await waitForNextFrame()
      await waitForRender(700)

      const canvas = canvasRef.current

      if (!canvas) {
        throw new Error('Canvas not ready for export.')
      }

      const dataUrl = encodeLSB(
        canvas,
        XWALL_SIGNATURE,
        overlayTextRef.current,
        overlayPositionRef.current,
      )

      const link = document.createElement('a')
      link.download = `xwall-${Date.now()}.png`
      link.href = dataUrl
      link.click()

      statusChangeRef.current({
        tone: 'success',
        message: '4K wallpaper exported successfully.',
      })
    } catch (error) {
      console.error('Export failed', error)
      statusChangeRef.current({
        tone: 'error',
        message: 'Export failed. Please try again in a few seconds.',
      })
    } finally {
      wrapper.style.width = originalStyles.width || '100%'
      wrapper.style.height = originalStyles.height || '100%'
      wrapper.style.position = originalStyles.position || 'absolute'
      wrapper.style.zIndex = originalStyles.zIndex || '1'
      wrapper.style.top = originalStyles.top || '0'
      wrapper.style.left = originalStyles.left || '0'

      setIsExporting(false)
    }
  }, [canvasRef, wrapperRef, overlayPositionRef, overlayTextRef, statusChangeRef])

  return { exportWallpaper, isExporting }
}
