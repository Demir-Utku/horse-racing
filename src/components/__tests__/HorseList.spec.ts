import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import HorseList from '../Race/HorseList.vue'
import { useHorseStore } from '@/stores/horse'
import UiTable from '../UiTable.vue'

describe('HorseList.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders the component with correct title', () => {
    const wrapper = mount(HorseList)
    expect(wrapper.find('h4').text()).toBe('Horse List')
  })

  it('renders UiTable component', () => {
    const wrapper = mount(HorseList)
    expect(wrapper.findComponent(UiTable).exists()).toBe(true)
  })

  it('displays correct table headers', () => {
    const wrapper = mount(HorseList)
    const headers = wrapper.findAll('th')
    expect(headers).toHaveLength(3)
    expect(headers[0].text()).toBe('Name')
    expect(headers[1].text()).toBe('Condition')
    expect(headers[2].text()).toBe('Color')
  })

  it('displays horse data correctly when horses are available', async () => {
    const wrapper = mount(HorseList)
    const store = useHorseStore()

    // Generate test horses
    store.generateHorses()
    await wrapper.vm.$nextTick()

    const rows = wrapper.findAll('tr')
    // First row is header, so we subtract 1
    expect(rows.length - 1).toBe(store.horses.length)

    // Test first horse data
    const firstHorse = store.horses[0]
    const firstRow = rows[1]
    const cells = firstRow.findAll('td')

    expect(cells[0].text()).toBe(firstHorse.name)
    expect(cells[1].text()).toBe(firstHorse.condition.toString())

    // Convert hex to rgb for comparison
    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `rgb(${r}, ${g}, ${b})`
    }

    expect(cells[2].find('span').attributes('style')).toContain(
      `background-color: ${hexToRgb(firstHorse.color)}`
    )
  })

  it('updates when horse store changes', async () => {
    const wrapper = mount(HorseList)
    const store = useHorseStore()

    // Initial state
    expect(wrapper.findAll('tr').length).toBe(1) // Just header row

    // Generate horses
    store.generateHorses()
    await wrapper.vm.$nextTick()

    // Check if table updated
    expect(wrapper.findAll('tr').length).toBeGreaterThan(1)
  })

  it('handles empty horse list gracefully', async () => {
    const wrapper = mount(HorseList)
    const store = useHorseStore()

    store.horses = []
    await wrapper.vm.$nextTick()

    // Should only have header row
    expect(wrapper.findAll('tr').length).toBe(1)
  })
})
