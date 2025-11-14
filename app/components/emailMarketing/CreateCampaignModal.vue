<!-- components/emailMarketing/CreateCampaignModal.vue -->
<template>
  <EmailBaseModal 
    :show="show"
    title="Create Campaign"
    size="md"
    @close="$emit('close')"
  >
    <template #body>
      <form @submit.prevent="createCampaign" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
          <input 
            v-model="form.name" 
            type="text" 
            class="w-full border rounded-lg px-3 py-2 focus:ring-[#9E4CFF]" 
            required 
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            v-model="form.description" 
            class="w-full border rounded-lg px-3 py-2 focus:ring-[#9E4CFF]" 
            placeholder="Write a short description of the campaign..."
          ></textarea>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button 
            type="button" 
            @click="$emit('close')" 
            class="text-gray-600 hover:text-gray-800 transition"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="bg-[#9E4CFF] text-white px-5 py-2 rounded-lg hover:bg-[#6C47B5] transition"
          >
            Create
          </button>
        </div>
      </form>
    </template>
  </EmailBaseModal>
</template>

<script setup>
import { reactive } from 'vue'
import EmailBaseModal from './EmailBaseModal.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'create'])

const form = reactive({
  name: '',
  description: ''
})

const createCampaign = () => {
  emit('create', { 
    ...form, 
    status: 'Draft', 
    emailsSent: 0, 
    createdAt: new Date().toISOString() 
  })
  form.name = ''
  form.description = ''
  emit('close')
}
</script>
