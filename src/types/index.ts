export interface Horse {
  id: number
  name: string
  condition: number
  color: string
}

export interface RoundData {
  id: string
  roundNumber: number
  distance: number
  horseIds: number[]
}

/**
 * Corresponds to one round’s final positions.
 */
export interface RoundResult {
  roundId: string
  positions: {
    posIdx: number
    horseId: number
    time: number
  }[]
}

/**
 * Possible states for the race:
 *  - 'idle':    No race in progress (or just generated, but not started)
 *  - 'running': Currently running
 *  - 'paused':  Paused
 *  - 'finished': All rounds completed
 */
export type RaceStatus = 'idle' | 'running' | 'paused' | 'finished'
