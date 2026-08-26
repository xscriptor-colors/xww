import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type RefObject } from 'react'
import type { WallpaperStyle } from '../config/app'
import { createStyleMaterial, type StyleMaterial } from '../three/materials'
import type { SceneState } from '../three/sceneState'

interface WallpaperShaderProps {
  stateRef: RefObject<SceneState>
  style: WallpaperStyle
  advanceTime?: boolean
}

export const WallpaperShader = ({ stateRef, style, advanceTime = true }: WallpaperShaderProps) => {
  const matRef = useRef<StyleMaterial | null>(null)
  const colorUniformsRef = useRef<THREE.Color[]>([])
  const lastColorsRef = useRef<string[]>([])
  const { gl, viewport, size } = useThree()

  const material = useMemo(() => createStyleMaterial(style), [style])

  useEffect(() => {
    matRef.current = material
  }, [material])

  useEffect(() => () => {
    material.dispose()
  }, [material])

  useFrame((_state, delta) => {
    const scene = stateRef.current

    if (advanceTime && !scene.frozen) {
      scene.time += delta * (scene.speed * 5)
    }

    const last = lastColorsRef.current
    if (last.length !== scene.colors.length || scene.colors.some((color, index) => color !== last[index])) {
      lastColorsRef.current = [...scene.colors]
      colorUniformsRef.current = scene.colors.map((color) => new THREE.Color(color))
    }

    const mat = matRef.current

    if (!mat) {
      return
    }

    mat.uTime = scene.time
    mat.uResolution.set(size.width * gl.getPixelRatio(), size.height * gl.getPixelRatio())
    mat.uSeed = scene.seed
    mat.uColors = colorUniformsRef.current
    mat.uGrain = scene.grain
    mat.uTransition = scene.transition
    mat.uPixelation = scene.pixelation
    mat.uDistortion = scene.distortion
    mat.uRelief = scene.relief
    mat.uFlowVector = scene.flow
    mat.uStyleParams.set(scene.styleParams.x, scene.styleParams.y, 0, 0)
    mat.uOctaves = scene.octaves
  })

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}
