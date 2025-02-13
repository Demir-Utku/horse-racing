<script setup lang="ts">
import { useHorseStore } from '@/stores/horse'

import UiTable from '../UiTable.vue'

const horseStore = useHorseStore()
</script>

<template>
  <section class="flex flex-col gap-2 border rounded-md bg-white">
    <header class="px-4 py-2">
      <h4 class="text-lg xl:text-xl font-bold">Horse List</h4>
    </header>

    <div class="overflow-auto whitespace-nowrap h-[calc(100svh-10.625rem)]">
      <UiTable has-sticky-header>
        <template #header>
          <th class="px-3 py-2">Name</th>
          <th class="px-3 py-2">Condition</th>
          <th class="px-3 py-2">Color</th>
        </template>

        <template #body>
          <tr v-for="horse in horseStore.horses" :key="horse.id">
            <td>{{ horse.name }}</td>
            <td>{{ horse.condition }}</td>
            <td>
              <span
                class="w-6 h-6 rounded-full block mx-auto"
                :style="{ backgroundColor: horse.color }"
              />
            </td>
          </tr>
        </template>
      </UiTable>
    </div>
  </section>
</template>
