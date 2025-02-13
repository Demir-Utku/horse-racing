<script setup lang="ts">
import { useRaceStore } from '@/stores/race'
import { useHorseStore } from '@/stores/horse'
import type { RoundData } from '@/types'

import UiTable from '../UiTable.vue'

const raceStore = useRaceStore()
const horseStore = useHorseStore()

function formatLapTitle(round: RoundData) {
  return `${round.roundNumber}. Lap - ${round.distance}m`
}

function getHorseName(horseId: number) {
  return horseStore.horses.find(h => h.id === horseId)?.name ?? 'Unknown'
}
</script>

<template>
  <section class="flex flex-col gap-2 border rounded-md bg-white">
    <header class="px-4 py-2 h-11">
      <h4 class="text-lg xl:text-xl font-bold">Program</h4>
    </header>

    <div
      class="h-[calc(100svh-10.625rem)] flex flex-col"
      :class="{ 'overflow-auto': !!raceStore.rounds.length }"
      data-testid="program-container"
    >
      <Transition name="fade" mode="out-in">
        <div v-if="!raceStore.rounds.length" class="flex flex-col gap-2 my-auto px-1">
          <p class="text-sm font-medium text-center">No rounds generated yet!</p>

          <p class="text-sm text-center">
            Click the <strong>Generate Program</strong> button above to generate the program.
          </p>
        </div>

        <div v-else>
          <div
            v-for="round in raceStore.rounds"
            :key="round.id"
            class="mb-4 w-72 whitespace-nowrap"
          >
            <!-- round info: number and distance -->
            <div class="bg-orange-700 px-4 py-2 w-full">
              <p class="text-white text-sm font-bold">{{ formatLapTitle(round) }}</p>
            </div>

            <UiTable class="w-full">
              <template #header>
                <th>Position</th>
                <th>Name</th>
              </template>

              <template #body>
                <tr v-for="(horseId, index) in round.horseIds" :key="horseId">
                  <td>{{ index + 1 }}</td>
                  <td>{{ getHorseName(horseId) }}</td>
                </tr>
              </template>
            </UiTable>
          </div>
        </div>
      </Transition>
    </div>
  </section>
</template>
