export default defineNuxtRouteMiddleware((to) => {
  if (to.path.startsWith('/dashboard')) {
    setPageLayout('dashboard')
  } else {
    setPageLayout('default') 
  }
})