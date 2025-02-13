<script setup lang="ts">
import { computed } from 'vue'

import UiButton from './UiButton.vue'
import { useRaceStore } from '@/stores/race'

const raceStore = useRaceStore()

const stateLabel = computed(() => {
  switch (raceStore.raceStatus) {
    case 'idle':
      return 'Start'
    case 'running':
      return 'Pause'
    case 'paused':
      return 'Resume'
    case 'finished':
      return 'Restart'
    default:
      return 'Unknown'
  }
})

function handleChangeState() {
  switch (raceStore.raceStatus) {
    // Start or Restart
    case 'idle':
    case 'finished':
      raceStore.startRace()
      break
    // Pause
    case 'running':
      raceStore.pauseRace()
      break
    // Resume
    case 'paused':
      raceStore.startRace()
      break
    default:
      break
  }
}
</script>

<template>
  <div
    class="px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 w-full flex items-center justify-between gap-4 bg-emerald-500"
    data-testid="app-header"
  >
    <h3 class="text-2xl sm:text-3xl font-semibold text-black">Horse Racing</h3>

    <div class="flex items-center gap-2 sm:gap-3 md:gap-5">
      <UiButton
        data-testid="generate-program-btn"
        class="text-sm sm:text-base"
        @click="raceStore.generateRounds()"
      >
        Generate Program
      </UiButton>

      <UiButton
        data-testid="race-control-btn"
        class="text-sm sm:text-base"
        @click="handleChangeState"
      >
        {{ stateLabel }}
      </UiButton>
    </div>
  </div>
</template>
