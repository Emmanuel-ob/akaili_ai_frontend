<template>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <div
      v-for="list in lists"
      :key="list.list_id"
      class="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer"
    >
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-lg font-semibold text-gray-800">{{ list.list_name }}</h3>
        <span class="text-sm text-gray-500">{{ list.subscribers }} subs</span>
      </div>

      <!-- Tags -->
      <div class="mb-3">
        <p class="text-sm text-gray-500 mb-1 font-medium">Tags:</p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(group, tag) in groupByTags(list.data)"
            :key="tag"
            class="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full"
          >
            {{ tag }} ({{ group.length }})
          </span>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex justify-between items-center">
        <button
          class="text-sm text-[#7F56D9] font-medium hover:underline"
          @click="viewListDetails(list)"
        >
          View Details
        </button>
        <button
          class="text-sm text-gray-500 hover:text-red-500"
          @click="deleteList(list)"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
const toast = useToast()

const props = defineProps({
  lists: Array
})

function groupByTags(users) {
  const grouped = {}
  users.forEach(u => {
    u.tags?.forEach(tag => {
      if (!grouped[tag]) grouped[tag] = []
      grouped[tag].push(u)
    })
  })
  return grouped
}

function viewListDetails(list) {
  toast.info(`📋 Viewing ${list.list_name} — ${list.subscribers} subscribers.`)
}

function deleteList(list) {
  toast.warning(`🗑️ Deleted list "${list.list_name}" (not persistent yet).`)
}
</script>
