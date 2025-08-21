# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

```
akili_ai_frontend
├─ app
│  ├─ app.vue
│  ├─ assets
│  │  └─ css
│  │     └─ main.css
│  ├─ components
│  │  ├─ CustomerSatisfaction.vue
│  │  ├─ DashboardHeader.vue
│  │  ├─ DashboardSidebar.vue
│  │  ├─ OnboardingProgress.vue
│  │  ├─ RecentConversations.vue
│  │  └─ StatsCard.vue
│  └─ pages
│     ├─ dashboard.vue
│     ├─ index.vue
│     ├─ login.vue
│     ├─ onboarding.vue
│     └─ signup.vue
├─ eslint.config.mjs
├─ middleware
│  └─ auth.js
├─ nuxt.config.ts
├─ package-lock.json
├─ package.json
├─ public
│  ├─ favicon.ico
│  └─ robots.txt
├─ README.md
├─ stores
│  ├─ auth.js
│  └─ onboarding.js
└─ tsconfig.json

```