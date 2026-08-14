<!-- components/homepage/NavDropdown.vue -->
<script setup>
import { nextTick, watch } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { useDropdown } from '~/composables/useDropdown'
import EcoLink from '~/components/homepage/EcoLink.vue'

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  items: { type: Array, required: true },
  align: { type: String, default: 'start' },
})

const { isOpen, toggle, close, closeAndRefocus, triggerRef, panelRef } = useDropdown(props.id)

// FIX 2: arrow-key roving focus only works once focus is actually inside
// the panel. The trigger and the panel are siblings, so clicking the
// trigger leaves focus on the trigger and keydown never reaches
// onPanelKeydown below. Move focus to the first menu item once the panel
// has rendered (it is behind v-if inside a Transition, so wait a tick).
watch(isOpen, async (open) => {
  if (!open) return
  await nextTick()
  const first = panelRef.value?.querySelector('[role="menuitem"]')
  first?.focus()
})

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
    // FIX 1: closing on every Tab used to strand focus. Tab between two
    // items inside the menu is native browser behaviour (these are real
    // anchors, not a roving-tabindex set) and must be left alone, or the
    // item that focus lands on gets ripped out from under it the instant
    // we close. Only the boundary case needs handling: Tab off the last
    // item (or Shift+Tab off the first) is about to carry focus out of
    // the panel entirely, so it is safe to close there.
    const leavingForward = !event.shiftKey && current === focusables.length - 1
    const leavingBackward = event.shiftKey && current === 0
    if (leavingForward || leavingBackward) {
      // Do not close synchronously: the browser has not yet performed
      // its default Tab focus-move (that happens right after this
      // handler returns, still before the next animation frame). If we
      // close now, we delete the currently-focused element before the
      // browser gets a chance to move focus off it, so it falls back to
      // <body> and sequential navigation restarts from the top of the
      // page -- the exact bug this fix removes. Deferring to the next
      // frame lets the native Tab motion land on whatever comes after
      // this menu first; only then do we tear the panel down, and focus
      // is already safely outside it.
      requestAnimationFrame(() => close())
    }
    // Any other Tab moves between items and is left entirely to the
    // browser's native focus order; the menu stays open.
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
        <EcoLink
          v-for="item in items"
          :key="item.label"
          :item="item"
          role="menuitem"
          class="block px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-slate-700 hover:text-purple-600 transition-colors"
          @click="closeAndRefocus"
        >
          <span class="font-medium">{{ item.label }}</span>
          <span v-if="item.tagline" class="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {{ item.tagline }}
          </span>
        </EcoLink>
      </div>
    </Transition>
  </div>
</template>
