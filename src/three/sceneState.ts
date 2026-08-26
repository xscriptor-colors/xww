import * as THREE from 'three'
import type { StyleParams } from '../config/app'

export interface SceneState {
  colors: string[]
  seed: number
  grain: number
  speed: number
  time: number
  transition: number
  frozen: boolean
  pixelation: number
  distortion: number
  relief: number
  flow: THREE.Vector2
  styleParams: StyleParams
  octaves: number
}

export const createSceneState = (): SceneState => ({
  colors: [],
  seed: 0,
  grain: 0.12,
  speed: 0.15,
  time: 0,
  transition: 0,
  frozen: false,
  pixelation: 0,
  distortion: 1,
  relief: 1,
  flow: new THREE.Vector2(0, 0),
  styleParams: { x: 1, y: 1 },
  octaves: 4,
})
