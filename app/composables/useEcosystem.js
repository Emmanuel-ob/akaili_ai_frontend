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
