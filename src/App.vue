<script setup lang="ts">
import { onBeforeMount } from 'vue'

import { useHorseStore } from '@/stores/horse'

import AppHeader from './components/AppHeader.vue'
import HorseList from './components/Race/HorseList.vue'
import TrackArea from './components/Race/TrackArea.vue'
import Results from './components/Race/Results.vue'
import Program from './components/Race/Program.vue'

const horseStore = useHorseStore()

onBeforeMount(() => {
  if (!horseStore.horses.length) {
    horseStore.generateHorses()
  }
})
</script>

<template>
  <div class="flex flex-col">
    <AppHeader />

    <main class="flex-1 px-4 pb-4 flex flex-col xl:flex-row xl:flex-wrap gap-6">
      <section class="flex flex-col flex-1 md:flex-row gap-6">
        <HorseList class="min-w-[14rem] md:max-w-3xs" />

        <TrackArea class="flex-1" />
      </section>

      <section class="w-full xl:w-auto flex flex-col sm:flex-row gap-x-2 gap-y-6">
        <Program class="min-w-[12rem] w-full sm:w-1/2 xl:max-w-[14rem]" />

        <Results class="min-w-[12rem] w-full sm:w-1/2 xl:max-w-[14rem]" />
      </section>
    </main>
  </div>
</template>

<style scoped>
main {
  padding-top: 0.5rem;
}

@media (min-height: 400px) {
  main {
    padding-top: 0.75rem;
  }
}

@media (min-height: 500px) {
  main {
    padding-top: 1rem;
  }
}

@media (min-height: 600px) {
  main {
    padding-top: 1.375rem;
  }
}

@media (min-height: 700px) {
  main {
    padding-top: 1.75rem;
  }
}

@media (min-height: 800px) {
  main {
    padding-top: 2.5rem;
  }
}
</style>
