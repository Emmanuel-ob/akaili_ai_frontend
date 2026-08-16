import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import EcosystemStrip from '~/components/homepage/EcosystemStrip.vue'

describe('EcosystemStrip', () => {
  it('shows the three sibling products and not XeliAI itself', async () => {
    const w = await mountSuspended(EcosystemStrip)
    const cards = w.findAll('[data-ecosystem-card]')
    expect(cards).toHaveLength(3)
    expect(w.text()).toContain('XeliAI Trivia')
    expect(w.text()).toContain('XeliAI Labs')
    expect(w.text()).toContain('XeliAI Blog')
  })

  it('renders each tagline', async () => {
    const w = await mountSuspended(EcosystemStrip)
    expect(w.text()).toContain('Turn any study material into adaptive practice')
  })

  it('opens every card in a new tab safely', async () => {
    const w = await mountSuspended(EcosystemStrip)
    for (const card of w.findAll('[data-ecosystem-card]')) {
      expect(card.attributes('target')).toBe('_blank')
      expect(card.attributes('rel')).toBe('noopener noreferrer')
    }
  })

  it('uses no em dashes', async () => {
    const w = await mountSuspended(EcosystemStrip)
    expect(w.text()).not.toContain('—')
  })
})
