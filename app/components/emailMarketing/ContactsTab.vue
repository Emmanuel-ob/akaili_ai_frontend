<template>
  <div class="bg-white rounded-xl shadow-sm border p-4">
    <!-- Search + Filter -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search contacts by name or email..."
        class="w-full sm:w-1/2 border rounded-lg p-2"
      />

      <select v-model="filterStatus" class="border rounded-lg p-2 text-gray-700">
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="pending">Pending</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>

    <!-- Contacts Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full text-sm text-left text-gray-600">
        <thead class="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <th class="px-4 py-3">Name</th>
            <th class="px-4 py-3">Email</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Tags</th>
            <th class="px-4 py-3">List</th>
            <th class="px-4 py-3">Last Activity</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="contact in filteredContacts"
            :key="contact.id"
            class="border-b hover:bg-gray-50 transition"
          >
            <td class="px-4 py-2 font-medium text-gray-800">
              {{ contact.first_name }} {{ contact.last_name }}
            </td>
            <td class="px-4 py-2 text-blue-600">{{ contact.email }}</td>
            <td class="px-4 py-2">
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-semibold',
                  contact.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : contact.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-600'
                ]"
              >
                {{ contact.status }}
              </span>
            </td>
            <td class="px-4 py-2">
              <span
                v-for="(tag, i) in contact.tags"
                :key="i"
                class="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full mr-1"
              >
                {{ tag }}
              </span>
            </td>
            <td class="px-4 py-2 text-gray-500">{{ contact.list_name }}</td>
            <td class="px-4 py-2 text-gray-400">
              {{ formatDate(contact.last_activity) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="filteredContacts.length === 0" class="text-center text-gray-500 py-8">
      No contacts found.
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  contacts: Array
})


console.log("i did this " + props.contacts);



const searchQuery = ref('')
const filterStatus = ref('')

const filteredContacts = computed(() => {
  return props.contacts.filter(c => {
    const matchesSearch =
      c.first_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.last_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesStatus = filterStatus.value
      ? c.status === filterStatus.value
      : true

    return matchesSearch && matchesStatus
  })
})

function formatDate(isoDate) {
  if (!isoDate) return '—'
  const date = new Date(isoDate)
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
