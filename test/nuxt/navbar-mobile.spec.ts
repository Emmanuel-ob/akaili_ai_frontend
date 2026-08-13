import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import MainNavbar from '~/components/homepage/MainNavbar.vue'

const mount = () => mountSuspended(MainNavbar, {
  global: { stubs: { ThemeToggle: true } },
})

describe('MainNavbar mobile drawer', () => {
  it('renders a section button per menu', async () => {
    const w = await mount()
    const sections = w.findAll('[data-drawer-section]').map(b => b.text())
    expect(sections).toEqual(['Products', 'Business', 'Company'])
  })

  it('expands a section on click', async () => {
    const w = await mount()
    const products = w.findAll('[data-drawer-section]')[0]
    expect(products.attributes('aria-expanded')).toBe('false')
    await products.trigger('click')
    expect(products.attributes('aria-expanded')).toBe('true')
    expect(w.find('#drawer-panel-products').text()).toContain('XeliAI Trivia')
  })

  it('collapses the open section when another opens', async () => {
    const w = await mount()
    const [products, business] = w.findAll('[data-drawer-section]')
    await products.trigger('click')
    await business.trigger('click')
    expect(products.attributes('aria-expanded')).toBe('false')
    expect(business.attributes('aria-expanded')).toBe('true')
  })

  it('offers the logins in the drawer', async () => {
    const w = await mount()
    expect(w.find('[data-drawer-logins]').findAll('a')).toHaveLength(3)
  })
})
