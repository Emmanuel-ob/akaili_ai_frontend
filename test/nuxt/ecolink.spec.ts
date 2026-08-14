import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import EcoLink from '~/components/homepage/EcoLink.vue'

describe('EcoLink', () => {
  it('renders an anchor with target and rel for external items', async () => {
    const w = await mountSuspended(EcoLink, {
      props: { item: { label: 'External', to: 'https://example.com', external: true } },
      slots: { default: () => 'External' },
    })
    const a = w.find('a')
    expect(a.exists()).toBe(true)
    expect(a.attributes('href')).toBe('https://example.com')
    expect(a.attributes('target')).toBe('_blank')
    expect(a.attributes('rel')).toBe('noopener noreferrer')
  })

  it('renders a link with neither target nor rel for internal items', async () => {
    const w = await mountSuspended(EcoLink, {
      props: { item: { label: 'Internal', to: '/pricing' } },
      slots: { default: () => 'Internal' },
    })
    const link = w.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('/pricing')
    expect(link.attributes('target')).toBeUndefined()
    expect(link.attributes('rel')).toBeUndefined()
  })

  it('renders the default slot content', async () => {
    const w = await mountSuspended(EcoLink, {
      props: { item: { label: 'Internal', to: '/pricing' } },
      slots: { default: () => 'Slot content here' },
    })
    expect(w.text()).toContain('Slot content here')
  })

  it('renders the external-link glyph and hidden text by default', async () => {
    const w = await mountSuspended(EcoLink, {
      props: { item: { label: 'External', to: 'https://example.com', external: true } },
      slots: { default: () => 'External' },
    })
    expect(w.find('svg').exists()).toBe(true)
    expect(w.text()).toContain('opens in a new tab')
  })

  // A caller with its own designed external-link treatment (the
  // ecosystem strip's large corner arrow) can suppress EcoLink's own
  // glyph so a single link does not render two arrows. The
  // visually-hidden text must survive the opt-out: it is the
  // accessibility contract, not a decoration, so screen-reader users
  // still get the context-switch warning even with the glyph hidden.
  it('suppresses only the visual glyph when show-external-icon is false, keeping the hidden text', async () => {
    const w = await mountSuspended(EcoLink, {
      props: {
        item: { label: 'External', to: 'https://example.com', external: true },
        showExternalIcon: false,
      },
      slots: { default: () => 'External' },
    })
    expect(w.find('svg').exists()).toBe(false)
    expect(w.text()).toContain('opens in a new tab')
    // Still a fully-formed external link otherwise.
    const a = w.find('a')
    expect(a.attributes('target')).toBe('_blank')
    expect(a.attributes('rel')).toBe('noopener noreferrer')
  })

  it('does not add a glyph or hidden text to internal links regardless of show-external-icon', async () => {
    const w = await mountSuspended(EcoLink, {
      props: {
        item: { label: 'Internal', to: '/pricing' },
        showExternalIcon: false,
      },
      slots: { default: () => 'Internal' },
    })
    expect(w.find('svg').exists()).toBe(false)
    expect(w.text()).not.toContain('opens in a new tab')
  })
})
