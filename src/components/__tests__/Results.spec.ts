import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Results from '../Race/Results.vue'
import { useRaceStore } from '@/stores/race'
import { useHorseStore } from '@/stores/horse'
import UiTable from '../UiTable.vue'

describe('Results.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Setup stores
    const horseStore = useHorseStore()
    const raceStore = useRaceStore()
    horseStore.generateHorses()
    raceStore.generateRounds()
  })

  it('renders the component with correct title', () => {
    const wrapper = mount(Results)
    expect(wrapper.find('h4').text()).toBe('Results')
  })

  it('shows waiting message when no race results', () => {
    const wrapper = mount(Results)
    expect(wrapper.text()).toContain('Waiting a horse to finish the round...')
  })

  it('displays race results correctly when available', async () => {
    const wrapper = mount(Results)
    const raceStore = useRaceStore()
    const horseStore = useHorseStore()

    // Simulate a finished round
    const mockResult = {
      roundId: raceStore.rounds[0].id,
      positions: [
        { horseId: horseStore.horses[0].id, posIdx: 1, time: 10 },
        { horseId: horseStore.horses[1].id, posIdx: 2, time: 12 }
      ]
    }
    raceStore.raceResults.push(mockResult)
    await wrapper.vm.$nextTick()

    // Check if results are displayed
    expect(wrapper.text()).not.toContain('Waiting a horse to finish the round...')
    expect(wrapper.findComponent(UiTable).exists()).toBe(true)

    // Verify table headers
    const headers = wrapper.findAll('th')
    expect(headers[0].text()).toBe('Position')
    expect(headers[1].text()).toBe('Name')

    // Verify result entries
    const rows = wrapper.findAll('tr')
    expect(rows.length).toBe(3) // Header + 2 results

    // Check first place
    const firstRow = rows[1]
    const firstRowCells = firstRow.findAll('td')
    expect(firstRowCells[0].text()).toBe('1')
    expect(firstRowCells[1].text()).toBe(horseStore.horses[0].name)

    // Check second place
    const secondRow = rows[2]
    const secondRowCells = secondRow.findAll('td')
    expect(secondRowCells[0].text()).toBe('2')
    expect(secondRowCells[1].text()).toBe(horseStore.horses[1].name)
  })

  it('formats lap title correctly', async () => {
    const wrapper = mount(Results)
    const raceStore = useRaceStore()

    // Add a mock result
    const mockResult = {
      roundId: raceStore.rounds[0].id,
      positions: [{ horseId: 1, posIdx: 1, time: 10 }]
    }
    raceStore.raceResults.push(mockResult)
    await wrapper.vm.$nextTick()

    const roundInfo = wrapper.find('.bg-orange-700 p')
    expect(roundInfo.text()).toContain('1. Lap')
    expect(roundInfo.text()).toContain(raceStore.rounds[0].distance + 'm')
  })

  it('handles unknown horse names gracefully', async () => {
    const wrapper = mount(Results)
    const raceStore = useRaceStore()

    // Add a result with non-existent horse ID
    const mockResult = {
      roundId: raceStore.rounds[0].id,
      positions: [{ horseId: 999999, posIdx: 1, time: 10 }]
    }
    raceStore.raceResults.push(mockResult)
    await wrapper.vm.$nextTick()

    const horseName = wrapper.find('td:nth-child(2)')
    expect(horseName.text()).toBe('Unknown')
  })

  it('displays multiple rounds in correct order', async () => {
    const wrapper = mount(Results)
    const raceStore = useRaceStore()

    // Add results for two rounds
    const mockResults = [
      {
        roundId: raceStore.rounds[0].id,
        positions: [{ horseId: 1, posIdx: 1, time: 10 }]
      },
      {
        roundId: raceStore.rounds[1].id,
        positions: [{ horseId: 2, posIdx: 1, time: 12 }]
      }
    ]
    raceStore.raceResults.push(...mockResults)
    await wrapper.vm.$nextTick()

    const roundInfos = wrapper.findAll('.bg-orange-700 p')
    expect(roundInfos).toHaveLength(2)
    expect(roundInfos[0].text()).toContain('1. Lap')
    expect(roundInfos[1].text()).toContain('2. Lap')
  })
})
