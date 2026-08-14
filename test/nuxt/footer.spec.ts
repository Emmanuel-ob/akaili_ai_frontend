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

  it('credits LiteSigma as a live link to the .com.ng site', async () => {
    const w = await mountSuspended(Footer)
    expect(w.text()).toContain('Powered by LiteSigma Tech')

    const credit = w.find('[data-parent-company]')
    expect(credit.element.tagName).toBe('A')
    expect(credit.attributes('href')).toBe('https://www.litesigma.com.ng/')
    // It leaves the site, so it must carry the same protections as any
    // other external link.
    expect(credit.attributes('target')).toBe('_blank')
    expect(credit.attributes('rel')).toBe('noopener noreferrer')
  })

  it('shows LiteSigma in both the Company column and the credit', async () => {
    const w = await mountSuspended(Footer)
    // Two deliberate occurrences: the Company column entry and the
    // "Powered by" credit. Any other count means one of them was lost or
    // something started rendering it a third time.
    expect(w.text().match(/LiteSigma/g) ?? []).toHaveLength(2)

    const companyLink = w
      .findAll('a')
      .find(a => a.attributes('href') === 'https://www.litesigma.com.ng/' && !a.attributes('data-parent-company'))
    expect(companyLink).toBeDefined()
    expect(companyLink.attributes('target')).toBe('_blank')
    expect(companyLink.attributes('rel')).toBe('noopener noreferrer')
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
