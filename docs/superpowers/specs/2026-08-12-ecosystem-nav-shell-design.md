# XeliAI Ecosystem Nav Shell — Design

**Date:** 2026-08-12
**Repo:** `akaili_ai_frontend` (branch `dev`)
**Status:** Approved design, not yet implemented

---

## 1. Goal

Turn the XeliAI landing page into the hub for the whole product family, following the pattern
OpenAI uses: a Products menu that lists the sibling apps, Business and Company menus, a **Log in
dropdown that routes to each product's own login**, and a footer that credits the parent company.

Three explicit requirements from the request:

1. A Products menu on the landing page listing the other apps, reachable from `xeliai.com`.
2. A login control offering "log in to Trivia / XeliAI / Labs".
3. `Powered by LiteSigma` in the footer — **the only place LiteSigma appears anywhere on the site.**

## 2. What the family actually is

| Product | Domain | Stack | Auth today |
|---|---|---|---|
| XeliAI | `xeliai.com` | Laravel 12 + MongoDB · Nuxt 4 | Sanctum bearer token |
| XeliAI Trivia | `trivia.xeliai.com` | FastAPI + Postgres · Nuxt 3 | Own JWT + Google OAuth + guest accounts |
| XeliAI Labs | `labs.xeliai.com` | Nuxt 4, mock data | **None.** `composables/useAuth.js` is empty, `middleware/auth.js` is a no-op, `pages/auth/Login.vue:222` calls `navigateTo("/dashboard")` |
| XeliAI Blog | `blog.xeliai.com` | — | No login |
| LiteSigma | `litesigma.com` | — | Parent company. Labs' git remote is `LiteSigma-Tech/xeliai_lab` |

All four XeliAI domains returned HTTP 200 on 2026-08-12. `litesigma.com` did **not** resolve
(SERVFAIL against 8.8.8.8; `xeliai.com` resolved from the same query, so this is a real result and
not a local network fault).

## 3. Reference: what OpenAI actually does

Verified by parsing the live `openai.com` HTML on 2026-08-12, not from memory.

- Top nav is five items: **Research, Business, Developers, Company, Foundation**. Mega-menu contents
  are client-rendered and not present in the static HTML.
- On the right: a **`Log in` dropdown** (`<button aria-haspopup="menu" aria-expanded="false">`),
  next to a solid **`Try ChatGPT`** CTA linking out to `chatgpt.com` in a new window.
- Footer has eleven column headings: Research, Latest Advancements, Safety, Products, API Platform,
  Business, Developers, Company, Support, More, Terms & Policies.
- The **Products** column links to `chatgpt.com`, `chatgpt.com/business`, `/codex/`. The **API
  Platform** column's second link is literally `API Log In → platform.openai.com/login`.

**The load-bearing insight:** every product lives on its own domain with its own login. The
marketing site is a hub that *routes* to them. The login dropdown exists precisely *because* there
is no single sign-on — it is a disambiguator, not an auth system.

**Where XeliAI differs:** OpenAI's split is clean — `openai.com` is corporate, `chatgpt.com` is the
product. `xeliai.com` is **both** the company site and the chatbot's own product site. Consequence:
`Products → XeliAI` must point at `/products`, not `/`, or the menu item reloads the page you are
already on.

## 4. Locked decisions

| # | Decision | Rationale |
|---|---|---|
| D1 | **Login links out per product. No SSO.** | Three unrelated auth systems (Sanctum/Mongo, JWT/Postgres, none). SSO would mean building an identity provider and migrating Trivia's live paying users. This is what OpenAI does. Pure frontend, zero backend work. |
| D2 | **"Product" means a sibling app only.** | Avoids the word meaning two things on one page. The existing on-page `ProductSuite` section (Bot, Business Assistant, Automation Tools) describes features *inside* XeliAI and is renamed. |
| D3 | **Scope is the XeliAI landing shell only.** | Trivia is in production with paying users; Labs is on a different Nuxt major. Build it once here, prove it, port later as a file copy. |
| D4 | **Menus link only to pages that exist.** | No `coming soon` stubs, no 404s. Items get added as pages are written. |
| D5 | **Registry-driven, hand-rolled Tailwind.** | The product list appears in four places (desktop nav, mobile drawer, login menu, footer). Nuxt UI is installed but used in exactly one dashboard file, so its design system would clash on the most visible page of the site. |
| D6 | **Labs links to its home page, not its login.** | Labs has no working auth. Linking "Log in → Labs" would send users to a form that authenticates nobody. Revisit when Labs has real auth. |
| D7 | **`Powered by LiteSigma` is plain text, not a link.** | `litesigma.com` does not resolve. The URL stays in the registry so enabling the link later is a one-line change. |

### Non-goals

- No single sign-on, no shared session, no cross-domain auth of any kind.
- No changes to Trivia or Labs.
- No new marketing pages (Solutions, Careers, Customer Stories).
- No backend changes. Nothing in `lite_sigma_chat_agent_backend/` is touched.
- No changes to the existing dashboard, auth, onboarding, billing or checkout flows.

## 5. Architecture

### 5.1 The registry — `app/utils/ecosystem.js`

Single source of truth. Every consumer reads from it; none hardcodes a product.

```js
export const products = [
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
    href: TRIVIA_URL,
    loginHref: `${TRIVIA_URL}/auth/login`,
    external: true,
  },
  {
    id: 'labs',
    name: 'XeliAI Labs',
    tagline: 'Courses, mentorship and talent',
    href: LABS_URL,
    loginHref: LABS_URL,          // D6 — Labs has no working auth
    external: true,
  },
  {
    id: 'blog',
    name: 'XeliAI Blog',
    tagline: 'Product news and writing',
    href: BLOG_URL,
    loginHref: null,              // no login — excluded from the login menu
    external: true,
  },
]

export const menus = {
  business: [
    { label: 'Pricing',          to: '/pricing' },
    { label: 'Referral Program', to: '/referrals' },
    { label: 'Talk to sales',    to: '/contact' },
    { label: 'Get started',      to: '/get-started' },
  ],
  company: [
    { label: 'About',   to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Terms',   to: '/terms' },
    { label: 'Privacy', to: '/privacy' },
  ],
}

export const parentCompany = {
  name: 'LiteSigma',
  url: 'https://litesigma.com',
  linkEnabled: false,             // D7 — domain does not resolve
}
```

`loginHref: null` is meaningful, not incidental: it is the single field that keeps the Blog out of
the login dropdown while keeping it in the Products menu and footer.

### 5.2 URLs come from `runtimeConfig.public`

Product URLs are **not** hardcoded strings. `nuxt.config.ts` already sources `apiBase` this way, and
commit `ce9e719` just moved runtime config onto public env vars.

```ts
runtimeConfig: {
  public: {
    triviaUrl: process.env.NUXT_PUBLIC_TRIVIA_URL || 'https://trivia.xeliai.com',
    labsUrl:   process.env.NUXT_PUBLIC_LABS_URL   || 'https://labs.xeliai.com',
    blogUrl:   process.env.NUXT_PUBLIC_BLOG_URL   || 'https://blog.xeliai.com',
  }
}
```

Without this, a `dev.xeliai.com` build links visitors straight into production.

Because `runtimeConfig` is only readable inside a Nuxt context, the registry exports a
`useEcosystem()` composable that resolves the URLs at call time. The raw arrays stay exported for
unit tests.

## 6. Navbar

### 6.1 Desktop, logged out

```
[logo]   Products ▾   Business ▾   Company ▾   Pricing        🌓   [ Log in ▾ ]   [ Get Started ]
```

Seven flat links collapse into three menus plus Pricing. **Pricing stays top-level deliberately** —
it is the highest-intent page on the site and burying it in a dropdown costs signups.

| Products ▾ | Business ▾ | Company ▾ |
|---|---|---|
| XeliAI | Pricing | About |
| XeliAI Trivia ↗ | Referral Program | Contact |
| XeliAI Labs ↗ | Talk to sales | Terms |
| XeliAI Blog ↗ | Get started | Privacy |

Products entries render their `tagline` as a second line. Business and Company are plain link lists.

Two deliberate duplications: **Pricing** appears both top-level and under Business, and the **Blog**
sits under Products rather than Company. The first is a conversion decision; the second keeps the
Blog in exactly one menu, since it is registered as a product. OpenAI duplicates similarly (`Docs`
appears under both API Platform and Developers).

### 6.2 The login dropdown

```
Log in ▾
  XeliAI            → /login
  XeliAI Trivia ↗   → trivia.xeliai.com/auth/login
  XeliAI Labs   ↗   → labs.xeliai.com
```

Generated by filtering `products` on `loginHref !== null`.

**Hard constraint:** this menu must never imply knowledge of a Trivia or Labs session. `authStore`
holds a XeliAI Sanctum token and nothing else — different domains, different cookies, three
unrelated auth systems. Entries are plainly labelled links with an external-link affordance. No
"signed in as…", no session indicator, no per-product state.

### 6.3 Authenticated state

The existing profile menu is preserved exactly as-is — same trigger, same `Dashboard` and `Logout`
items, same handlers. It gains a divider and the Trivia/Labs links beneath. Same honesty constraint
as 6.2 applies.

### 6.4 Behaviour and accessibility

Menus open on **click**, not hover. Hover menus are unusable on touch and hostile to keyboard users,
and click is what OpenAI uses for its own Log in control.

- trigger: `aria-haspopup="menu"`, `aria-expanded` reflecting state
- panel: `role="menu"`, items `role="menuitem"`
- `Escape` closes and returns focus to the trigger
- `ArrowDown` / `ArrowUp` move between items, `Home` / `End` jump to ends
- click outside closes
- route change closes
- only one menu open at a time

All four dropdowns share a `useDropdown()` composable holding this logic.

### 6.5 Mobile drawer

The existing purple slide-in drawer is kept. The three menus become collapsible accordions; the
login links sit above the `Get Started` button at the bottom. A focus trap is added (see §9).

## 7. Footer

Columns, all generated from the registry where applicable:

| Products | Business | Company | Legal |
|---|---|---|---|
| XeliAI | Pricing | About | Terms |
| XeliAI Trivia ↗ | Referral Program | Contact | Privacy |
| XeliAI Labs ↗ | Talk to sales | | |
| XeliAI Blog ↗ | Get started | | |

The footer columns mirror the nav menus exactly — same registry, same `menus` object — so the two
cannot drift.

Two changes from the current footer beyond B1/B2. The `Xeliai Ecosystem` column is **removed**; the
Products column now does that job formally, from shared data. And the `Support` column is
**retired**: its `Help Center` link pointed at `/contact`, which is a mislabel under D4 — there is
no help centre. Its real links (Contact, Privacy, Terms) survive under Company and Legal.

Legal bar:

```
© 2026 XeliAI · All rights reserved      Powered by LiteSigma      Terms · Privacy
```

`Powered by LiteSigma` renders as plain text while `parentCompany.linkEnabled === false` (D7). This
is the only occurrence of LiteSigma on the site; it is simultaneously **removed** from the old
Ecosystem column, where it currently links to a domain that does not resolve.

## 8. Landing page

- `ProductSuite.vue` heading: **"Product Suite" → "What XeliAI does"** (D2). The cards themselves are
  unchanged.
- New `EcosystemStrip.vue` below it: three compact cards for Trivia, Labs and Blog, from the
  registry. The nav gets people to the other products; this makes them discoverable to a visitor who
  only scrolls.

## 9. Pre-existing defects fixed along the way

These are all in code the new work directly touches. Each is a real, verified defect on `dev` today.

| # | Defect | Fix |
|---|---|---|
| B1 | `Footer.vue` — an orphaned `<div class="space-y-5">` "Product" block sits between `.brand-col` and `.nav-columns`. It is a flex child of `.footer-top`, not a grid cell, so it does not align with the other columns, and it is styled with raw Tailwind while every neighbour uses scoped CSS classes. | Delete it. Its links already exist elsewhere. |
| B2 | That block links to `/features`, which has no page — a 404. | Removed with B1. Regression-tested. |
| B3 | `MainNavbar.vue:35` closes menus via `document.querySelector('[data-profile-menu]')` — one hardcoded selector. With four dropdowns it closes the wrong menu. | Per-instance refs inside `useDropdown()`. |
| B4 | The mobile drawer sets `aria-modal="true"` but has no focus trap, so keyboard focus walks out of it into the page behind. | Add a focus trap. |
| B5 | `navLinks` carries a `more` field that renders a `ChevronDown`, but `more` is `''` on every entry and no dropdown was ever built — a dead affordance shipped today. | Superseded by real dropdowns. |
| B6 | `ProductSuite.vue` — the `All / Support / Automation` filter pills are plain `<button>`s with no click handler. | Remove them. |

## 10. Error handling and edge cases

- **External links** always carry `target="_blank"` and `rel="noopener noreferrer"`. Driven by the
  registry's `external` flag, so it cannot be forgotten on a new entry.
- **A product domain being down is not handled.** These are plain anchors; no health checks, no
  liveness probes. A dead sibling domain degrades to a failed navigation, which is correct and
  costs nothing.
- **`loginHref: null`** removes a product from the login menu only. It stays in Products and the
  footer.
- **`linkEnabled: false`** renders the parent company as text. No anchor, no hover state.
- **SSR:** the registry is pure data plus `runtimeConfig` reads, safe on both server and client. No
  `window` access at module scope.
- **No impact on authenticated flows.** `authStore`, middleware, the dashboard layout, checkout and
  payment are untouched.

## 11. Testing

`npm run test` currently runs **zero** tests — `test/nuxt/` is empty. These are the repo's first.

| Test | Asserts |
|---|---|
| registry shape | every product has `id`, `name`, `tagline`, `href`, `external`; `loginHref === null` only for `blog` |
| login menu | renders exactly three entries; never contains the Blog |
| products menu | renders all four products with taglines |
| external links | every `external: true` link has `target="_blank"` and `rel="noopener noreferrer"` |
| dropdown a11y | `aria-expanded` flips on open/close; `Escape` closes and restores focus to the trigger |
| single-open | opening one dropdown closes any other |
| footer regression | the rendered footer contains no `/features` link (guards B2) |
| parent company | renders as text, not an anchor, while `linkEnabled` is false |

## 12. Files changed

**New**

- `app/utils/ecosystem.js` — the registry
- `app/composables/useEcosystem.js` — resolves registry URLs from `runtimeConfig`
- `app/composables/useDropdown.js` — shared open/close, keyboard and click-outside logic
- `app/components/homepage/NavDropdown.vue` — one menu, used four times
- `app/components/homepage/EcosystemStrip.vue` — the landing-page family section
- `test/nuxt/ecosystem.spec.ts`, `test/nuxt/navbar.spec.ts`, `test/nuxt/footer.spec.ts`

**Modified**

- `nuxt.config.ts` — three `runtimeConfig.public` URL entries
- `app/components/homepage/MainNavbar.vue` — menus, login dropdown, mobile accordions, B3, B4, B5
- `app/components/homepage/Footer.vue` — columns from registry, legal bar, B1, B2
- `app/components/homepage/ProductSuite.vue` — heading rename, B6
- `app/pages/index.vue` — mount `EcosystemStrip`
- `app/utils/data.js` — retire `navLinks` once nothing reads it

## 13. Open items requiring human action

1. **`litesigma.com` does not resolve.** Until it does, `Powered by LiteSigma` is plain text. Flip
   `parentCompany.linkEnabled` to `true` when the domain is live.
2. **Labs has no auth.** `Log in → Labs` points at the Labs home page (D6). Repoint at
   `labs.xeliai.com/auth/Login` once Labs has real authentication.
3. **Amplify env vars.** `NUXT_PUBLIC_TRIVIA_URL`, `NUXT_PUBLIC_LABS_URL`, `NUXT_PUBLIC_BLOG_URL`
   should be set per branch. Defaults point at production, so an unset staging branch will link
   visitors into production.
4. **Product taglines are placeholders** written from reading each codebase. They are marketing copy
   and should be reviewed before this goes to `main`.

## 14. Relationship to `CLAUDE_CODE_EXECUTION_SPEC.md`

This work is **not** in that spec, which covers referrals, geo-pricing, the ledger and the admin
panel. It is a separate directive and does not alter, reorder or block any phase there. It touches
no backend code, no money path, and no existing API contract.
