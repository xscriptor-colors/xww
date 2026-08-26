export const DEFAULT_PALETTE = [
  '#000000',
  '#fc618d',
  '#7bd88f',
  '#fce566',
  '#fd9353',
  '#948ae3',
  '#5ad4e6',
  '#f7f1ff',
  '#000000',
  '#fc618d',
  '#7bd88f',
  '#fce566',
  '#fd9353',
  '#948ae3',
  '#5ad4e6',
  '#f7f1ff',
] as const

export const EXPORT_SIZE = {
  width: 3840,
  height: 2160,
} as const

export const XWALL_SIGNATURE = 'Created by Xscriptor with Xwall'

export const WALLPAPER_STYLES = ['liquid', 'aurora', 'waves', 'marble', 'nebula', 'cells'] as const

export type WallpaperStyle = (typeof WALLPAPER_STYLES)[number]

export interface StyleParamDef {
  key: 'x' | 'y'
  label: string
  min: number
  max: number
  step: number
  defaultValue: number
}

export interface StyleDetails {
  label: string
  params: [StyleParamDef, StyleParamDef]
}

export const STYLE_DETAILS: Record<WallpaperStyle, StyleDetails> = {
  liquid: {
    label: 'Liquid',
    params: [
      { key: 'x', label: 'Detail', min: 0, max: 1, step: 0.01, defaultValue: 0 },
      { key: 'y', label: 'Extra', min: 0, max: 1, step: 0.01, defaultValue: 0 },
    ],
  },
  aurora: {
    label: 'Aurora',
    params: [
      { key: 'x', label: 'Drift', min: 0, max: 2, step: 0.05, defaultValue: 1 },
      { key: 'y', label: 'Intensity', min: 0, max: 2, step: 0.05, defaultValue: 1 },
    ],
  },
  waves: {
    label: 'Waves',
    params: [
      { key: 'x', label: 'Ridge Sharpness', min: 0.5, max: 3, step: 0.05, defaultValue: 1.5 },
      { key: 'y', label: 'Scale', min: 1, max: 4, step: 0.1, defaultValue: 2 },
    ],
  },
  marble: {
    label: 'Marble',
    params: [
      { key: 'x', label: 'Swirl', min: 0.5, max: 4, step: 0.05, defaultValue: 1.5 },
      { key: 'y', label: 'Scale', min: 1, max: 5, step: 0.1, defaultValue: 2 },
    ],
  },
  nebula: {
    label: 'Nebula',
    params: [
      { key: 'x', label: 'Stars', min: 0, max: 1, step: 0.01, defaultValue: 0.6 },
      { key: 'y', label: 'Density', min: 0.5, max: 2, step: 0.05, defaultValue: 1 },
    ],
  },
  cells: {
    label: 'Cells',
    params: [
      { key: 'x', label: 'Cell Size', min: 3, max: 12, step: 0.5, defaultValue: 6 },
      { key: 'y', label: 'Glow', min: 0, max: 2, step: 0.05, defaultValue: 1 },
    ],
  },
}

export const EXPORT_FORMATS = ['png', 'jpeg', 'webp'] as const

export type ExportFormat = (typeof EXPORT_FORMATS)[number]

export const EXPORT_FORMAT_LABELS: Record<ExportFormat, string> = {
  png: 'PNG',
  jpeg: 'JPG',
  webp: 'WebP',
}

export const EXPORT_SIZES = ['1080p', '1440p', '4k'] as const

export type ExportSize = (typeof EXPORT_SIZES)[number]

export const EXPORT_SIZE_LABELS: Record<ExportSize, string> = {
  '1080p': '1080p',
  '1440p': '1440p',
  '4k': '4K',
}

export const EXPORT_DIMENSIONS: Record<ExportSize, { width: number; height: number }> = {
  '1080p': { width: 1920, height: 1080 },
  '1440p': { width: 2560, height: 1440 },
  '4k': EXPORT_SIZE,
}

export interface WallpaperSettings {
  grain: number
  speed: number
  flowAngle: number
  flowIntensity: number
  quality: number
  octaves: number
  pixelation: number
  distortion: number
  relief: number
  bloomStrength: number
  bloomThreshold: number
  aberration: number
  vignette: number
  saturation: number
  brightness: number
}

export const DEFAULT_SETTINGS: WallpaperSettings = {
  grain: 0.12,
  speed: 0.15,
  flowAngle: 0,
  flowIntensity: 0,
  quality: 1.5,
  octaves: 4,
  pixelation: 0,
  distortion: 1,
  relief: 1,
  bloomStrength: 0,
  bloomThreshold: 0.5,
  aberration: 0,
  vignette: 0,
  saturation: 0.2,
  brightness: 0.05,
}

export interface StyleParams {
  x: number
  y: number
}

export const getDefaultStyleParams = (style: WallpaperStyle): StyleParams => {
  const details = STYLE_DETAILS[style]
  return {
    x: details.params[0].defaultValue,
    y: details.params[1].defaultValue,
  }
}
