<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4 text-gray-800">Campaign Editor</h1>

    <form @submit.prevent="saveCampaign" class="space-y-4">
      <div>
        <label>Campaign Name</label>
        <input v-model="form.name" class="w-full border rounded p-2"/>
      </div>
      <div>
        <label>Description (Optional)</label>
        <textarea v-model="form.description" class="w-full border rounded p-2"></textarea>
      </div>
      <div>
        <label>Email Subject</label>
        <input v-model="form.subject" class="w-full border rounded p-2"/>
      </div>
      <div>
        <label>From Name</label>
        <input v-model="form.from_name" class="w-full border rounded p-2"/>
      </div>
      <div>
        <label>From Email</label>
        <input v-model="form.from_email" class="w-full border rounded p-2"/>
      </div>
      <div>
        <label>Email Content (Editable HTML)</label>
        <textarea v-model="form.content" rows="10" class="w-full border rounded p-2"></textarea>
      </div>
      <div>
        <label>Schedule Send Date</label>
        <input type="datetime-local" v-model="form.send_date" class="w-full border rounded p-2"/>
      </div>

      <div class="pt-4 flex justify-end gap-3">
        <button type="button" @click="cancel" class="px-4 py-2 border rounded">Cancel</button>
        <button type="submit" class="px-4 py-2 bg-[#7F56D9] text-white rounded">Save/Schedule</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const form = ref({
  name: '',
  description: '',
  subject: '',
  content: '',
  from_name: 'Akili AI',
  from_email: 'no-reply@akeliai.com',
  send_date: ''
})

onMounted(() => {
  const saved = JSON.parse(localStorage.getItem('editingCampaign'))
  if (saved) {
    Object.assign(form.value, saved)
  }
})

function saveCampaign() {
  const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]')
  campaigns.unshift({
    id: Date.now(),
    ...form.value,
    status: 'Draft',
    emailsSent: 0,
    opens: 0,
    clicks: 0,
    bounces: 0,
    conversion_rate: 0
  })
  localStorage.setItem('campaigns', JSON.stringify(campaigns))
  alert('Campaign saved successfully!')
  localStorage.removeItem('editingCampaign')
}

function cancel() {
  localStorage.removeItem('editingCampaign')
  alert('Editing cancelled.')
}
</script>
