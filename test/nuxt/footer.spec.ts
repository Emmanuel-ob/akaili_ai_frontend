import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Footer from '~/components/homepage/Footer.vue'

describe('Footer', () => {
  it('does not link to the non-existent /features page', async () => {
    const w = await mountSuspended(Footer)
    expect(w.html()).not.toContain('/features')
  })

  it('renders the four column headings', async () => {
    const w = await mountSuspended(Footer)
    const headings = w.findAll('h3').map(h => h.text())
    expect(headings).toEqual(['Products', 'Business', 'Company', 'Legal'])
  })

  it('lists every product in the Products column', async () => {
    const w = await mountSuspended(Footer)
    const text = w.text()
    expect(text).toContain('XeliAI Trivia')
    expect(text).toContain('XeliAI Labs')
    expect(text).toContain('XeliAI Blog')
  })

  it('credits LiteSigma as plain text while the domain is down', async () => {
    const w = await mountSuspended(Footer)
    expect(w.text()).toContain('Powered by LiteSigma')
    expect(w.find('[data-parent-company]').element.tagName).not.toBe('A')
  })

  it('mentions LiteSigma exactly once', async () => {
    const w = await mountSuspended(Footer)
    expect(w.text().match(/LiteSigma/g)).toHaveLength(1)
  })

  it('gives every external link target and rel', async () => {
    const w = await mountSuspended(Footer)
    for (const a of w.findAll('a[target="_blank"]')) {
      expect(a.attributes('rel')).toBe('noopener noreferrer')
    }
  })

  it('uses no em dashes', async () => {
    const w = await mountSuspended(Footer)
    expect(w.text()).not.toContain('—')
  })
})
