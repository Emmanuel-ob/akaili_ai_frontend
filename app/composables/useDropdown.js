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
