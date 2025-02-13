import { ref, watch, onBeforeUnmount } from 'vue'
import { useRaceStore } from '@/stores/race'
import { useHorseStore } from '@/stores/horse'
import { ROUND_DISTANCES } from '@/constants/race'

export function useTrackAnimation() {
  const raceStore = useRaceStore()

  const horseStore = useHorseStore()

  // Track animation start time for each horse
  const animationStartTimes = ref<Record<number, number>>({})

  // Track the animation frame handle for cleanup
  const animationFrameHandle = ref<number | null>(null)

  // Track elapsed time for each horse
  const elapsedTimes = ref<Record<number, number>>({})

  // Watch for race status changes
  watch(
    () => raceStore.raceStatus,
    (newStatus, oldStatus) => {
      if (newStatus === 'paused' && oldStatus === 'running') {
        // Save current positions when paused
        saveHorsePositions()

        // Cancel animation frame
        if (animationFrameHandle.value) {
          cancelAnimationFrame(animationFrameHandle.value)
          animationFrameHandle.value = null
        }
      } else if (newStatus === 'running' && oldStatus === 'paused') {
        // Resume
        resumeAnimation()
      } else if (newStatus === 'running' && oldStatus === 'idle') {
        // Start fresh animation
        startFreshAnimation()
      }
    }
  )

  // Cleanup animation frame on unmount
  onBeforeUnmount(() => {
    if (animationFrameHandle.value) {
      cancelAnimationFrame(animationFrameHandle.value)
    }
  })

  function saveHorsePositions() {
    raceStore.horsesForCurrentRound.forEach(horseId => {
      if (horseId !== null) {
        const elapsed = elapsedTimes.value[horseId] || 0
        const computedLeft = getHorseLeftPosition(horseId, elapsed)
        raceStore.saveHorsePosition(horseId, computedLeft, elapsed)
      }
    })
  }

  function resumeAnimation() {
    const now = performance.now()

    raceStore.horsesForCurrentRound.forEach(horseId => {
      if (horseId !== null) {
        const elapsed = elapsedTimes.value[horseId] || 0
        animationStartTimes.value[horseId] = now - elapsed
      }
    })

    startAnimationLoop()
  }

  function startFreshAnimation() {
    const now = performance.now()

    raceStore.horsesForCurrentRound.forEach(horseId => {
      if (horseId !== null) {
        animationStartTimes.value[horseId] = now
        elapsedTimes.value[horseId] = 0
      }
    })

    startAnimationLoop()
  }

  function startAnimationLoop() {
    const animate = () => {
      const now = performance.now()

      raceStore.horsesForCurrentRound.forEach(horseId => {
        if (horseId !== null) {
          const startTime = animationStartTimes.value[horseId]

          if (startTime) {
            const elapsed = now - startTime
            elapsedTimes.value[horseId] = elapsed

            // Check if the horse has finished
            const distance = ROUND_DISTANCES[raceStore.currentRound ?? 0]
            const totalDuration = raceStore.getTimeToFinish(horseId, distance) * 1000 // convert to ms

            if (elapsed >= totalDuration) {
              // Notify the store that this horse has finished
              raceStore.finishForHorse(horseId)
            }
          }
        }
      })

      // Continue animation if race status is `running`
      if (raceStore.raceStatus === 'running') {
        animationFrameHandle.value = requestAnimationFrame(animate)
      }
    }

    animationFrameHandle.value = requestAnimationFrame(animate)
  }

  function getHorseLeftPosition(horseId: number, elapsed: number) {
    const distance = ROUND_DISTANCES[raceStore.currentRound ?? 0]
    const totalDuration = raceStore.getTimeToFinish(horseId, distance) * 1000 // convert to ms

    // icon width: 2rem, offset: 0.5rem
    if (elapsed >= totalDuration) {
      return 'calc(100% - 2.5rem)'
    }

    const progress = Math.min(elapsed / totalDuration, 1)
    return `calc(${progress * 100}% - ${progress * 2.5}rem)`
  }

  function getHorseStyle(horseId: number) {
    const isRunning = raceStore.raceStatus === 'running'
    const isPaused = raceStore.raceStatus === 'paused'

    let left = '0%'

    if (isPaused) {
      // Use saved position when paused
      left = raceStore.pausedPositions[horseId]?.left || '0%'
    } else if (isRunning) {
      // Calculate position based on elapsed time
      const elapsed = elapsedTimes.value[horseId] || 0
      left = getHorseLeftPosition(horseId, elapsed)
    }

    // Find the horse color
    const horse = horseStore.horses.find(h => h.id === horseId)
    const color = horse ? horse.color : '#000'

    return {
      left,
      color
    }
  }

  return {
    animationStartTimes,
    animationFrameHandle,
    elapsedTimes,
    getHorseStyle
  }
}
