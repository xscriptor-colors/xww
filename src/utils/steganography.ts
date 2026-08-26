const CHANNELS_PER_PIXEL = 4
const NULL_TERMINATOR = '\0'

const isAlphaChannel = (channelIndex: number) =>
  channelIndex % CHANNELS_PER_PIXEL === CHANNELS_PER_PIXEL - 1

export const textToBitArray = (text: string) =>
  Array.from(`${text}${NULL_TERMINATOR}`).flatMap((char) => {
    const codePoint = char.charCodeAt(0)

    return codePoint
      .toString(2)
      .padStart(8, '0')
      .split('')
      .map((bit) => Number(bit))
  })

export const embedBitsInImageData = (source: Uint8ClampedArray, bits: number[]) => {
  const next = new Uint8ClampedArray(source)
  let bitIndex = 0

  for (let index = 0; index < next.length; index += 1) {
    if (isAlphaChannel(index)) {
      continue
    }

    if (bitIndex >= bits.length) {
      break
    }

    next[index] = (next[index] & 0xfe) | bits[bitIndex]
    bitIndex += 1
  }

  return {
    data: next,
    truncated: bitIndex < bits.length,
  }
}

export const extractMessageFromImageData = (data: Uint8ClampedArray) => {
  let byte = ''
  let message = ''

  for (let index = 0; index < data.length; index += 1) {
    if (isAlphaChannel(index)) {
      continue
    }

    byte += String(data[index] & 1)

    if (byte.length !== 8) {
      continue
    }

    const codePoint = Number.parseInt(byte, 2)

    if (codePoint === 0) {
      return message
    }

    message += String.fromCharCode(codePoint)
    byte = ''
  }

  return message
}

export const drawTextOverlay = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  overlayText: string,
  overlayPosition: 'center' | 'bottom' = 'center',
) => {
  const lines = overlayText.split('\n')
  const fontSize = Math.floor(height * 0.05)
  const lineHeight = Math.round(fontSize * 1.15)
  const blockHeight = lineHeight * Math.max(lines.length - 1, 0)
  const centerX = width / 2
  const baseY = overlayPosition === 'bottom' ? height - height * 0.1 : height / 2
  const startY = baseY - blockHeight / 2

  ctx.font = `500 ${fontSize}px Inter, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
  ctx.shadowBlur = 20
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 10
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'

  lines.forEach((line, index) => {
    ctx.fillText(line, centerX, startY + lineHeight * index)
  })

  ctx.shadowColor = 'transparent'
}

export const loadImage = (imageSrc: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Could not load the selected image.'))
    image.src = imageSrc
  })

export const embedLSBInCanvas = (sourceCanvas: HTMLCanvasElement, text: string) => {
  const width = sourceCanvas.width
  const height = sourceCanvas.height
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = width
  tempCanvas.height = height

  const ctx = tempCanvas.getContext('2d')

  if (!ctx) {
    throw new Error('Could not get 2D context.')
  }

  ctx.drawImage(sourceCanvas, 0, 0)

  const imageData = ctx.getImageData(0, 0, width, height)
  const messageBits = textToBitArray(text)
  const { data, truncated } = embedBitsInImageData(imageData.data, messageBits)

  if (truncated) {
    console.warn('Text is too long to hide in this image. The signature was truncated.')
  }

  imageData.data.set(data)
  ctx.putImageData(imageData, 0, 0)

  return tempCanvas.toDataURL('image/png', 1.0)
}

export const decodeLSB = async (imageSrc: string) => {
  const image = await loadImage(imageSrc)
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height

  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('No canvas context available.')
  }

  ctx.drawImage(image, 0, 0)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

  return extractMessageFromImageData(imageData.data)
}
