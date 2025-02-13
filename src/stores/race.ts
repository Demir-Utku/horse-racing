import { defineStore, acceptHMRUpdate } from 'pinia'

import { TOTAL_HORSE_COUNT } from '@/constants/horse'
import { NUMBER_OF_ROUNDS, ROUND_DISTANCES } from '@/constants/race'
import type { RoundData, RoundResult, RaceStatus } from '@/types'

import { useHorseStore } from './horse'

interface RaceState {
  raceStatus: RaceStatus
  currentRound: number
  rounds: RoundData[]
  raceResults: RoundResult[]
  // Track horse positions when paused
  pausedPositions: Record<number, { left: string; elapsedTime: number }>
}

export const useRaceStore = defineStore('race', {
  state: (): RaceState => ({
    raceStatus: 'idle',
    currentRound: 0,
    rounds: [],
    raceResults: [],
    pausedPositions: {}
  }),
  getters: {
    horsesForCurrentRound: state => {
      const round = state.rounds[state.currentRound]

      if (!round) return []

      return round.horseIds
    }
  },
  actions: {
    generateRounds() {
      const horseStore = useHorseStore()

      if (horseStore.horses.length < TOTAL_HORSE_COUNT) {
        horseStore.generateHorses()
      }

      this.rounds = []
      this.raceResults = []
      this.currentRound = 0

      for (let i = 0; i < NUMBER_OF_ROUNDS; i++) {
        // random shuffle
        const shuffledHorses = [...horseStore.horses]
          .sort(() => Math.random() - 0.5)
          .slice(0, 10)
          .map(h => h.id)

        this.rounds.push({
          id: window.crypto.randomUUID(),
          roundNumber: i + 1,
          distance: ROUND_DISTANCES[i],
          horseIds: shuffledHorses
        })
      }

      this.raceStatus = 'idle'
    },
    startRace() {
      // If status was idle or paused, set status to running
      if (this.raceStatus === 'idle' || this.raceStatus === 'paused') {
        // Clear saved positions when starting from idle
        if (this.raceStatus === 'idle') {
          this.pausedPositions = {}
        }

        this.raceStatus = 'running'
      }
    },
    pauseRace() {
      // Only pause if currently running
      if (this.raceStatus === 'running') {
        this.raceStatus = 'paused'
      }
    },
    getTimeToFinish(horseId: number, distance: number) {
      // calculate horse speed
      const horseStore = useHorseStore()

      const horse = horseStore.horses.find(h => h.id === horseId)
      if (!horse) return 0

      const baseSpeed = 15 // baseline speed (m/s)
      const conditionFactor = 0.8 // per condition point

      const speed = baseSpeed + horse.condition * conditionFactor

      if (speed <= 0) return Number.MAX_SAFE_INTEGER // fallback if speed is 0

      return distance / speed
    },
    // Save the current position of a horse when paused     */
    saveHorsePosition(horseId: number, left: string, elapsedTime: number) {
      this.pausedPositions[horseId] = { left, elapsedTime }
    },
    finishForHorse(horseId: number) {
      if (this.raceStatus !== 'running') return

      // Identify the current round
      const round = this.rounds[this.currentRound]
      if (!round) return

      // Try to find a result entry for this round
      let currentResult = this.raceResults.find(r => r.roundId === round.id)

      // Create it if it doesn't exist
      if (!currentResult) {
        currentResult = {
          roundId: round.id,
          positions: []
        }
        this.raceResults.push(currentResult)
      }

      const alreadyFinished = currentResult.positions.some(p => p.horseId === horseId)
      if (alreadyFinished) return

      const time = this.getTimeToFinish(horseId, ROUND_DISTANCES[this.currentRound])

      currentResult.positions.push({
        horseId,
        posIdx: currentResult.positions.length + 1,
        time
      })

      // If all 10 horses in this round have finished, finalize the round
      if (currentResult.positions.length === 10) {
        this.finishRound()
      }
    },
    finishRound() {
      // increment round if not last round, otherwise set status to finished
      if (this.currentRound < NUMBER_OF_ROUNDS - 1) {
        this.currentRound++
        this.raceStatus = 'idle'
      } else {
        this.raceStatus = 'finished'
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRaceStore, import.meta.hot))
}
