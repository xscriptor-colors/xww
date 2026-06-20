import { useCallback, useEffect, useRef, useState } from 'react'

export const useAnimatedTransition = (onMidpoint: () => void) => {
  const [transitionProgress, setTransitionProgress] = useState(0)
  const frameRef = useRef<number | null>(null)

  const animateTransition = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current)
    }

    const start = performance.now()
    const duration = 1000
    const halfDuration = duration / 2
    let hasTriggeredMidpoint = false

    const tick = (now: number) => {
      const elapsed = now - start

      if (!hasTriggeredMidpoint && elapsed >= halfDuration) {
        hasTriggeredMidpoint = true
        onMidpoint()
      }

      if (elapsed < duration) {
        setTransitionProgress(
          elapsed < halfDuration
            ? elapsed / halfDuration
            : 1 - (elapsed - halfDuration) / halfDuration,
        )

        frameRef.current = requestAnimationFrame(tick)
        return
      }

      setTransitionProgress(0)
      frameRef.current = null
    }

    frameRef.current = requestAnimationFrame(tick)
  }, [onMidpoint])

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  return { animateTransition, transitionProgress }
}
