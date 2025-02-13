import { defineStore, acceptHMRUpdate } from 'pinia'

import type { Horse } from '@/types'
import { HORSE_NAMES, HORSE_COLORS, TOTAL_HORSE_COUNT } from '@/constants/horse'

export const useHorseStore = defineStore('horse', {
  state: (): { horses: Horse[] } => ({
    horses: []
  }),
  actions: {
    generateHorses() {
      this.horses = []

      for (let i = 0; i < TOTAL_HORSE_COUNT; i++) {
        this.horses.push({
          id: i + 1,
          name: HORSE_NAMES[i] || `Horse ${i + 1}`,
          color: HORSE_COLORS[i] || '#000',
          condition: Math.floor(Math.random() * 100) + 1
        })
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHorseStore, import.meta.hot))
}
