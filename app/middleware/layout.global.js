export default defineNuxtRouteMiddleware((to) => {
  if (to.path.startsWith('/dashboard')) {
    setPageLayout('dashboard')
  } else if (to.path === '/login' || to.path.startsWith('/auth')) {
    setPageLayout('default')
  } else {
    setPageLayout('default') // fallback for everything else
  }
})