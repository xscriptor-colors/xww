import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import type { WallpaperStyle } from '../config/app'
import auroraFragment from '../shaders/aurora.frag?raw'
import cellsFragment from '../shaders/cells.frag?raw'
import liquidFragment from '../shaders/liquid.frag?raw'
import marbleFragment from '../shaders/marble.frag?raw'
import nebulaFragment from '../shaders/nebula.frag?raw'
import wavesFragment from '../shaders/waves.frag?raw'

export const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export interface StyleMaterial extends THREE.ShaderMaterial {
  uTime: number
  uResolution: THREE.Vector2
  uColors: THREE.Color[]
  uSeed: number
  uGrain: number
  uTransition: number
  uPixelation: number
  uDistortion: number
  uRelief: number
  uFlowVector: THREE.Vector2
  uStyleParams: THREE.Vector4
  uOctaves: number
}

const SHARED_UNIFORMS = {
  uTime: 0,
  uResolution: new THREE.Vector2(),
  uColors: Array.from({ length: 16 }, () => new THREE.Color('#000000')),
  uSeed: 0,
  uGrain: 0.05,
  uTransition: 0,
  uPixelation: 0,
  uDistortion: 1,
  uRelief: 1,
  uFlowVector: new THREE.Vector2(0, 0),
  uStyleParams: new THREE.Vector4(0, 0, 0, 0),
  uOctaves: 4,
}

const LiquidMaterial = shaderMaterial(SHARED_UNIFORMS, VERTEX_SHADER, liquidFragment)
const AuroraMaterial = shaderMaterial(SHARED_UNIFORMS, VERTEX_SHADER, auroraFragment)
const WavesMaterial = shaderMaterial(SHARED_UNIFORMS, VERTEX_SHADER, wavesFragment)
const MarbleMaterial = shaderMaterial(SHARED_UNIFORMS, VERTEX_SHADER, marbleFragment)
const NebulaMaterial = shaderMaterial(SHARED_UNIFORMS, VERTEX_SHADER, nebulaFragment)
const CellsMaterial = shaderMaterial(SHARED_UNIFORMS, VERTEX_SHADER, cellsFragment)

export const createStyleMaterial = (style: WallpaperStyle): StyleMaterial => {
  switch (style) {
    case 'aurora':
      return new AuroraMaterial() as StyleMaterial
    case 'waves':
      return new WavesMaterial() as StyleMaterial
    case 'marble':
      return new MarbleMaterial() as StyleMaterial
    case 'nebula':
      return new NebulaMaterial() as StyleMaterial
    case 'cells':
      return new CellsMaterial() as StyleMaterial
    case 'liquid':
    default:
      return new LiquidMaterial() as StyleMaterial
  }
}
