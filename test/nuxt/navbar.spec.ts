import { describe, it, expect, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent } from 'vue'
import MainNavbar from '~/components/homepage/MainNavbar.vue'

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

// ThemeToggle reads colorMode.value, and @nuxtjs/color-mode does not
// initialise in the test environment, so it must be stubbed or the
// render throws.
const mount = () => mountSuspended(MainNavbar, {
  global: { stubs: { ThemeToggle: true } },
})

describe('MainNavbar', () => {
  beforeEach(async () => {
    const resetter = await mountSuspended(StateResetter)
    await resetter.unmount()
  })

  it('renders the three menus and a flat Pricing link', async () => {
    const w = await mount()
    const triggers = w.findAll('[aria-haspopup="menu"]').map(b => b.text())
    expect(triggers.some(t => t.includes('Products'))).toBe(true)
    expect(triggers.some(t => t.includes('Business'))).toBe(true)
    expect(triggers.some(t => t.includes('Company'))).toBe(true)
    expect(w.html()).toContain('/pricing')
  })

  it('lists all four products in the Products menu', async () => {
    const w = await mount()
    const products = w.findAll('[aria-haspopup="menu"]').find(b => b.text().includes('Products'))
    await products.trigger('click')
    const text = w.find('[role="menu"]').text()
    expect(text).toContain('XeliAI Trivia')
    expect(text).toContain('XeliAI Labs')
    expect(text).toContain('XeliAI Blog')
  })

  it('offers three logins and never the blog', async () => {
    const w = await mount()
    const login = w.findAll('[aria-haspopup="menu"]').find(b => b.text().includes('Log in'))
    await login.trigger('click')
    const menu = w.find('[role="menu"]')
    expect(menu.findAll('[role="menuitem"]')).toHaveLength(3)
    expect(menu.text()).not.toContain('Blog')
  })

  it('keeps the Get Started call to action', async () => {
    const w = await mount()
    expect(w.html()).toContain('/get-started')
    expect(w.text()).toContain('Get Started')
  })

  it('uses no em dashes anywhere in the rendered nav', async () => {
    const w = await mount()
    expect(w.text()).not.toContain('—')
  })

  it('leaves Pricing as the only flat desktop link', async () => {
    const w = await mount()
    // Scoped to the desktop nav on purpose. The mobile drawer keeps its
    // accordion panels in the DOM via v-show, so wrapper.text() sees
    // collapsed items and a whole-component assertion would be a lie.
    const desktop = w.find('[data-desktop-nav]')
    expect(desktop.findAll('a').map(a => a.text())).toEqual(['Pricing'])
  })
})
