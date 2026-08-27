import { describe, expect, it } from 'vitest'
import {
  embedBitsInImageData,
  extractMessageFromImageData,
  textToBitArray,
} from './steganography'

describe('steganography helpers', () => {
  it('encodes and decodes a short message without touching alpha', () => {
    const source = new Uint8ClampedArray(192).fill(240)
    const originalAlphaValues = source.filter((_, index) => (index + 1) % 4 === 0)
    const bits = textToBitArray('X Web Wallpaper')
    const { data, truncated } = embedBitsInImageData(source, bits)

    expect(truncated).toBe(false)
    expect(extractMessageFromImageData(data)).toBe('X Web Wallpaper')

    const nextAlphaValues = data.filter((_, index) => (index + 1) % 4 === 0)
    expect(Array.from(nextAlphaValues)).toEqual(Array.from(originalAlphaValues))
  })

  it('reports truncation when the payload does not fit', () => {
    const source = new Uint8ClampedArray(8).fill(120)
    const bits = textToBitArray('too-large')
    const { truncated } = embedBitsInImageData(source, bits)

    expect(truncated).toBe(true)
  })

  it('appends a null terminator to the encoded payload', () => {
    const bits = textToBitArray('ok')

    expect(bits.slice(-8)).toEqual([0, 0, 0, 0, 0, 0, 0, 0])
  })
})
