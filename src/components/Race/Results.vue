<script setup lang="ts">
import { computed } from 'vue'
import { useRaceStore } from '@/stores/race'
import { useHorseStore } from '@/stores/horse'
import type { RoundData } from '@/types'

import UiTable from '../UiTable.vue'

const raceStore = useRaceStore()
const horseStore = useHorseStore()

const hasResults = computed(() => raceStore.raceResults.length > 0)

function formatLapTitle(round?: RoundData) {
  if (!round) {
    return '-'
  }

  return `${round.roundNumber}. Lap - ${round.distance}m`
}

function getRound(roundId: string) {
  return raceStore.rounds.find(r => r.id === roundId)
}
</script>

<template>
  <section class="flex flex-col gap-2 border rounded-md bg-white">
    <header class="px-4 py-2 h-11">
      <h4 class="text-lg xl:text-xl font-bold">Results</h4>
    </header>

    <div
      class="h-[calc(100svh-10.625rem)] flex flex-col"
      :class="{ 'overflow-auto': hasResults }"
      data-testid="results-container"
    >
      <Transition name="fade" mode="out-in">
        <div v-if="!hasResults" class="flex flex-col gap-2 my-auto px-1">
          <p class="text-sm font-medium text-center">Waiting a horse to finish the round...</p>
        </div>

        <div v-else>
          <div
            v-for="result in raceStore.raceResults"
            :key="result.roundId"
            class="mb-4 whitespace-nowrap xl:w-72"
          >
            <Transition name="fade-down" mode="out-in">
              <div v-if="result.positions.length" data-testid="round-result">
                <!-- round info: number and distance -->
                <div class="bg-orange-700 px-4 py-2 w-full">
                  <p class="text-white text-sm font-bold">
                    {{ formatLapTitle(getRound(result.roundId)) }}
                  </p>
                </div>

                <UiTable class="w-full">
                  <template #header>
                    <th>Position</th>
                    <th>Name</th>
                  </template>

                  <template #body>
                    <tr
                      v-for="{ horseId, posIdx } in result.positions"
                      :key="horseId"
                      data-testid="result-row"
                    >
                      <td>{{ posIdx }}</td>
                      <td>{{ horseStore.getHorseName(horseId) }}</td>
                    </tr>
                  </template>
                </UiTable>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </div>
  </section>
</template>
