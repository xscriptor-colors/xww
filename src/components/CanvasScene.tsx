import { Bloom, BrightnessContrast, ChromaticAberration, EffectComposer, HueSaturation, Vignette } from '@react-three/postprocessing'
import { Canvas, useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { BlendFunction } from 'postprocessing'
import type * as THREE from 'three'
import { LiquidShader } from './LiquidShader'

interface CanvasSceneProps {
  colors: string[]
  seed: number
  grain: number
  speed: number
  transition: number
  pixelRatio: number
  pixelation: number
  distortion: number
  relief: number
  flowVector: THREE.Vector2
  bloomStrength: number
  bloomThreshold: number
  aberration: number
  vignette: number
  saturation: number
  brightness: number
  isExporting: boolean
  onCanvasReady: (canvas: HTMLCanvasElement) => void
}

const CanvasCaptureBridge = ({ onCanvasReady }: { onCanvasReady: (canvas: HTMLCanvasElement) => void }) => {
  const gl = useThree((state) => state.gl)

  useEffect(() => {
    onCanvasReady(gl.domElement)
  }, [gl, onCanvasReady])

  return null
}

export const CanvasScene = ({
  colors,
  seed,
  grain,
  speed,
  transition,
  pixelRatio,
  pixelation,
  distortion,
  relief,
  flowVector,
  bloomStrength,
  bloomThreshold,
  aberration,
  vignette,
  saturation,
  brightness,
  isExporting,
  onCanvasReady,
}: CanvasSceneProps) => {
  return (
    <Canvas
      flat
      dpr={isExporting ? 2 : pixelRatio}
      gl={{
        antialias: true,
        preserveDrawingBuffer: true,
      }}
      orthographic
      camera={{ zoom: 1, position: [0, 0, 100] }}
    >
      <CanvasCaptureBridge onCanvasReady={onCanvasReady} />
      <LiquidShader
        colors={colors}
        seed={seed}
        grain={grain}
        speed={speed}
        transition={transition}
        pixelation={pixelation}
        distortion={distortion}
        relief={relief}
        flowVector={flowVector}
      />
      <EffectComposer>
        <Bloom luminanceThreshold={bloomThreshold} intensity={bloomStrength} levels={9} mipmapBlur />
        <ChromaticAberration offset={[aberration, aberration]} />
        <Vignette offset={0.3} darkness={vignette} eskil={false} blendFunction={BlendFunction.NORMAL} />
        <HueSaturation saturation={saturation} hue={0} />
        <BrightnessContrast brightness={brightness} contrast={0} />
      </EffectComposer>
    </Canvas>
  )
}
