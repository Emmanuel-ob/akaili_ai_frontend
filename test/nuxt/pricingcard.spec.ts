import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PricingCard from '~/components/homepage/PricingCard.vue'

// happy-dom does no layout, so overflow itself cannot be asserted here.
// What these tests DO guard is the mechanism that caused it: a fixed
// oversized type scale, and a flex row that could neither wrap nor shrink.
//
// Every size assertion reads the class list of [data-price] specifically.
// Matching against the whole rendered HTML is not safe: the card title
// carries "text-2xl md:text-3xl", so a document-wide search for a size
// class passes even when the price is sized wrong.
const mount = (priceText: string | null) =>
  mountSuspended(PricingCard, {
    props: { planId: 'pro', title: 'Professional', priceText, priceSuffix: '/month' },
  })

const priceClasses = async (priceText: string) =>
  (await mount(priceText)).find('[data-price]').classes()

describe('PricingCard price sizing', () => {
  it('keeps the large type for a short price', async () => {
    expect(await priceClasses('Free')).toContain('md:text-5xl')
  })

  it('steps down for a long localized price so it fits the card', async () => {
    // 11 characters. text-5xl overflows a card column of roughly 314px.
    const classes = await priceClasses('\u20A6450,000.00')
    expect(classes).toContain('md:text-4xl')
    expect(classes).not.toContain('md:text-5xl')
  })

  it('steps down again for an even longer price', async () => {
    const classes = await priceClasses('\u20A61,500,000.00')
    expect(classes).toContain('md:text-3xl')
    expect(classes).not.toContain('md:text-4xl')
    expect(classes).not.toContain('md:text-5xl')
  })

  it('lets the price row wrap and shrink instead of overflowing', async () => {
    const w = await mount('\u20A6450,000.00')
    const row = w.find('[data-price]').element.parentElement as HTMLElement
    expect(row.className).toContain('flex-wrap')
    expect(w.find('[data-price]').classes()).toContain('min-w-0')
  })

  it('still renders the suffix alongside a long price', async () => {
    const w = await mount('\u20A6450,000.00')
    expect(w.text()).toContain('/month')
  })

  it('shows the skeleton and no suffix while the price is loading', async () => {
    const w = await mount(null)
    expect(w.html()).toContain('animate-pulse')
    expect(w.text()).not.toContain('/month')
  })
})
