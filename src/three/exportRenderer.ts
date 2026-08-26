import * as THREE from 'three'
import {
  BlendFunction,
  BloomEffect,
  BrightnessContrastEffect,
  ChromaticAberrationEffect,
  EffectComposer,
  EffectPass,
  HueSaturationEffect,
  RenderPass,
  VignetteEffect,
} from 'postprocessing'
import { EXPORT_SIZE, type StyleParams, type WallpaperStyle } from '../config/app'
import { createStyleMaterial, type StyleMaterial } from './materials'

export interface ExportPostSettings {
  bloomStrength: number
  bloomThreshold: number
  aberration: number
  vignette: number
  saturation: number
  brightness: number
}

export interface ExportSceneState {
  colors: string[]
  seed: number
  grain: number
  time: number
  transition: number
  pixelation: number
  distortion: number
  relief: number
  flow: THREE.Vector2
  styleParams: StyleParams
  octaves: number
  style: WallpaperStyle
}

const hasPostEffects = (post: ExportPostSettings) =>
  post.bloomStrength > 0 ||
  post.aberration > 0 ||
  post.vignette > 0 ||
  post.saturation !== 0 ||
  post.brightness !== 0

export class ExportRenderer {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  private mesh: THREE.Mesh<THREE.PlaneGeometry, StyleMaterial>
  private composer: EffectComposer | null = null
  private bloom: BloomEffect | null = null
  private bloomThreshold: number | null = null
  private bloomVersion = 0
  private effectPassVersion = -1
  private aberration: ChromaticAberrationEffect | null = null
  private vignette: VignetteEffect | null = null
  private hueSat: HueSaturationEffect | null = null
  private brightness: BrightnessContrastEffect | null = null
  private currentStyle: WallpaperStyle | null = null

  constructor() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    })
    this.renderer.setPixelRatio(1)
    this.renderer.setSize(EXPORT_SIZE.width, EXPORT_SIZE.height, false)
    this.renderer.toneMapping = THREE.NoToneMapping

    const geometry = new THREE.PlaneGeometry(2, 2)
    this.mesh = new THREE.Mesh(geometry, createStyleMaterial('liquid'))
    this.scene.add(this.mesh)
  }

  private ensureEffects(post: ExportPostSettings) {
    if (!this.composer) {
      this.composer = new EffectComposer(this.renderer, {
        frameBufferType: THREE.HalfFloatType,
      })
      this.composer.addPass(new RenderPass(this.scene, this.camera))
      this.composer.setSize(EXPORT_SIZE.width, EXPORT_SIZE.height)
    }

    if (!this.bloom || this.bloomThreshold !== post.bloomThreshold) {
      const previous = this.bloom
      this.bloom = new BloomEffect({
        intensity: post.bloomStrength,
        luminanceThreshold: post.bloomThreshold,
        mipmapBlur: true,
        levels: 9,
      })
      this.bloomThreshold = post.bloomThreshold
      this.bloomVersion += 1
      previous?.dispose()
    }

    if (!this.aberration) {
      this.aberration = new ChromaticAberrationEffect({
        offset: new THREE.Vector2(0, 0),
        radialModulation: false,
        modulationOffset: 0,
      })
    }
    if (!this.vignette) {
      this.vignette = new VignetteEffect({
        offset: 0.3,
        darkness: 0,
        eskil: false,
        blendFunction: BlendFunction.NORMAL,
      })
    }
    if (!this.hueSat) {
      this.hueSat = new HueSaturationEffect({ saturation: 0 })
    }
    if (!this.brightness) {
      this.brightness = new BrightnessContrastEffect({ brightness: 0, contrast: 0 })
    }

    if (this.effectPassVersion !== this.bloomVersion) {
      const effectPass = new EffectPass(
        this.camera,
        this.bloom,
        this.aberration,
        this.vignette,
        this.hueSat,
        this.brightness,
      )
      this.composer.passes[1] = effectPass
      this.effectPassVersion = this.bloomVersion
    }
  }

  private applyMaterial(state: ExportSceneState) {
    if (this.currentStyle !== state.style) {
      const previous = this.mesh.material
      this.mesh.material = createStyleMaterial(state.style)
      previous.dispose()
      this.currentStyle = state.style
    }

    const material = this.mesh.material
    material.uTime = state.time
    material.uResolution.set(EXPORT_SIZE.width, EXPORT_SIZE.height)
    material.uColors = state.colors.map((color) => new THREE.Color(color))
    material.uSeed = state.seed
    material.uGrain = state.grain
    material.uTransition = state.transition
    material.uPixelation = state.pixelation
    material.uDistortion = state.distortion
    material.uRelief = state.relief
    material.uFlowVector = state.flow
    material.uStyleParams.set(state.styleParams.x, state.styleParams.y, 0, 0)
    material.uOctaves = state.octaves
  }

  render(state: ExportSceneState, post: ExportPostSettings): string {
    this.applyMaterial(state)

    if (hasPostEffects(post)) {
      this.ensureEffects(post)

      if (this.bloom) {
        this.bloom.intensity = post.bloomStrength
      }
      if (this.aberration) {
        this.aberration.offset.set(post.aberration, post.aberration)
      }
      if (this.vignette) {
        this.vignette.offset = 0.3
        this.vignette.darkness = post.vignette
      }
      if (this.hueSat) {
        this.hueSat.saturation = post.saturation
      }
      if (this.brightness) {
        this.brightness.brightness = post.brightness
        this.brightness.contrast = 0
      }

      this.composer?.render()
    } else {
      this.renderer.render(this.scene, this.camera)
    }

    return this.renderer.domElement.toDataURL('image/png')
  }

  dispose() {
    this.composer?.dispose()
    this.mesh.material.dispose()
    this.mesh.geometry.dispose()
    this.renderer.dispose()
  }
}
