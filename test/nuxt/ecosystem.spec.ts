import { describe, it, expect } from 'vitest'
import { buildProducts, menus, parentCompany } from '~/utils/ecosystem'

const urls = {
  triviaUrl: 'https://trivia.example.com',
  labsUrl: 'https://labs.example.com',
  blogUrl: 'https://blog.example.com',
}

describe('ecosystem registry', () => {
  it('returns the four products in order', () => {
    expect(buildProducts(urls).map(p => p.id)).toEqual(['xeliai', 'trivia', 'labs', 'blog'])
  })

  it('gives every product the required fields', () => {
    for (const p of buildProducts(urls)) {
      expect(p.name).toBeTruthy()
      expect(p.tagline).toBeTruthy()
      expect(p.href).toBeTruthy()
      expect(typeof p.external).toBe('boolean')
    }
  })

  it('marks only the blog as having no login', () => {
    const noLogin = buildProducts(urls).filter(p => p.loginHref === null)
    expect(noLogin.map(p => p.id)).toEqual(['blog'])
  })

  it('points XeliAI at /products, not the site root', () => {
    const xeliai = buildProducts(urls).find(p => p.id === 'xeliai')
    expect(xeliai.href).toBe('/products')
    expect(xeliai.external).toBe(false)
  })

  it('builds sibling URLs from the values it is given', () => {
    const built = buildProducts(urls)
    expect(built.find(p => p.id === 'trivia').loginHref).toBe('https://trivia.example.com/auth/login')
    expect(built.find(p => p.id === 'labs').loginHref).toBe('https://labs.example.com')
    expect(built.find(p => p.id === 'blog').href).toBe('https://blog.example.com')
  })

  it('uses no em dashes in any user-facing string', () => {
    const copy = [
      ...buildProducts(urls).flatMap(p => [p.name, p.tagline]),
      ...menus.business.map(i => i.label),
      ...menus.company.map(i => i.label),
      parentCompany.name,
    ]
    for (const s of copy) expect(s).not.toContain('—')
  })

  it('links menus only to pages that exist', () => {
    const internal = [...menus.business, ...menus.company]
      .filter(i => !i.external)
      .map(i => i.to)
    const realPages = ['/pricing', '/referrals', '/contact', '/get-started', '/about', '/terms', '/privacy']
    for (const to of internal) expect(realPages).toContain(to)
  })

  it('points LiteSigma at the live .com.ng domain, linked', () => {
    expect(parentCompany.name).toBe('LiteSigma Tech')
    // The .com does not resolve; the real site is the .com.ng.
    expect(parentCompany.url).toBe('https://www.litesigma.com.ng/')
    expect(parentCompany.linkEnabled).toBe(true)
  })

  it('lists LiteSigma in the Company menu as an external link', () => {
    const liteSigma = menus.company.find(i => i.label === 'LiteSigma Tech')
    expect(liteSigma).toBeDefined()
    expect(liteSigma.external).toBe(true)
    // Same URL as the footer credit, from the same constant.
    expect(liteSigma.to).toBe(parentCompany.url)
  })
})
