<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import IconHorse from '~icons/fluent-emoji-high-contrast/horse'

import { useRaceStore } from '@/stores/race'
import { ROUND_DISTANCES } from '@/constants/race'
import { useTrackAnimation } from '@/composables/useTrackAnimation'

const raceStore = useRaceStore()

const { getHorseStyle } = useTrackAnimation()

// 10 lanes
const lanes = ref<{ id: string; laneNumber: number; horseId: number | null }[]>([])

const lapInfoLabel = computed(() => {
  const roundIdx = raceStore.currentRound
  const distance = ROUND_DISTANCES[roundIdx ?? 0]

  return `${roundIdx + 1}. Lap ${distance}m`
})

// Rebuild the lanes array
watch(
  () => raceStore.horsesForCurrentRound,
  horseIds => {
    const newLanes = []

    for (let i = 0; i < 10; i++) {
      newLanes.push({
        id: `lane-${i + 1}`,
        laneNumber: i + 1,
        horseId: horseIds[i] ?? null
      })
    }

    lanes.value = newLanes
  },
  { immediate: true }
)
</script>

<template>
  <div class="w-full my-auto flex flex-col gap-3 min-h-[25rem]">
    <div
      class="min-h-0 relative flex-1 flex flex-col gap-0 mr-5 after:content-[''] after:block after:absolute after:top-0 after:right-0 after:w-0.5 after:h-full after:bg-red-600"
    >
      <div
        v-for="lane in lanes"
        :key="lane.id"
        class="flex items-center h-12 flex-1 border-b border-dotted border-gray-400 first:border-t"
      >
        <div
          class="shrink-0 w-8 h-12 bg-green-700 text-white text-center py-3 border-r border-gray-300"
        >
          {{ lane.laneNumber }}
        </div>

        <!-- The path where a horse runs -->
        <div class="relative flex-1 h-12 flex items-center">
          <div
            v-if="lane.horseId !== null"
            :key="lane.horseId"
            class="absolute h-8"
            :style="getHorseStyle(lane.horseId)"
          >
            <IconHorse
              class="w-8 h-8 -scale-x-100"
              :style="{ color: getHorseStyle(lane.horseId).color }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- The lap info label and finish label -->
    <div class="relative w-full flex-1 flex items-center">
      <p class="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-red-600">
        {{ lapInfoLabel }}
      </p>

      <span class="text-sm font-semibold text-red-600 ml-auto">FINISH</span>
    </div>
  </div>
</template>
