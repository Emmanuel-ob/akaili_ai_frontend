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
})
