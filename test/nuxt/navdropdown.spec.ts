import { describe, it, expect, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, nextTick } from 'vue'
import NavDropdown from '~/components/homepage/NavDropdown.vue'

// Component that resets the shared useState state by calling useState
// and setting it to null. Must be mounted before each test to ensure
// clean state, then immediately unmounted. See test/nuxt/dropdown.spec.ts.
const StateResetter = defineComponent({
  setup() {
    const openId = useState('nav:openDropdown', () => null)
    openId.value = null
    return {}
  },
  template: '<div></div>',
})

const items = [
  { label: 'Internal', to: '/pricing' },
  { label: 'External', to: 'https://example.com', external: true, tagline: 'A tagline' },
]

describe('NavDropdown', () => {
  beforeEach(async () => {
    const resetter = await mountSuspended(StateResetter)
    await resetter.unmount()
  })

  it('renders the label and stays closed initially', async () => {
    const w = await mountSuspended(NavDropdown, { props: { id: 'x', label: 'Products', items } })
    expect(w.text()).toContain('Products')
    expect(w.find('[role="menu"]').exists()).toBe(false)
  })

  it('sets aria attributes on the trigger', async () => {
    const w = await mountSuspended(NavDropdown, { props: { id: 'x', label: 'Products', items } })
    const trigger = w.find('button')
    expect(trigger.attributes('aria-haspopup')).toBe('menu')
    expect(trigger.attributes('aria-expanded')).toBe('false')
  })

  it('flips aria-expanded and shows the menu on click', async () => {
    const w = await mountSuspended(NavDropdown, { props: { id: 'x', label: 'Products', items } })
    await w.find('button').trigger('click')
    expect(w.find('button').attributes('aria-expanded')).toBe('true')
    expect(w.find('[role="menu"]').exists()).toBe(true)
  })

  it('renders every item with role menuitem', async () => {
    const w = await mountSuspended(NavDropdown, { props: { id: 'x', label: 'Products', items } })
    await w.find('button').trigger('click')
    expect(w.findAll('[role="menuitem"]')).toHaveLength(2)
  })

  it('gives external links target and rel', async () => {
    const w = await mountSuspended(NavDropdown, { props: { id: 'x', label: 'Products', items } })
    await w.find('button').trigger('click')
    const external = w.findAll('[role="menuitem"]')[1]
    expect(external.attributes('target')).toBe('_blank')
    expect(external.attributes('rel')).toBe('noopener noreferrer')
  })

  it('does not put target or rel on internal links', async () => {
    const w = await mountSuspended(NavDropdown, { props: { id: 'x', label: 'Products', items } })
    await w.find('button').trigger('click')
    const internal = w.findAll('[role="menuitem"]')[0]
    expect(internal.attributes('target')).toBeUndefined()
  })

  it('renders taglines when present', async () => {
    const w = await mountSuspended(NavDropdown, { props: { id: 'x', label: 'Products', items } })
    await w.find('button').trigger('click')
    expect(w.text()).toContain('A tagline')
  })

  // FIX 2 regression: arrow-key roving focus is only reachable if focus
  // actually lands inside the panel when it opens. Before this fix,
  // focus stayed on the trigger (a sibling of the panel) and keydown
  // never reached onPanelKeydown, so ArrowDown/Up/Home/End were dead.
  describe('keyboard behaviour', () => {
    const items3 = [
      { label: 'One', to: '/pricing' },
      { label: 'Two', to: '/about' },
      { label: 'Three', to: 'https://example.com', external: true },
    ]

    // These tests each mount with attachTo: document.body to get real
    // activeElement tracking, and each gets its own dropdown id. isOpen
    // is a computed over the single shared nav:openDropdown useState, so
    // reusing an id across two attachTo-mounted instances in the same
    // file lets a not-yet-torn-down previous instance's watchers and
    // document-level keydown listener react to this test's state changes
    // too, racing with this test's own focus calls. Unique ids make each
    // test's dropdown deaf to every other instance's state changes.
    it('moves focus to the first menu item once the panel opens', async () => {
      const w = await mountSuspended(NavDropdown, {
        props: { id: 'kb-open', label: 'Products', items: items3 },
        attachTo: document.body,
      })
      try {
        await w.find('button').trigger('click')
        await nextTick()
        const first = w.findAll('[role="menuitem"]')[0].element
        expect(document.activeElement).toBe(first)
      } finally {
        await w.unmount()
      }
    })

    // The spec required this test but nobody wrote it: closeAndRefocus
    // already existed in useDropdown, it was simply unverified.
    it('Escape closes the menu and returns focus to the trigger', async () => {
      const w = await mountSuspended(NavDropdown, {
        props: { id: 'kb-escape', label: 'Products', items: items3 },
        attachTo: document.body,
      })
      try {
        const trigger = w.find('button').element
        await w.find('button').trigger('click')
        await nextTick()
        expect(w.find('[role="menu"]').exists()).toBe(true)

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
        await nextTick()

        expect(w.find('[role="menu"]').exists()).toBe(false)
        expect(document.activeElement).toBe(trigger)
      } finally {
        await w.unmount()
      }
    })

    // FIX 1 regression: Tab used to close the menu unconditionally,
    // including while moving between two items that are both natively
    // tabbable (real anchors, not a roving-tabindex set). That destroyed
    // whichever item the browser had just focused, and focus fell back
    // to <body> mid-navigation. Moving between items must be left
    // entirely to native Tab order; the menu must stay open.
    it('Tab between items does not close the menu', async () => {
      const w = await mountSuspended(NavDropdown, {
        props: { id: 'kb-tab-mid', label: 'Products', items: items3 },
        attachTo: document.body,
      })
      try {
        await w.find('button').trigger('click')
        await nextTick()
        const menuitems = w.findAll('[role="menuitem"]').map(i => i.element)
        menuitems[0].focus()

        const panel = w.find('[role="menu"]').element
        panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))

        expect(w.find('[role="menu"]').exists()).toBe(true)

        // Still open even after the deferred-close window would have
        // fired, because this Tab press never qualified for it.
        await new Promise(requestAnimationFrame)
        await nextTick()
        expect(w.find('[role="menu"]').exists()).toBe(true)
      } finally {
        await w.unmount()
      }
    })

    // FIX 1 regression, the boundary case: Tab off the LAST item is
    // correctly allowed to close the menu (that Tab is leaving the
    // panel), but must not do so synchronously. Closing inside the
    // keydown handler would remove the still-focused last item before
    // the browser's own default Tab action gets a turn to move focus off
    // it, stranding focus on <body> and restarting sequential navigation
    // from the top of the page.
    it('defers closing on Tab off the last item so focus is never stranded', async () => {
      const w = await mountSuspended(NavDropdown, {
        props: { id: 'kb-tab-last', label: 'Products', items: items3 },
        attachTo: document.body,
      })
      try {
        await w.find('button').trigger('click')
        await nextTick()
        const menuitems = w.findAll('[role="menuitem"]').map(i => i.element)
        const last = menuitems[menuitems.length - 1]
        last.focus()

        const panel = w.find('[role="menu"]').element
        panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))

        // Not closed yet, and `last` still holds focus: the browser has
        // not performed its default Tab move yet, so we must not have
        // ripped the panel out from under it.
        expect(w.find('[role="menu"]').exists()).toBe(true)
        expect(document.activeElement).toBe(last)

        // After the browser's default focus-move would have had its
        // turn, it is safe to close.
        await new Promise(requestAnimationFrame)
        await nextTick()
        expect(w.find('[role="menu"]').exists()).toBe(false)
      } finally {
        await w.unmount()
      }
    })
  })
})
