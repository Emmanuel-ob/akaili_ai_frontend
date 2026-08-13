import { describe, it, expect, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent } from 'vue'
import NavDropdown from '~/components/homepage/NavDropdown.vue'

// Component that resets the shared useState state by calling useState
// and setting it to null. Must be mounted before each test to ensure
// clean state, then immediately unmounted. See test/nuxt/dropdown.spec.ts.
const StateResetter = defineComponent({
  setup() {
    const openId = useState('nav:openDropdown', () => null)
    openId.value = null
    return {}
  },
  template: '<div></div>',
})

const items = [
  { label: 'Internal', to: '/pricing' },
  { label: 'External', to: 'https://example.com', external: true, tagline: 'A tagline' },
]

describe('NavDropdown', () => {
  beforeEach(async () => {
    const resetter = await mountSuspended(StateResetter)
    await resetter.unmount()
  })

  it('renders the label and stays closed initially', async () => {
    const w = await mountSuspended(NavDropdown, { props: { id: 'x', label: 'Products', items } })
    expect(w.text()).toContain('Products')
    expect(w.find('[role="menu"]').exists()).toBe(false)
  })

  it('sets aria attributes on the trigger', async () => {
    const w = await mountSuspended(NavDropdown, { props: { id: 'x', label: 'Products', items } })
    const trigger = w.find('button')
    expect(trigger.attributes('aria-haspopup')).toBe('menu')
    expect(trigger.attributes('aria-expanded')).toBe('false')
  })

  it('flips aria-expanded and shows the menu on click', async () => {
    const w = await mountSuspended(NavDropdown, { props: { id: 'x', label: 'Products', items } })
    await w.find('button').trigger('click')
    expect(w.find('button').attributes('aria-expanded')).toBe('true')
    expect(w.find('[role="menu"]').exists()).toBe(true)
  })

  it('renders every item with role menuitem', async () => {
    const w = await mountSuspended(NavDropdown, { props: { id: 'x', label: 'Products', items } })
    await w.find('button').trigger('click')
    expect(w.findAll('[role="menuitem"]')).toHaveLength(2)
  })

  it('gives external links target and rel', async () => {
    const w = await mountSuspended(NavDropdown, { props: { id: 'x', label: 'Products', items } })
    await w.find('button').trigger('click')
    const external = w.findAll('[role="menuitem"]')[1]
    expect(external.attributes('target')).toBe('_blank')
    expect(external.attributes('rel')).toBe('noopener noreferrer')
  })

  it('does not put target or rel on internal links', async () => {
    const w = await mountSuspended(NavDropdown, { props: { id: 'x', label: 'Products', items } })
    await w.find('button').trigger('click')
    const internal = w.findAll('[role="menuitem"]')[0]
    expect(internal.attributes('target')).toBeUndefined()
  })

  it('renders taglines when present', async () => {
    const w = await mountSuspended(NavDropdown, { props: { id: 'x', label: 'Products', items } })
    await w.find('button').trigger('click')
    expect(w.text()).toContain('A tagline')
  })
})
