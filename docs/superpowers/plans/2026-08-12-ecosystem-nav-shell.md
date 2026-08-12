# XeliAI Ecosystem Nav Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the XeliAI landing page into the hub for the product family, with a Products menu, Business and Company menus, a Log in dropdown that routes to each product's own login, and a "Powered by LiteSigma" footer credit.

**Architecture:** One registry (`app/utils/ecosystem.js`) is the single source of truth for products and menus. A `useEcosystem()` composable resolves product URLs from `runtimeConfig.public` at call time. A `useDropdown()` composable holds all open/close, keyboard and click-outside logic, shared by all four dropdowns. Nothing hardcodes a product name or URL outside the registry.

**Tech Stack:** Nuxt 4, Vue 3, Pinia, Tailwind 4, vitest + `@nuxt/test-utils`.

**Design doc:** `docs/superpowers/specs/2026-08-12-ecosystem-nav-shell-design.md`

---

## Global Constraints

These apply to every task. Read them once, obey them throughout.

- **Branch:** work on `dev`. Commit after every task. Do not push without asking.
- **No em dashes in user-facing copy.** No `—` in any tagline, label, heading, button or footer string. Use a comma or a full stop. This applies to strings a visitor reads, not to code comments.
- **No new npm dependencies.** Everything needed is installed. `@pinia/testing` is *not* installed and must not be added; it is not needed.
- **Test command is `npx vitest run`.** Not `npm run test` — that runs bare `vitest`, which watches in a TTY and will hang an agent.
- **All test files live in `test/nuxt/`** and must end in `.spec.ts` or `.test.ts`. The vitest config has exactly one project, `nuxt`, whose include glob is `test/nuxt/*.{test,spec}.ts`. A test placed anywhere else silently does not run.
- **Any test that mounts `MainNavbar` MUST stub `ThemeToggle`.** `ThemeToggle.vue:19` reads `colorMode.value`, and `@nuxtjs/color-mode` fails to initialise in the test environment, so `colorMode` is `undefined` and the render throws. Use `global: { stubs: { ThemeToggle: true } }`. This is verified, not theoretical.
- **Expect this stderr line in every test run — it is harmless:**
  `[nuxt] error caught during app initialization TypeError: Cannot read properties of undefined (reading 'preference')`
  It comes from the color-mode plugin. Tests still pass. Do not try to fix it.
- **Never use module-level `ref()` for shared state.** On the server that leaks state between requests. Use Nuxt's `useState()`.
- **External links always get** `target="_blank"` and `rel="noopener noreferrer"`.
- **Do not touch** `app/stores/`, `app/middleware/`, `app/pages/dashboard/`, `app/pages/checkout.vue`, `app/pages/payment/`, or anything under `lite_sigma_chat_agent_backend/`.

**Verified environment facts** (probed on 2026-08-12, rely on these):

- `mountSuspended` from `@nuxt/test-utils/runtime` works.
- `Footer.vue` mounts with no stubs.
- `MainNavbar.vue` mounts only with `ThemeToggle` stubbed.
- Vue Router already warns `No match found for location with path "/features"` when the current Footer renders. That is defect B2, confirmed by the router itself.

---

## File Structure

**Create**

| File | Responsibility |
|---|---|
| `app/utils/ecosystem.js` | Pure data + `buildProducts(urls)`. No Nuxt context, no side effects. |
| `app/composables/useEcosystem.js` | Resolves registry URLs from `runtimeConfig.public`. |
| `app/composables/useDropdown.js` | Open/close state, Escape, click-outside, route-change close, one-open-at-a-time. |
| `app/components/homepage/NavDropdown.vue` | One dropdown menu. Used four times. |
| `app/components/homepage/EcosystemStrip.vue` | Landing-page family section. |
| `test/nuxt/ecosystem.spec.ts` | Registry shape and filtering. |
| `test/nuxt/navbar.spec.ts` | Nav menus, login dropdown, a11y. |
| `test/nuxt/footer.spec.ts` | Footer columns, LiteSigma credit, `/features` regression. |

**Modify**

| File | Change |
|---|---|
| `nuxt.config.ts` | Three `runtimeConfig.public` URL entries. |
| `app/components/homepage/MainNavbar.vue` | Menus, login dropdown, mobile accordions. Fixes B3, B4, B5. |
| `app/components/homepage/Footer.vue` | Registry-driven columns, legal bar. Fixes B1, B2. |
| `app/components/homepage/ProductSuite.vue` | Heading rename. Fixes B6. |
| `app/pages/index.vue` | Mount `EcosystemStrip`. |
| `app/utils/data.js` | Remove `navLinks` once nothing imports it. |

---

## Task 1: The registry and its config

**Files:**
- Create: `app/utils/ecosystem.js`
- Create: `app/composables/useEcosystem.js`
- Modify: `nuxt.config.ts` (the `runtimeConfig.public` block, currently around line 78)
- Test: `test/nuxt/ecosystem.spec.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `buildProducts({ triviaUrl, labsUrl, blogUrl }) → Product[]`
  - `Product = { id, name, tagline, href, loginHref, external }` where `id` is one of `'xeliai' | 'trivia' | 'labs' | 'blog'`, `loginHref` is `string | null`, `external` is `boolean`
  - `menus = { business: MenuItem[], company: MenuItem[] }`, `MenuItem = { label, to, external? }`
  - `parentCompany = { name, url, linkEnabled }`
  - `useEcosystem() → { products, loginProducts, menus, parentCompany }`

- [ ] **Step 1: Write the failing test**

Create `test/nuxt/ecosystem.spec.ts`:

```ts
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

  it('keeps the LiteSigma link disabled while the domain is down', () => {
    expect(parentCompany.name).toBe('LiteSigma')
    expect(parentCompany.linkEnabled).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/nuxt/ecosystem.spec.ts`
Expected: FAIL with `Failed to resolve import "~/utils/ecosystem"`.

- [ ] **Step 3: Write the registry**

Create `app/utils/ecosystem.js`:

```js
// ~/utils/ecosystem.js
// Single source of truth for the XeliAI product family.
// The navbar, mobile drawer, login menu and footer all read from here.
// Sibling URLs are injected so this file stays pure and testable.

export function buildProducts({ triviaUrl, labsUrl, blogUrl }) {
  return [
    {
      id: 'xeliai',
      name: 'XeliAI',
      tagline: 'AI chatbot trained on your business data',
      href: '/products',
      loginHref: '/login',
      external: false,
    },
    {
      id: 'trivia',
      name: 'XeliAI Trivia',
      tagline: 'Turn any study material into adaptive practice',
      href: triviaUrl,
      loginHref: `${triviaUrl}/auth/login`,
      external: true,
    },
    {
      id: 'labs',
      name: 'XeliAI Labs',
      tagline: 'Courses, mentorship and talent',
      // Labs has no working auth yet, so this points at its home page.
      loginHref: labsUrl,
      href: labsUrl,
      external: true,
    },
    {
      id: 'blog',
      name: 'XeliAI Blog',
      tagline: 'Product news and writing',
      href: blogUrl,
      loginHref: null, // no login: excluded from the login menu
      external: true,
    },
  ]
}

export const menus = {
  business: [
    { label: 'Pricing', to: '/pricing' },
    { label: 'Referral Program', to: '/referrals' },
    { label: 'Talk to sales', to: '/contact' },
    { label: 'Get started', to: '/get-started' },
  ],
  company: [
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Terms', to: '/terms' },
    { label: 'Privacy', to: '/privacy' },
  ],
}

export const parentCompany = {
  name: 'LiteSigma',
  url: 'https://litesigma.com',
  // litesigma.com does not resolve as of 2026-08-12. Flip to true when it does.
  linkEnabled: false,
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/nuxt/ecosystem.spec.ts`
Expected: PASS, 8 tests.

- [ ] **Step 5: Add the runtime config**

In `nuxt.config.ts`, inside the existing `runtimeConfig.public` object, add three entries alongside `apiBase`:

```ts
      triviaUrl: process.env.NUXT_PUBLIC_TRIVIA_URL || "https://trivia.xeliai.com",
      labsUrl: process.env.NUXT_PUBLIC_LABS_URL || "https://labs.xeliai.com",
      blogUrl: process.env.NUXT_PUBLIC_BLOG_URL || "https://blog.xeliai.com",
```

Do not remove or reorder anything already in that block.

- [ ] **Step 6: Write the composable**

Create `app/composables/useEcosystem.js`:

```js
// ~/composables/useEcosystem.js
import { buildProducts, menus, parentCompany } from '~/utils/ecosystem'

export function useEcosystem() {
  const config = useRuntimeConfig()

  const products = buildProducts({
    triviaUrl: config.public.triviaUrl,
    labsUrl: config.public.labsUrl,
    blogUrl: config.public.blogUrl,
  })

  return {
    products,
    // Products you can actually log in to. The blog has loginHref: null.
    loginProducts: products.filter(p => p.loginHref !== null),
    menus,
    parentCompany,
  }
}
```

- [ ] **Step 7: Run the whole suite**

Run: `npx vitest run`
Expected: PASS, 8 tests.

- [ ] **Step 8: Commit**

```bash
git add app/utils/ecosystem.js app/composables/useEcosystem.js nuxt.config.ts test/nuxt/ecosystem.spec.ts
git commit -m "feat(nav): add the ecosystem product registry

Single source of truth for the product family, consumed by the navbar,
mobile drawer, login menu and footer. Sibling URLs come from
runtimeConfig.public so a staging build does not link into production."
```

---

## Task 2: The dropdown composable

**Files:**
- Create: `app/composables/useDropdown.js`
- Test: `test/nuxt/dropdown.spec.ts`

**Interfaces:**
- Consumes: nothing from Task 1.
- Produces: `useDropdown(id: string) → { isOpen: ComputedRef<boolean>, open(), close(), toggle(), closeAndRefocus(), triggerRef: Ref, panelRef: Ref }`

Shared open state lives in `useState('nav:openDropdown')`, which is SSR-safe and gives one-open-at-a-time for free.

- [ ] **Step 1: Write the failing test**

Create `test/nuxt/dropdown.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h } from 'vue'
import { useDropdown } from '~/composables/useDropdown'

// The returned object is flattened deliberately. Vue only unwraps refs
// returned at the top level of setup, so `this.a.isOpen` would stay a
// Ref and read as truthy forever.
const Harness = defineComponent({
  setup() {
    const a = useDropdown('a')
    const b = useDropdown('b')
    return {
      aOpen: a.isOpen,
      bOpen: b.isOpen,
      aToggle: a.toggle,
      bToggle: b.toggle,
    }
  },
  render() {
    return h('div', [
      h('button', { id: 'ta', onClick: () => this.aToggle() }, 'A'),
      h('button', { id: 'tb', onClick: () => this.bToggle() }, 'B'),
      this.aOpen ? h('div', { id: 'pa' }, 'panel a') : null,
      this.bOpen ? h('div', { id: 'pb' }, 'panel b') : null,
    ])
  },
})

describe('useDropdown', () => {
  it('starts closed', async () => {
    const w = await mountSuspended(Harness)
    expect(w.find('#pa').exists()).toBe(false)
  })

  it('opens on toggle', async () => {
    const w = await mountSuspended(Harness)
    await w.find('#ta').trigger('click')
    expect(w.find('#pa').exists()).toBe(true)
  })

  it('closes on a second toggle', async () => {
    const w = await mountSuspended(Harness)
    await w.find('#ta').trigger('click')
    await w.find('#ta').trigger('click')
    expect(w.find('#pa').exists()).toBe(false)
  })

  it('opening one closes the other', async () => {
    const w = await mountSuspended(Harness)
    await w.find('#ta').trigger('click')
    await w.find('#tb').trigger('click')
    expect(w.find('#pa').exists()).toBe(false)
    expect(w.find('#pb').exists()).toBe(true)
  })

  it('closes on Escape', async () => {
    const w = await mountSuspended(Harness)
    await w.find('#ta').trigger('click')
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await w.vm.$nextTick()
    expect(w.find('#pa').exists()).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/nuxt/dropdown.spec.ts`
Expected: FAIL with `useDropdown is not defined`.

- [ ] **Step 3: Write the composable**

Create `app/composables/useDropdown.js`:

```js
// ~/composables/useDropdown.js
// Shared open/close behaviour for every nav dropdown.
// Open state lives in useState, not a module-level ref, because a
// module-level ref leaks state between requests during SSR.
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'

export function useDropdown(id) {
  const openId = useState('nav:openDropdown', () => null)
  const triggerRef = ref(null)
  const panelRef = ref(null)

  const isOpen = computed(() => openId.value === id)

  const open = () => { openId.value = id }
  const close = () => { if (openId.value === id) openId.value = null }
  const toggle = () => (isOpen.value ? close() : open())

  // Used by Escape and by selecting an item: focus must go back to the
  // trigger, or keyboard users are dumped at the top of the document.
  const closeAndRefocus = () => {
    const el = triggerRef.value?.$el ?? triggerRef.value
    close()
    el?.focus?.()
  }

  const onDocumentClick = (event) => {
    if (!isOpen.value) return
    const trigger = triggerRef.value?.$el ?? triggerRef.value
    const panel = panelRef.value?.$el ?? panelRef.value
    if (trigger?.contains(event.target)) return
    if (panel?.contains(event.target)) return
    close()
  }

  const onKeydown = (event) => {
    if (!isOpen.value) return
    if (event.key === 'Escape') {
      event.preventDefault()
      closeAndRefocus()
    }
  }

  onMounted(() => {
    document.addEventListener('click', onDocumentClick)
    document.addEventListener('keydown', onKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('click', onDocumentClick)
    document.removeEventListener('keydown', onKeydown)
  })

  // Navigating away must not leave a menu hanging open.
  const router = useRouter()
  watch(() => router.currentRoute.value.fullPath, () => close())

  return { isOpen, open, close, toggle, closeAndRefocus, triggerRef, panelRef }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/nuxt/dropdown.spec.ts`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add app/composables/useDropdown.js test/nuxt/dropdown.spec.ts
git commit -m "feat(nav): add useDropdown composable

Shared open/close, Escape-to-close-and-refocus, click-outside and
route-change handling for all four nav dropdowns. Replaces the single
hardcoded document.querySelector('[data-profile-menu]') selector, which
closed the wrong menu once more than one existed.

Open state uses useState rather than a module-level ref, which would
leak between requests during SSR."
```

---

## Task 3: The NavDropdown component

**Files:**
- Create: `app/components/homepage/NavDropdown.vue`
- Test: `test/nuxt/navdropdown.spec.ts`

**Interfaces:**
- Consumes: `useDropdown` from Task 2.
- Produces: a component taking props `id: string`, `label: string`, `items: Array<{ label, to, external?, tagline? }>`, `align?: 'start' | 'end'` (default `'start'`).

- [ ] **Step 1: Write the failing test**

Create `test/nuxt/navdropdown.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import NavDropdown from '~/components/homepage/NavDropdown.vue'

const items = [
  { label: 'Internal', to: '/pricing' },
  { label: 'External', to: 'https://example.com', external: true, tagline: 'A tagline' },
]

describe('NavDropdown', () => {
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
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/nuxt/navdropdown.spec.ts`
Expected: FAIL with `Failed to resolve import "~/components/homepage/NavDropdown.vue"`.

- [ ] **Step 3: Write the component**

Create `app/components/homepage/NavDropdown.vue`:

```vue
<!-- components/homepage/NavDropdown.vue -->
<script setup>
import { ChevronDown } from 'lucide-vue-next'
import { useDropdown } from '~/composables/useDropdown'

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  items: { type: Array, required: true },
  align: { type: String, default: 'start' },
})

const { isOpen, toggle, close, closeAndRefocus, triggerRef, panelRef } = useDropdown(props.id)

// Roving focus through the menu with the arrow keys.
const onPanelKeydown = (event) => {
  const focusables = Array.from(panelRef.value?.querySelectorAll('[role="menuitem"]') ?? [])
  if (!focusables.length) return
  const current = focusables.indexOf(document.activeElement)

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    focusables[(current + 1) % focusables.length].focus()
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    focusables[(current - 1 + focusables.length) % focusables.length].focus()
  } else if (event.key === 'Home') {
    event.preventDefault()
    focusables[0].focus()
  } else if (event.key === 'End') {
    event.preventDefault()
    focusables[focusables.length - 1].focus()
  } else if (event.key === 'Tab') {
    close()
  }
}
</script>

<template>
  <div class="relative">
    <button
      ref="triggerRef"
      type="button"
      class="flex items-center gap-1 px-2 py-1 rounded-md font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
      aria-haspopup="menu"
      :aria-expanded="isOpen ? 'true' : 'false'"
      @click.stop="toggle"
    >
      {{ label }}
      <ChevronDown
        class="w-4 h-4 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        aria-hidden="true"
      />
    </button>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        ref="panelRef"
        role="menu"
        :aria-label="label"
        class="absolute mt-2 w-72 rounded-xl shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black/5 border border-gray-100 dark:border-slate-700 p-2 z-50"
        :class="align === 'end' ? 'right-0' : 'left-0'"
        @keydown="onPanelKeydown"
      >
        <component
          :is="item.external ? 'a' : 'NuxtLink'"
          v-for="item in items"
          :key="item.label"
          role="menuitem"
          :href="item.external ? item.to : undefined"
          :to="item.external ? undefined : item.to"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'noopener noreferrer' : undefined"
          class="block px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-slate-700 hover:text-purple-600 transition-colors"
          @click="closeAndRefocus"
        >
          <span class="font-medium">{{ item.label }}</span>
          <span v-if="item.tagline" class="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {{ item.tagline }}
          </span>
        </component>
      </div>
    </Transition>
  </div>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/nuxt/navdropdown.spec.ts`
Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add app/components/homepage/NavDropdown.vue test/nuxt/navdropdown.spec.ts
git commit -m "feat(nav): add NavDropdown component

One accessible dropdown used four times: Products, Business, Company and
Log in. Arrow key roving focus, aria-haspopup and aria-expanded on the
trigger, role=menu and role=menuitem on the panel, and target plus rel on
every external link."
```

---

## Task 4: Rewire the desktop navbar

**Files:**
- Modify: `app/components/homepage/MainNavbar.vue`
- Test: `test/nuxt/navbar.spec.ts`

**Interfaces:**
- Consumes: `useEcosystem()` (Task 1), `NavDropdown` (Task 3).
- Produces: nothing consumed by later tasks.

Replace the desktop `navLinks` loop with three `NavDropdown`s plus a flat Pricing link. Replace the logged-out `Get Started` block with a `Log in` dropdown followed by `Get Started`. Keep the authenticated profile menu working, adding the sibling products beneath a divider. Delete the `handleClickOutside` function and its `onMounted`/`onUnmounted` listeners; `useDropdown` owns that now.

- [ ] **Step 1: Write the failing test**

Create `test/nuxt/navbar.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import MainNavbar from '~/components/homepage/MainNavbar.vue'

// ThemeToggle reads colorMode.value, and @nuxtjs/color-mode does not
// initialise in the test environment, so it must be stubbed or the
// render throws.
const mount = () => mountSuspended(MainNavbar, {
  global: { stubs: { ThemeToggle: true } },
})

describe('MainNavbar', () => {
  it('renders the three menus and a flat Pricing link', async () => {
    const w = await mount()
    const triggers = w.findAll('[aria-haspopup="menu"]').map(b => b.text())
    expect(triggers.some(t => t.includes('Products'))).toBe(true)
    expect(triggers.some(t => t.includes('Business'))).toBe(true)
    expect(triggers.some(t => t.includes('Company'))).toBe(true)
    expect(w.html()).toContain('/pricing')
  })

  it('lists all four products in the Products menu', async () => {
    const w = await mount()
    const products = w.findAll('[aria-haspopup="menu"]').find(b => b.text().includes('Products'))
    await products.trigger('click')
    const text = w.find('[role="menu"]').text()
    expect(text).toContain('XeliAI Trivia')
    expect(text).toContain('XeliAI Labs')
    expect(text).toContain('XeliAI Blog')
  })

  it('offers three logins and never the blog', async () => {
    const w = await mount()
    const login = w.findAll('[aria-haspopup="menu"]').find(b => b.text().includes('Log in'))
    await login.trigger('click')
    const menu = w.find('[role="menu"]')
    expect(menu.findAll('[role="menuitem"]')).toHaveLength(3)
    expect(menu.text()).not.toContain('Blog')
  })

  it('keeps the Get Started call to action', async () => {
    const w = await mount()
    expect(w.html()).toContain('/get-started')
    expect(w.text()).toContain('Get Started')
  })

  it('uses no em dashes anywhere in the rendered nav', async () => {
    const w = await mount()
    expect(w.text()).not.toContain('—')
  })

  it('leaves Pricing as the only flat desktop link', async () => {
    const w = await mount()
    // Scoped to the desktop nav on purpose. The mobile drawer keeps its
    // accordion panels in the DOM via v-show, so wrapper.text() sees
    // collapsed items and a whole-component assertion would be a lie.
    const desktop = w.find('[data-desktop-nav]')
    expect(desktop.findAll('a').map(a => a.text())).toEqual(['Pricing'])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/nuxt/navbar.spec.ts`
Expected: FAIL — no element matches `[aria-haspopup="menu"]` with text `Products`.

- [ ] **Step 3: Update the script block**

In `app/components/homepage/MainNavbar.vue`, replace the whole `<script setup>` block with:

```vue
<script setup>
import { ref, computed } from 'vue'
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/authStore'
import { useEcosystem } from '~/composables/useEcosystem'
import { useDropdown } from '~/composables/useDropdown'
import ThemeToggle from '../ui/ThemeToggle.vue'
import NavDropdown from './NavDropdown.vue'

const authStore = useAuthStore()
const router = useRouter()
const navOpen = ref(false)

const { products, loginProducts, menus } = useEcosystem()

const isAuthenticated = computed(() => authStore.isLoggedIn)
const user = computed(() => authStore.user)

// Products carry taglines; the other menus are plain link lists.
const productItems = products.map(p => ({
  label: p.name,
  to: p.href,
  external: p.external,
  tagline: p.tagline,
}))

// Every product you can log in to. The blog has loginHref: null, so it
// is absent here by construction.
const loginItems = loginProducts.map(p => ({
  label: p.name,
  to: p.loginHref,
  external: p.external,
}))

// Sibling products shown under the profile menu when signed in. This
// menu knows nothing about their sessions, only where they live.
const siblingItems = products.filter(p => p.external).map(p => ({
  label: p.name,
  to: p.href,
  external: true,
}))

const openNav = () => (navOpen.value = true)
const closeNav = () => (navOpen.value = false)

// Destructured into top-level consts on purpose. Vue's string template
// ref (ref="name") only binds to a top-level ref, so ref="profile.triggerRef"
// would silently never bind.
const {
  isOpen: profileOpen,
  toggle: toggleProfile,
  close: closeProfile,
  triggerRef: profileTriggerRef,
  panelRef: profilePanelRef,
} = useDropdown('profile')

const handleLogout = async () => {
  await authStore.logout()
  closeProfile()
  router.push('/login')
}

const goToDashboard = () => {
  closeProfile()
  router.push('/dashboard')
}

// Mobile accordion state.
const openSection = ref(null)
const toggleSection = (key) => (openSection.value = openSection.value === key ? null : key)
</script>
```

Note what disappeared: the `navLinks` import, `profileMenuOpen`, `toggleProfileMenu`, `handleClickOutside`, `ChevronDown`, and both lifecycle hooks. `useDropdown` and `NavDropdown` own all of it now.

- [ ] **Step 4: Replace the desktop nav markup**

In the template, replace the `<!-- Desktop Nav -->` block (the `div` containing the `v-for` over `navLinks`) with:

```vue
      <!-- Desktop Nav -->
      <div data-desktop-nav class="hidden lg:flex items-center space-x-6">
        <NavDropdown id="products" label="Products" :items="productItems" />
        <NavDropdown id="business" label="Business" :items="menus.business" />
        <NavDropdown id="company" label="Company" :items="menus.company" />
        <NuxtLink
          to="/pricing"
          class="px-2 py-1 rounded-md font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
        >
          Pricing
        </NuxtLink>
      </div>
```

- [ ] **Step 5: Replace the logged-out button with the login dropdown**

Replace the `<!-- Get Started Button -->` `NuxtLink` block with:

```vue
        <!-- Log in menu + primary CTA -->
        <div v-else class="hidden lg:flex items-center gap-3">
          <NavDropdown id="login" label="Log in" :items="loginItems" align="end" />
          <NuxtLink to="/get-started">
            <button
              class="px-8 py-3 nav_primary_btn text-white rounded-lg transition-transform hover:-translate-y-0.5 shadow-lg shadow-purple-500/20"
            >
              Get Started
            </button>
          </NuxtLink>
        </div>
```

- [ ] **Step 6: Update the authenticated profile menu**

In the authenticated block: change `@click.stop="toggleProfileMenu"` to `@click.stop="toggleProfile"`, add `ref="profileTriggerRef"` to that button, replace both `v-if="profileMenuOpen"` and `:class="{ 'rotate-180': profileMenuOpen }"` with `profileOpen`, replace `:aria-expanded="profileMenuOpen"` with `:aria-expanded="profileOpen ? 'true' : 'false'"`, add `ref="profilePanelRef"` to the panel div, and add this divider and sibling list directly after the Logout button, still inside the panel's `<div class="p-2">`:

```vue
                <div class="my-2 border-t border-gray-100 dark:border-slate-700"></div>
                <p class="px-4 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  More from XeliAI
                </p>
                <a
                  v-for="item in siblingItems"
                  :key="item.label"
                  :href="item.to"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-slate-700 hover:text-purple-600 rounded-md transition-colors"
                  role="menuitem"
                >
                  {{ item.label }}
                </a>
```

Also remove `data-profile-menu` from the wrapper div; nothing reads it now.

- [ ] **Step 7: Run test to verify it passes**

Run: `npx vitest run test/nuxt/navbar.spec.ts`
Expected: PASS, 6 tests.

- [ ] **Step 8: Verify nothing else imports navLinks**

Run: `npx vitest run` then check the app builds.
Run: `npx nuxt build`
Expected: build succeeds. If it fails on a missing `navLinks` import, find the importer and migrate it before continuing.

- [ ] **Step 9: Commit**

```bash
git add app/components/homepage/MainNavbar.vue test/nuxt/navbar.spec.ts
git commit -m "feat(nav): OpenAI-style product, business and company menus

Seven flat links become three dropdowns plus Pricing, which stays top
level because it is the highest intent page on the site. Adds a Log in
dropdown routing to each product's own login, mirroring how openai.com
sends people to chatgpt.com and platform.openai.com separately.

The menu never implies knowledge of a Trivia or Labs session: authStore
holds a XeliAI token only, and those are separate auth systems on
separate domains.

Removes the dead ChevronDown affordance, which rendered for a link.more
field that was empty on every entry and had no dropdown behind it."
```

---

## Task 5: The mobile drawer

**Files:**
- Modify: `app/components/homepage/MainNavbar.vue` (the `<aside>` drawer only)
- Test: `test/nuxt/navbar-mobile.spec.ts`

**Interfaces:**
- Consumes: `productItems`, `loginItems`, `menus`, `openSection`, `toggleSection` from Task 4's script block.
- Produces: nothing.

- [ ] **Step 1: Write the failing test**

Create `test/nuxt/navbar-mobile.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import MainNavbar from '~/components/homepage/MainNavbar.vue'

const mount = () => mountSuspended(MainNavbar, {
  global: { stubs: { ThemeToggle: true } },
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
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/nuxt/navbar-mobile.spec.ts`
Expected: FAIL — no elements match `[data-drawer-section]`.

- [ ] **Step 3: Replace the drawer link list with accordions**

Inside the `<aside>`, replace the `<div class="flex flex-col space-y-6">` block that loops `navLinks` with:

```vue
        <div class="flex flex-col space-y-2">
          <div v-for="section in drawerSections" :key="section.key" class="border-b border-white/20 pb-2">
            <button
              type="button"
              data-drawer-section
              class="w-full flex items-center justify-between text-lg sm:text-2xl font-semibold py-2"
              :aria-expanded="openSection === section.key ? 'true' : 'false'"
              :aria-controls="`drawer-panel-${section.key}`"
              @click="toggleSection(section.key)"
            >
              {{ section.label }}
              <ChevronDown
                class="w-5 h-5 transition-transform"
                :class="{ 'rotate-180': openSection === section.key }"
                aria-hidden="true"
              />
            </button>
            <div
              v-show="openSection === section.key"
              :id="`drawer-panel-${section.key}`"
              class="flex flex-col space-y-3 pb-3 pl-2"
            >
              <component
                :is="item.external ? 'a' : 'NuxtLink'"
                v-for="item in section.items"
                :key="item.label"
                :href="item.external ? item.to : undefined"
                :to="item.external ? undefined : item.to"
                :target="item.external ? '_blank' : undefined"
                :rel="item.external ? 'noopener noreferrer' : undefined"
                class="text-base text-white/80 hover:text-white transition-colors"
                @click="closeNav"
              >
                {{ item.label }}
              </component>
            </div>
          </div>

          <NuxtLink
            to="/pricing"
            class="text-lg sm:text-2xl font-semibold border-b border-white/20 py-2 hover:border-white transition-all"
            @click="closeNav"
          >
            Pricing
          </NuxtLink>
        </div>
```

- [ ] **Step 4: Add the drawer sections and login block**

Add to the script block, after `siblingItems`:

```js
const drawerSections = [
  { key: 'products', label: 'Products', items: productItems },
  { key: 'business', label: 'Business', items: menus.business },
  { key: 'company', label: 'Company', items: menus.company },
]
```

Re-add `ChevronDown` to the `lucide-vue-next` import in the script block.

Then handle the drawer's bottom block. The `v-else` currently sits *on* the `NuxtLink`, so nothing can be inserted "inside" it. Replace this whole element:

```vue
          <NuxtLink v-else to="/get-started" @click="closeNav" class="block">
            <button class="w-full px-8 py-3 bg-white text-[#9E4CFF] font-bold text-base sm:text-lg rounded-xl shadow-lg hover:bg-gray-50 transition-colors">
              Get Started
            </button>
          </NuxtLink>
```

with a wrapper that carries the `v-else` and holds both the logins and the button:

```vue
          <div v-else>
            <div data-drawer-logins class="mb-4 space-y-2">
              <p class="text-xs font-semibold uppercase tracking-wide text-white/60">Log in to</p>
              <a
                v-for="item in loginItems"
                :key="item.label"
                :href="item.to"
                :target="item.external ? '_blank' : undefined"
                :rel="item.external ? 'noopener noreferrer' : undefined"
                class="block text-base text-white/90 hover:text-white transition-colors"
                @click="closeNav"
              >
                {{ item.label }}
              </a>
            </div>

            <NuxtLink to="/get-started" class="block" @click="closeNav">
              <button
                class="w-full px-8 py-3 bg-white text-[#9E4CFF] font-bold text-base sm:text-lg rounded-xl shadow-lg hover:bg-gray-50 transition-colors"
              >
                Get Started
              </button>
            </NuxtLink>
          </div>
```

- [ ] **Step 5: Add the focus trap**

The drawer sets `aria-modal="true"` but focus currently walks out of it. Add to the script block:

```js
const drawerRef = ref(null)

// aria-modal is a promise to keyboard users. Without a trap, focus walks
// straight out of the drawer into the page behind it.
const onDrawerKeydown = (event) => {
  if (event.key === 'Escape') { closeNav(); return }
  if (event.key !== 'Tab') return

  const focusables = drawerRef.value?.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )
  if (!focusables?.length) return

  const first = focusables[0]
  const last = focusables[focusables.length - 1]

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}
```

Then add `ref="drawerRef"` and `@keydown="onDrawerKeydown"` to the `<aside>` element.

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run test/nuxt/navbar-mobile.spec.ts`
Expected: PASS, 4 tests.

- [ ] **Step 7: Commit**

```bash
git add app/components/homepage/MainNavbar.vue test/nuxt/navbar-mobile.spec.ts
git commit -m "feat(nav): collapsible sections and logins in the mobile drawer

The three menus become accordions and the login links sit above the Get
Started button.

Also adds a focus trap. The drawer already declared aria-modal=true,
which is a promise to keyboard users that focus stays inside it, but
there was no trap, so focus walked out into the page behind."
```

---

## Task 6: The footer

**Files:**
- Modify: `app/components/homepage/Footer.vue`
- Test: `test/nuxt/footer.spec.ts`

**Interfaces:**
- Consumes: `useEcosystem()` from Task 1.
- Produces: nothing.

- [ ] **Step 1: Write the failing test**

Create `test/nuxt/footer.spec.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/nuxt/footer.spec.ts`
Expected: FAIL on the `/features` assertion and on the headings assertion.

- [ ] **Step 3: Rewrite the footer script block**

Replace the `<script setup>` block in `app/components/homepage/Footer.vue` with:

```vue
<script setup>
import { Facebook, Instagram, Linkedin } from 'lucide-vue-next'
import { useEcosystem } from '~/composables/useEcosystem'

const { products, menus, parentCompany } = useEcosystem()

const columns = [
  {
    heading: 'Products',
    items: products.map(p => ({ label: p.name, to: p.href, external: p.external })),
  },
  { heading: 'Business', items: menus.business },
  { heading: 'Company', items: menus.company.filter(i => !['Terms', 'Privacy'].includes(i.label)) },
  { heading: 'Legal', items: menus.company.filter(i => ['Terms', 'Privacy'].includes(i.label)) },
]
</script>
```

- [ ] **Step 4: Replace the footer columns markup**

Delete the orphaned `<div class="space-y-5">` block containing the `Product` heading and the `/features` link. It sits between `.brand-col` and `.nav-columns`, is a flex child rather than a grid cell, and links to a page that does not exist.

Then replace the entire `<div class="nav-columns">` block with:

```vue
          <div class="nav-columns">
            <div v-for="column in columns" :key="column.heading" class="nav-col">
              <h3 class="nav-heading">{{ column.heading }}</h3>
              <nav class="nav-links">
                <component
                  :is="item.external ? 'a' : 'NuxtLink'"
                  v-for="item in column.items"
                  :key="item.label"
                  :href="item.external ? item.to : undefined"
                  :to="item.external ? undefined : item.to"
                  :target="item.external ? '_blank' : undefined"
                  :rel="item.external ? 'noopener noreferrer' : undefined"
                  class="nav-link"
                  :class="{ 'nav-link--external': item.external }"
                >
                  {{ item.label }}
                  <svg
                    v-if="item.external"
                    class="ext-icon"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M2.5 9.5L9.5 2.5M9.5 2.5H5M9.5 2.5V7"
                      stroke="currentColor"
                      stroke-width="1.2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </component>
              </nav>
            </div>
          </div>
```

This removes the old `Xeliai Ecosystem` column, whose job the Products column now does from shared data, and the `Support` column, whose `Help Center` link pointed at `/contact` and promised a page that does not exist.

- [ ] **Step 5: Add the LiteSigma credit to the legal bar**

Replace the `<div class="legal-bar">` contents with:

```vue
          <div class="legal-bar">
            <span class="copyright">© {{ new Date().getFullYear() }} XELI AI · ALL RIGHTS RESERVED</span>

            <a
              v-if="parentCompany.linkEnabled"
              data-parent-company
              :href="parentCompany.url"
              target="_blank"
              rel="noopener noreferrer"
              class="powered-by"
            >
              Powered by {{ parentCompany.name }}
            </a>
            <span v-else data-parent-company class="powered-by">
              Powered by {{ parentCompany.name }}
            </span>

            <div class="legal-links">
              <NuxtLink to="/terms" class="legal-link">Terms &amp; Conditions</NuxtLink>
              <NuxtLink to="/about" class="legal-link">About</NuxtLink>
            </div>
          </div>
```

Add to the scoped style block:

```css
.powered-by {
  font-size: 12px;
  color: #6B7280;
  letter-spacing: 0.02em;
  text-decoration: none;
}
a.powered-by:hover {
  color: #9CA3AF;
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run test/nuxt/footer.spec.ts`
Expected: PASS, 7 tests. The `No match found for location with path "/features"` router warning should be gone from the output.

- [ ] **Step 7: Commit**

```bash
git add app/components/homepage/Footer.vue test/nuxt/footer.spec.ts
git commit -m "feat(nav): rebuild the footer from the product registry

Columns now come from the same registry as the nav, so the two cannot
drift.

Fixes an orphaned Product column that sat outside the grid as a flex
child, styled with raw Tailwind while every neighbour used scoped CSS,
and linked to /features, which has no page. Vue Router was warning about
it on every render.

Retires the Support column, whose Help Center link pointed at /contact,
and the Ecosystem column, now covered by Products.

Adds the Powered by LiteSigma credit, rendered as plain text because
litesigma.com does not currently resolve. Set parentCompany.linkEnabled
to true when it does."
```

---

## Task 7: Rename the on-page product section

**Files:**
- Modify: `app/components/homepage/ProductSuite.vue`
- Test: `test/nuxt/productsuite.spec.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing.

The section describes features *inside* XeliAI, so it must stop calling them products now that a Products menu means sibling apps.

- [ ] **Step 1: Write the failing test**

Create `test/nuxt/productsuite.spec.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/nuxt/productsuite.spec.ts`
Expected: FAIL — heading is `Product Suite`.

- [ ] **Step 3: Rename the heading and drop the dead pills**

In `app/components/homepage/ProductSuite.vue`, change the `<h2>` text from `Product Suite` to `What XeliAI does`.

Then delete the entire `<div class="flex flex-wrap gap-2 items-center bg-white dark:bg-slate-900 p-1.5 rounded-xl ...">` block containing the `All`, `Support` and `Automation` buttons. They have no click handlers and filter nothing.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/nuxt/productsuite.spec.ts`
Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
git add app/components/homepage/ProductSuite.vue test/nuxt/productsuite.spec.ts
git commit -m "refactor(home): rename Product Suite to What XeliAI does

These cards describe capabilities inside XeliAI, not sibling products.
Now that the nav has a Products menu meaning Trivia, Labs and the Blog,
the old heading made the word mean two things on one page.

Also removes the All, Support and Automation filter pills, which were
plain buttons with no click handler that filtered nothing."
```

---

## Task 8: The landing-page ecosystem strip

**Files:**
- Create: `app/components/homepage/EcosystemStrip.vue`
- Modify: `app/pages/index.vue`
- Test: `test/nuxt/ecosystemstrip.spec.ts`

**Interfaces:**
- Consumes: `useEcosystem()` from Task 1.
- Produces: nothing.

- [ ] **Step 1: Write the failing test**

Create `test/nuxt/ecosystemstrip.spec.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/nuxt/ecosystemstrip.spec.ts`
Expected: FAIL with `Failed to resolve import "~/components/homepage/EcosystemStrip.vue"`.

- [ ] **Step 3: Write the component**

Create `app/components/homepage/EcosystemStrip.vue`:

```vue
<!-- components/homepage/EcosystemStrip.vue -->
<script setup>
import { ArrowUpRight } from 'lucide-vue-next'
import { useEcosystem } from '~/composables/useEcosystem'

const { products } = useEcosystem()

// The sibling apps only. XeliAI is the site you are already on.
const siblings = products.filter(p => p.external)
</script>

<template>
  <section class="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
        More from XeliAI
      </h2>
      <p class="mt-2 text-gray-500 dark:text-gray-400 text-lg">
        One family of products. Pick the one you need.
      </p>

      <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <a
          v-for="product in siblings"
          :key="product.id"
          data-ecosystem-card
          :href="product.href"
          target="_blank"
          rel="noopener noreferrer"
          class="group block p-6 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 hover:border-purple-400 dark:hover:border-purple-500 hover:-translate-y-1 transition-all duration-300"
        >
          <div class="flex items-start justify-between gap-3">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ product.name }}</h3>
            <ArrowUpRight
              class="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors"
              aria-hidden="true"
            />
          </div>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {{ product.tagline }}
          </p>
        </a>
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 4: Mount it on the landing page**

In `app/pages/index.vue`, add the import alongside the others:

```js
import EcosystemStrip from '../components/homepage/EcosystemStrip.vue'
```

and place it directly after `<ProductSuite />` in the template:

```vue
      <ProductSuite />
      <EcosystemStrip />
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run test/nuxt/ecosystemstrip.spec.ts`
Expected: PASS, 4 tests.

- [ ] **Step 6: Run the full suite and build**

Run: `npx vitest run`
Expected: PASS, 43 tests across 8 files.

Run: `npx nuxt build`
Expected: build succeeds.

- [ ] **Step 7: Retire navLinks**

Confirm nothing imports it:

Run: `npx vitest run` after deleting the `navLinks` export from `app/utils/data.js`.
If the build and suite both pass, the removal is safe. If anything breaks, restore it and note which file still depends on it.

- [ ] **Step 8: Commit**

```bash
git add app/components/homepage/EcosystemStrip.vue app/pages/index.vue app/utils/data.js test/nuxt/ecosystemstrip.spec.ts
git commit -m "feat(home): add the ecosystem strip to the landing page

The nav gets people to the other products; this makes them discoverable
to a visitor who only scrolls. Built from the same registry, so adding a
product to the family surfaces it here automatically.

Retires navLinks, whose last consumer went away with the new nav."
```

---

## Verification

Before calling this done:

- [ ] `npx vitest run` passes, 43 tests, 8 files.
- [ ] `npx nuxt build` succeeds.
- [ ] `npx nuxt dev`, then by hand at `http://localhost:3000`:
  - [ ] each of Products, Business, Company and Log in opens, and opening one closes the others
  - [ ] Escape closes the open menu and focus returns to its trigger
  - [ ] Tab and the arrow keys move through menu items
  - [ ] clicking outside closes the open menu
  - [ ] Trivia, Labs and Blog links open the right sites in new tabs
  - [ ] at mobile width, the drawer accordions expand and Tab stays inside the drawer
  - [ ] the footer shows four columns and `Powered by LiteSigma` as plain text
  - [ ] no `/features` link anywhere
  - [ ] both light and dark mode look right
- [ ] Ask before pushing.

## Known gaps to report at the end

1. `litesigma.com` does not resolve. The credit is plain text until it does.
2. `Log in → Labs` goes to the Labs home page, not a login form, because Labs has no working auth.
3. `NUXT_PUBLIC_TRIVIA_URL`, `NUXT_PUBLIC_LABS_URL` and `NUXT_PUBLIC_BLOG_URL` need setting per branch in Amplify. Defaults point at production, so an unset staging branch links visitors into production.
4. Taglines are placeholder marketing copy and want an owner review before this reaches `main`.
