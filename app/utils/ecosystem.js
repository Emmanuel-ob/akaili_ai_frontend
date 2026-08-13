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
