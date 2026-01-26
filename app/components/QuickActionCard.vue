<!-- components/QuickActionCard.vue -->
 <template>
  <NuxtLink
    :to="to"
    class="relative group flex items-center p-4 rounded-lg transition-all duration-200
           bg-gray-50 dark:bg-slate-800/40 
           border border-gray-100 dark:border-slate-700/50 
           hover:bg-white dark:hover:bg-slate-800 
           hover:shadow-md hover:border-purple-200 dark:hover:border-purple-500/30"
  >
    <!-- Icon Container -->
    <div 
      class="w-12 h-12 rounded-lg flex items-center justify-center mr-4 transition-colors duration-200 border border-transparent"
      :class="[iconBgClass, 'group-hover:border-black/30 group-hover:bg-opacity-20']"
    >
      <svg class="w-6 h-6" :class="iconTextClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath"/>
      </svg>
    </div>

    <!-- Text Content -->
    <div>
      <h4 class="text-base font-semibold text-gray-900 dark:text-white transition-colors font-subheading" :class="titleHoverClass">
        {{ title }}
      </h4>
      <p class="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors font-sans">
        {{ description }}
      </p>
    </div>

    <!-- Hover Arrow -->
    <div class="absolute right-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-gray-400 dark:text-gray-500">
       <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
       </svg>
    </div>
  </NuxtLink>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  to: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: {
    type: String,
    required: true,
    validator: (value) => ['database', 'settings', 'conversations'].includes(value)
  }
})

// Updated configurations with Dark Mode support
const iconConfig = {
  database: {
    bgClass: 'bg-purple-100 dark:bg-purple-500/10',
    textClass: 'text-purple-600 dark:text-purple-400',
    hoverClass: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
    path: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4'
  },
  settings: {
    bgClass: 'bg-blue-100 dark:bg-blue-500/10',
    textClass: 'text-blue-600 dark:text-blue-400',
    hoverClass: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
    path: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z'
  },
  conversations: {
    bgClass: 'bg-green-100 dark:bg-green-500/10',
    textClass: 'text-green-600 dark:text-green-400',
    hoverClass: 'group-hover:text-green-600 dark:group-hover:text-green-400',
    path: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
  }
}

const iconBgClass = computed(() => iconConfig[props.icon].bgClass)
const iconTextClass = computed(() => iconConfig[props.icon].textClass)
const titleHoverClass = computed(() => iconConfig[props.icon].hoverClass)
const iconPath = computed(() => iconConfig[props.icon].path)
</script>