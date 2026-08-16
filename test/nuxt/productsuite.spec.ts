import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ProductSuite from '~/components/homepage/ProductSuite.vue'

describe('ProductSuite', () => {
  it('no longer calls the section Product Suite', async () => {
    const w = await mountSuspended(ProductSuite)
    expect(w.find('h2').text()).toBe('What XeliAI does')
  })

  it('has no dead filter buttons', async () => {
    const w = await mountSuspended(ProductSuite)
    const labels = w.findAll('button').map(b => b.text())
    expect(labels).not.toContain('All')
    expect(labels).not.toContain('Support')
    expect(labels).not.toContain('Automation')
  })
})
