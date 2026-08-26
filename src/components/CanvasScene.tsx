import { Bloom, BrightnessContrast, ChromaticAberration, EffectComposer, HueSaturation, Vignette } from '@react-three/postprocessing'
import { Canvas } from '@react-three/fiber'
import { memo, type RefObject } from 'react'
import { BlendFunction } from 'postprocessing'
import type { WallpaperStyle } from '../config/app'
import type { SceneState } from '../three/sceneState'
import { WallpaperShader } from './WallpaperShader'

interface CanvasSceneProps {
  stateRef: RefObject<SceneState>
  style: WallpaperStyle
  dpr: number
  bloomStrength: number
  bloomThreshold: number
  aberration: number
  vignette: number
  saturation: number
  brightness: number
}

export const CanvasScene = memo(function CanvasScene({
  stateRef,
  style,
  dpr,
  bloomStrength,
  bloomThreshold,
  aberration,
  vignette,
  saturation,
  brightness,
}: CanvasSceneProps) {
  const hasEffects =
    bloomStrength > 0 || aberration > 0 || vignette > 0 || saturation !== 0 || brightness !== 0

  return (
    <Canvas
      flat
      dpr={dpr}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
      }}
      orthographic
      camera={{ zoom: 1, position: [0, 0, 100] }}
    >
      <WallpaperShader stateRef={stateRef} style={style} />
      {hasEffects && (
        <EffectComposer>
          <Bloom luminanceThreshold={bloomThreshold} intensity={bloomStrength} levels={9} mipmapBlur />
          <ChromaticAberration offset={[aberration, aberration]} />
          <Vignette offset={0.3} darkness={vignette} eskil={false} blendFunction={BlendFunction.NORMAL} />
          <HueSaturation saturation={saturation} hue={0} />
          <BrightnessContrast brightness={brightness} contrast={0} />
        </EffectComposer>
      )}
    </Canvas>
  )
})
