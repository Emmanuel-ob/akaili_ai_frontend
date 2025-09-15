<!-- components/DatabaseModal.vue -->
<template>
  <BaseModal :show="show" title="Add Database Connection" @close="$emit('close')">
    <form class="space-y-4" @submit.prevent="handleSubmit" >
      <FormInput
        v-model="form.name"
        label="Connection Name"
        placeholder="e.g., Products Database"
        required
      />

      <FormSelect
        v-model="form.type"
        label="Database Type"
        placeholder="Select database type"
        :options="databaseTypes"
        required
        @update:model-value="updateDefaultPort"
      />

      <FormSelect
        v-model="form.chatbot_id"
        label="Chatbot"
        placeholder="Select chatbot"
        :options="chatbotOptions"
        required
      />

      <div class="grid grid-cols-2 gap-4">
        <FormInput
          v-model="form.host"
          label="Host"
          placeholder="localhost"
          required
        />
        <FormInput
          v-model="form.port"
          label="Port"
          type="number"
          :placeholder="getDefaultPort(form.type)"
        />
      </div>

      <div v-if="form.type === 'postgresql'" class="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
       <FormInput
        v-model="form.schema"
        label="Schema Name"
        placeholder="Schema (default is 'public')"
        required
      />


      </div>

      <FormInput
        v-model="form.database"
        label="Database Name"
        placeholder="database_name"
        required
      />

      <FormInput
        v-model="form.username"
        label="Username"
        required
      />

      <FormInput
        v-model="form.password"
        label="Password"
        type="password"
      />

      <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
        {{ error }}
      </div>

      <div class="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          class="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-md disabled:opacity-50"
        >
          {{ loading ? 'Connecting...' : 'Connect Database' }}
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  chatbots: {
    type: Array,
    default: () => []
  },
  loading: Boolean,
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'submit'])

const form = reactive({
  name: '',
  type: '',
  chatbot_id: '',
  host: '',
  port: '',
  database: '',
  username: '',
  password: '',
  schema: '' // For PostgreSQL
})

const databaseTypes = [
  { value: 'mysql', label: 'MySQL' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'mongodb', label: 'MongoDB' }
]

const chatbotOptions = computed(() => {
  return props.chatbots.map(chatbot => ({
    value: chatbot.id,
    label: chatbot.name
  }))
})

const getDefaultPort = (type) => {
  const ports = {
    mysql: '3306',
    postgresql: '5432',
    mongodb: '27017'
  }
  return ports[type] || ''
}

const updateDefaultPort = (type) => {
  if (type && !form.port) {
    form.port = getDefaultPort(type)
  }
}

const handleSubmit = () => {
  emit('submit', { ...form })
}

// Reset form when modal closes
watch(() => props.show, (show) => {
  if (!show) {
    Object.assign(form, {
      name: '',
      type: '',
      chatbot_id: '',
      host: '',
      port: '',
      database: '',
      username: '',
      password: '',
      schema: ''
    })
  }
})
</script>