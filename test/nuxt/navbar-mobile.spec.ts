import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import MainNavbar from '~/components/homepage/MainNavbar.vue'

const mount = () => mountSuspended(MainNavbar, {
  global: { stubs: { ThemeToggle: true } },
})

// document.activeElement only tracks real focus for elements connected to
// the live document. mountSuspended does not attach its root to
// document.body by default, so any test asserting on activeElement must
// mount with attachTo and unmount afterwards to avoid leaking nodes
// between tests.
const mountAttached = () => mountSuspended(MainNavbar, {
  global: { stubs: { ThemeToggle: true } },
  attachTo: document.body,
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

  describe('focus trap', () => {
    const focusablesOf = (asideEl) => asideEl.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )

    it('does nothing on Tab keydown while the drawer is closed', async () => {
      const w = await mountAttached()
      try {
        const aside = w.find('aside')
        const focusables = focusablesOf(aside.element)
        const last = focusables[focusables.length - 1]

        last.focus()
        expect(document.activeElement).toBe(last)

        const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
        aside.element.dispatchEvent(event)

        // The drawer was never opened, so the trap must be inert: no
        // preventDefault, and focus must not have been redirected.
        expect(event.defaultPrevented).toBe(false)
        expect(document.activeElement).toBe(last)
      } finally {
        w.unmount()
      }
    })

    it('wraps Tab from the last focusable element to the first when open', async () => {
      const w = await mountAttached()
      try {
        await w.find('[aria-label="Open mobile menu"]').trigger('click')
        const aside = w.find('aside')
        const focusables = focusablesOf(aside.element)
        const first = focusables[0]
        const last = focusables[focusables.length - 1]

        last.focus()
        expect(document.activeElement).toBe(last)

        const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
        aside.element.dispatchEvent(event)

        expect(event.defaultPrevented).toBe(true)
        expect(document.activeElement).toBe(first)
      } finally {
        w.unmount()
      }
    })

    it('wraps Shift+Tab from the first focusable element to the last when open', async () => {
      const w = await mountAttached()
      try {
        await w.find('[aria-label="Open mobile menu"]').trigger('click')
        const aside = w.find('aside')
        const focusables = focusablesOf(aside.element)
        const first = focusables[0]
        const last = focusables[focusables.length - 1]

        first.focus()
        expect(document.activeElement).toBe(first)

        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true })
        aside.element.dispatchEvent(event)

        expect(event.defaultPrevented).toBe(true)
        expect(document.activeElement).toBe(last)
      } finally {
        w.unmount()
      }
    })

    it('closes the drawer on Escape', async () => {
      const w = await mount()
      await w.find('[aria-label="Open mobile menu"]').trigger('click')
      const aside = w.find('aside')
      expect(aside.classes()).toContain('translate-x-0')

      await aside.trigger('keydown', { key: 'Escape' })

      expect(aside.classes()).toContain('-translate-x-full')
    })
  })
})
