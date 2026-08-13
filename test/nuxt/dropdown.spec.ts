import { describe, it, expect, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h } from 'vue'
import { useDropdown } from '~/composables/useDropdown'

// Component that resets the shared useState state by calling useState
// and setting it to null. Must be mounted before each test to ensure
// clean state, then immediately unmounted.
const StateResetter = defineComponent({
  setup() {
    const openId = useState('nav:openDropdown', () => null)
    openId.value = null
    return {}
  },
  template: '<div></div>',
})

// The returned object is flattened deliberately. Vue only unwraps refs
// returned at the top level of setup, so `this.a.isOpen` would stay a
// Ref and read as truthy forever.
const Harness = defineComponent({
  setup() {
    const a = useDropdown('a')
    const b = useDropdown('b')
    return {
      aOpen: a.isOpen,
      bOpen: b.isOpen,
      aToggle: a.toggle,
      bToggle: b.toggle,
    }
  },
  render() {
    return h('div', [
      h('button', { id: 'ta', onClick: () => this.aToggle() }, 'A'),
      h('button', { id: 'tb', onClick: () => this.bToggle() }, 'B'),
      this.aOpen ? h('div', { id: 'pa' }, 'panel a') : null,
      this.bOpen ? h('div', { id: 'pb' }, 'panel b') : null,
    ])
  },
})

describe('useDropdown', () => {
  beforeEach(async () => {
    // Reset the shared useState state before each test by mounting and
    // unmounting a component that explicitly sets it to null. This ensures
    // each test starts with a clean state, even when tests are run in suite.
    const resetter = await mountSuspended(StateResetter)
    await resetter.unmount()
  })

  it('starts closed', async () => {
    const w = await mountSuspended(Harness)
    expect(w.find('#pa').exists()).toBe(false)
  })

  it('opens on toggle', async () => {
    const w = await mountSuspended(Harness)
    await w.find('#ta').trigger('click')
    expect(w.find('#pa').exists()).toBe(true)
  })

  it('closes on a second toggle', async () => {
    const w = await mountSuspended(Harness)
    await w.find('#ta').trigger('click')
    await w.find('#ta').trigger('click')
    expect(w.find('#pa').exists()).toBe(false)
  })

  it('opening one closes the other', async () => {
    const w = await mountSuspended(Harness)
    await w.find('#ta').trigger('click')
    await w.find('#tb').trigger('click')
    expect(w.find('#pa').exists()).toBe(false)
    expect(w.find('#pb').exists()).toBe(true)
  })

  it('closes on Escape', async () => {
    const w = await mountSuspended(Harness)
    await w.find('#ta').trigger('click')
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await w.vm.$nextTick()
    expect(w.find('#pa').exists()).toBe(false)
  })
})
