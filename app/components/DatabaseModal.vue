<!-- components/DatabaseModal.vue -->
<template>
  <BaseModal :show="show" title="Add Database Connection" @close="$emit('close')">
    <form class="space-y-6" @submit.prevent="handleSubmit">
      <!-- Responsive 2-column grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Left Column: Connection details -->
        <div class="space-y-4">
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

          <!-- Connection Method Toggle -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Connection Method
            </label>
            <div class="flex space-x-6">
              <label class="flex items-center text-sm text-gray-700">
                <input
                  v-model="connectionMethod"
                  type="radio"
                  value="manual"
                  class="mr-2 text-purple-600 focus:ring-purple-500"
                />
                Manual
              </label>
              <label class="flex items-center text-sm text-gray-700">
                <input
                  v-model="connectionMethod"
                  type="radio"
                  value="string"
                  class="mr-2 text-purple-600 focus:ring-purple-500"
                />
                Connection String
              </label>
            </div>
          </div>
        </div>

        <!-- Right Column: Credentials & database -->
        <div class="space-y-4">
          <!-- Connection String -->
          <div v-if="connectionMethod === 'string'">
            <FormInput
              v-model="form.connection_string"
              label="Connection String"
              placeholder="mysql://user:password@host:port/database"
              required
              @blur="onConnectionStringBlur"
            />
            <div
              class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800"
            >
              <p><strong>Examples:</strong></p>
              <p>MySQL: <code class="bg-blue-100 px-1 rounded">mysql://user:pass@host:3306/dbname</code></p>
              <p>PostgreSQL: <code class="bg-blue-100 px-1 rounded">postgresql://user:pass@host:5432/dbname</code></p>
              <p>MongoDB: <code class="bg-blue-100 px-1 rounded">mongodb+srv://user:pass@host/dbname</code></p>
            </div>
          </div>

          <!-- Manual Config -->
          <div v-else class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <FormInput
                v-model="form.host"
                label="Host"
                placeholder="localhost"
                required
                @blur="onConnectionDetailsChange"
              />
              <FormInput
                v-model="form.port"
                label="Port"
                type="number"
                :placeholder="getDefaultPort(form.type)"
                @blur="onConnectionDetailsChange"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <FormInput
                v-model="form.username"
                label="Username"
                required
                @blur="onConnectionDetailsChange"
              />
              <FormInput
                v-model="form.password"
                label="Password"
                type="password"
                @blur="onConnectionDetailsChange"
              />
            </div>
          </div>

          <!-- Load DB button -->
          <div v-if="canLoadDatabases && !showDatabaseSelect">
            <button
              type="button"
              @click="fetchDatabases"
              :disabled="loadingDatabases"
              class="w-full px-4 py-2 text-sm text-purple-600 border border-purple-200 rounded-md hover:bg-purple-50 disabled:opacity-50"
            >
              {{ loadingDatabases ? 'Loading Databases...' : 'Load Available Databases' }}
            </button>
          </div>

          <!-- Warnings / Alerts -->
          <div
            v-if="showMissingFieldsWarning"
            class="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800"
          >
            <strong>Missing required fields:</strong> {{ missingFields.join(', ') }}<br />
            Please fill all required fields to load databases.
          </div>

          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
            {{ error }}
          </div>

          <div
            v-if="loadingDatabases"
            class="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-600"
          >
            Fetching available databases...
          </div>

          <!-- Database Selection -->
          <div v-if="showDatabaseSelect" class="space-y-4">
            <FormSelect
              v-model="form.database"
              label="Database"
              placeholder="Select database"
              :options="availableDatabases.map(db => ({ value: db, label: db }))"
              required
              @update:model-value="onDatabaseChange"
            />

            <!-- Warnings -->
            <div
              v-if="getDatabaseWarning(form.database)"
              class="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800"
            >
              <strong>⚠️ Warning:</strong> {{ getDatabaseWarning(form.database) }}
            </div>

            <!-- Schemas for PostgreSQL -->
            <div v-if="form.type === 'postgresql' && availableSchemas.length > 0" class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Select Schemas <span class="text-red-500">*</span></label>
              <div class="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded p-2">
                <label
                  v-for="schema in availableSchemas"
                  :key="schema"
                  class="flex items-center p-1 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    v-model="selectedSchemas"
                    type="checkbox"
                    :value="schema"
                    class="mr-2 text-purple-600 focus:ring-purple-500"
                  />
                  <span class="text-sm">{{ schema }}</span>
                </label>
              </div>
              <p class="text-xs text-gray-500">Selected schemas will be used for table filtering</p>

              <div
                v-if="selectedSchemas.length === 0"
                class="p-2 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800"
              >
                At least one schema must be selected.
              </div>
            </div>

            <button
              type="button"
              @click="resetDatabaseSelection"
              class="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Change Connection Details
            </button>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          class="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="loading || !canSubmit"
          class="px-4 py-2 text-sm text-white bg-[#9E4CFF] hover:bg-purple-700 rounded-lg disabled:opacity-50"
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

const connectionMethod = ref('manual')
const availableDatabases = ref([])
const databasesWithWarnings = ref([])
const loadingDatabases = ref(false)
const showDatabaseSelect = ref(false)
const availableSchemas = ref([])
const selectedSchemas = ref([])

const form = reactive({
  name: '',
  type: '',
  chatbot_id: '',
  host: '',
  port: '',
  database: '',
  username: '',
  password: '',
  schema: '',
  connection_string: '',
  use_connection_string: false
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

const canLoadDatabases = computed(() => {
  if (connectionMethod.value === 'string') {
    return form.connection_string && form.type
  }
  return form.host && form.username && form.type && form.port && !showDatabaseSelect.value
})

const missingFields = computed(() => {
  if (connectionMethod.value === 'string') {
    const missing = []
    if (!form.type) missing.push('Database Type')
    if (!form.connection_string) missing.push('Connection String')
    return missing
  }

  const missing = []
  if (!form.type) missing.push('Database Type')
  if (!form.host) missing.push('Host')
  if (!form.username) missing.push('Username')
  if (!form.port) missing.push('Port')
  return missing
})

const showMissingFieldsWarning = computed(() => {
  return missingFields.value.length > 0 && !showDatabaseSelect.value && !loadingDatabases.value
})

const canSubmit = computed(() => {
  const basicFields = form.name && form.type && form.chatbot_id
  if (!basicFields) return false

  if (connectionMethod.value === 'string') {
    const hasConnectionString = form.connection_string && form.database
    if (form.type === 'postgresql') {
      return hasConnectionString && selectedSchemas.value.length > 0
    }
    return hasConnectionString
  }

  const hasManualFields = form.host && form.username && form.database
  if (form.type === 'postgresql') {
    return hasManualFields && selectedSchemas.value.length > 0
  }
  return hasManualFields
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
  // Always update port when type changes, even if port was previously set
  if (type) {
    form.port = getDefaultPort(type)
  }
  resetDatabaseSelection()
}

const onConnectionDetailsChange = async () => {
  if (canLoadDatabases.value && connectionMethod.value === 'manual') {
    await nextTick()
    await fetchDatabases()
  }
}

const onConnectionStringBlur = async () => {
  if (canLoadDatabases.value && connectionMethod.value === 'string') {
    await fetchDatabases()
  }
}

const getDatabaseWarning = (database) => {
  const warningDb = databasesWithWarnings.value.find(db => db.name === database)
  return warningDb?.warning || null
}

const fetchDatabases = async () => {
  if (!canLoadDatabases.value) return

  loadingDatabases.value = true
  try {
    const databaseStore = useDatabaseStore()

    let requestData = {
      type: form.type,
      use_connection_string: connectionMethod.value === 'string'
    }

    if (connectionMethod.value === 'string') {
      requestData.connection_string = form.connection_string
    } else {
      requestData = {
        ...requestData,
        host: form.host,
        port: form.port || getDefaultPort(form.type),
        username: form.username,
        password: form.password
      }
    }

    const result = await databaseStore.getAvailableDatabases(requestData)

    if (result.success) {
      availableDatabases.value = result.databases
      databasesWithWarnings.value = result.databases_with_warnings || []
      showDatabaseSelect.value = true
      form.database = ''
      selectedSchemas.value = []
      availableSchemas.value = []
    }
  } catch (error) {
    console.error('Failed to fetch databases:', error)
  } finally {
    loadingDatabases.value = false
  }
}

const onDatabaseChange = async (database) => {
  if (form.type === 'postgresql' && database) {
    const databaseStore = useDatabaseStore()

    let requestData = {
      type: form.type,
      database: database,
      use_connection_string: connectionMethod.value === 'string'
    }

    if (connectionMethod.value === 'string') {
      requestData.connection_string = form.connection_string
    } else {
      requestData = {
        ...requestData,
        host: form.host,
        port: form.port || getDefaultPort(form.type),
        username: form.username,
        password: form.password
      }
    }

    const result = await databaseStore.getAvailableSchemas(requestData)

    if (result.success) {
      availableSchemas.value = result.schemas
      selectedSchemas.value = ['public']
    }
  }
}

const resetDatabaseSelection = () => {
  showDatabaseSelect.value = false
  availableDatabases.value = []
  databasesWithWarnings.value = []
  availableSchemas.value = []
  selectedSchemas.value = []
  form.database = ''
}

const handleSubmit = () => {
  let submitData = {
    name: form.name,
    type: form.type,
    chatbot_id: form.chatbot_id,
    database: form.database,
    use_connection_string: connectionMethod.value === 'string'
  }

  if (connectionMethod.value === 'string') {
    submitData.connection_string = form.connection_string
  } else {
    submitData = {
      ...submitData,
      host: form.host,
      port: form.port,
      username: form.username,
      password: form.password
    }
  }

  // Add schemas for PostgreSQL
  if (form.type === 'postgresql' && selectedSchemas.value.length > 0) {
    submitData.schemas = selectedSchemas.value
  }

  emit('submit', submitData)
}

// Reset form when modal closes
watch(() => props.show, (show) => {
  if (!show) {
    connectionMethod.value = 'manual'
    showDatabaseSelect.value = false
    availableDatabases.value = []
    availableSchemas.value = []
    selectedSchemas.value = []
    loadingDatabases.value = false
    Object.assign(form, {
      name: '',
      type: '',
      chatbot_id: '',
      host: '',
      port: '',
      database: '',
      username: '',
      password: '',
      schema: '',
      connection_string: '',
      use_connection_string: false
    })
  }
})

// Watch for connection method changes
watch(connectionMethod, () => {
  resetDatabaseSelection()
})

// Watch for type changes
watch(() => form.type, () => {
  resetDatabaseSelection()
})
</script>