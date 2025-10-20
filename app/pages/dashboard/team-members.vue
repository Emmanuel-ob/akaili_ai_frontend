<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Team Members</h1>

    <!-- Add Member Card -->
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <h2 class="text-lg font-semibold mb-4">Add Admin Account</h2>
      <form @submit.prevent="addMember" class="grid gap-3 md:grid-cols-2">
        <input
          v-model="newMember.name"
          type="text"
          placeholder="Admin Name"
          class="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-purple-500 outline-none"
          required
        />
        <input
          v-model="newMember.email"
          type="email"
          placeholder="Admin Email"
          class="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-purple-500 outline-none"
          required
        />
        <input
          v-model="newMember.password"
          type="password"
          placeholder="Password"
          class="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-purple-500 outline-none"
          required
        />
        <select
          v-model="newMember.accountType"
          class="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-purple-500 outline-none"
        >
          <option value="internal">Internal</option>
          <option value="external">External</option>
        </select>

        <!-- Roles column spanning 2 columns on mobile -->
        <div class="md:col-span-2 pt-3 mt-3">
          <label class="block font-medium mb-2">Assign Roles</label>

          <div class="flex items-center gap-4 mb-3">
            <label class="flex items-center gap-2">
              <input
                type="checkbox"
                v-model="newMember.roles.superAdmin"
                @change="onNewSuperAdminChange"
                class="w-4 h-4"
              />
              <span class="text-sm">Super Admin</span>
            </label>

            <label class="flex items-center gap-2">
              <input
                type="checkbox"
                v-model="newMember.roles.admin"
                :disabled="newMember.roles.superAdmin"
                @change="onNewAdminToggle"
                class="w-4 h-4"
              />
              <span class="text-sm">Admin</span>
            </label>
          </div>

          <!-- Permissions panel (only visible if admin is checked and superAdmin is not) -->
          <div v-if="newMember.roles.admin && !newMember.roles.superAdmin" class="pl-3 border-l">
            <p class="text-sm text-gray-600 mb-2">Admin Permissions</p>
            <div class="flex flex-wrap gap-3">
              <label class="flex items-center gap-2 text-sm">
                <input type="checkbox" v-model="newMember.roles.permissions.view" class="w-4 h-4" />
                View admins
              </label>
              <label class="flex items-center gap-2 text-sm">
                <input type="checkbox" v-model="newMember.roles.permissions.create" class="w-4 h-4" />
                Create admins
              </label>
              <label class="flex items-center gap-2 text-sm">
                <input type="checkbox" v-model="newMember.roles.permissions.edit" class="w-4 h-4" />
                Edit admins
              </label>
              <label class="flex items-center gap-2 text-sm">
                <input type="checkbox" v-model="newMember.roles.permissions.delete" class="w-4 h-4" />
                Delete admins
              </label>
            </div>
          </div>

        </div>

        <div class="md:col-span-2 flex justify-end gap-3 mt-4">
          <button type="reset" @click="resetNew" class="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
            Reset
          </button>
          <button type="submit" class="bg-[#7F56D9] text-white px-5 py-2 rounded-lg shadow hover:bg-[#6C47B5]">
            Add Admin
          </button>
        </div>
      </form>
    </div>

    <!-- Members List -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold text-gray-700">Current Admins</h2>
        <div class="text-sm text-gray-500">Total: {{ members.length }}</div>
      </div>

      <div v-if="members.length === 0" class="text-gray-500 text-sm">No admins added yet.</div>

      <ul v-else class="divide-y divide-gray-200">
        <li
          v-for="(member, index) in members"
          :key="member.id"
          class="flex flex-col md:flex-row justify-between items-start md:items-center py-4"
        >
          <div>
            <p class="text-gray-900 font-medium">{{ member.name }}</p>
            <p class="text-gray-500 text-sm">{{ member.email }} • <span class="capitalize">{{ member.accountType }}</span></p>

            <div class="mt-2 flex flex-wrap gap-2">
              <span
                v-if="member.roles.superAdmin"
                class="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-700"
              >Super Admin</span>

              <span v-else-if="member.roles.admin" class="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                Admin
              </span>

              <template v-if="member.roles.admin && !member.roles.superAdmin">
                <span v-if="member.roles.permissions.view" class="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800">view</span>
                <span v-if="member.roles.permissions.create" class="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800">create</span>
                <span v-if="member.roles.permissions.edit" class="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800">edit</span>
                <span v-if="member.roles.permissions.delete" class="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800">delete</span>
              </template>
            </div>
          </div>

          <div class="flex gap-2 mt-3 md:mt-0">
            <button
              @click="openEdit(index)"
              class="px-3 py-1 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Edit
            </button>
            <button
              @click="deleteMember(index)"
              class="px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </li>
      </ul>
    </div>

    <!-- Edit Modal -->
    <div v-if="editIndex !== null" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-[95%] md:w-[520px] shadow-lg">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Edit Admin</h3>
          <button @click="cancelEdit" class="text-gray-500 hover:text-gray-700">&times;</button>
        </div>

        <form @submit.prevent="updateMember" class="grid gap-3">
          <input
            v-model="editMemberData.name"
            type="text"
            placeholder="Admin Name"
            class="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-purple-500 outline-none"
            required
          />

          <input
            v-model="editMemberData.email"
            type="email"
            placeholder="Admin Email"
            class="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-purple-500 outline-none"
            required
          />

          <input
            v-model="editMemberData.password"
            type="password"
            placeholder="Password (leave blank to keep current)"
            class="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-purple-500 outline-none"
          />

          <select
            v-model="editMemberData.accountType"
            class="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="internal">Internal</option>
            <option value="external">External</option>
          </select>

          <div>
            <label class="block font-medium mb-2">Assign Roles</label>

            <div class="flex items-center gap-4 mb-3">
              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  v-model="editMemberData.roles.superAdmin"
                  @change="onEditSuperAdminChange"
                  class="w-4 h-4"
                />
                <span class="text-sm">Super Admin</span>
              </label>

              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  v-model="editMemberData.roles.admin"
                  :disabled="editMemberData.roles.superAdmin"
                  @change="onEditAdminToggle"
                  class="w-4 h-4"
                />
                <span class="text-sm">Admin</span>
              </label>
            </div>

            <div v-if="editMemberData.roles.admin && !editMemberData.roles.superAdmin" class="pl-3 border-l">
              <p class="text-sm text-gray-600 mb-2">Admin Permissions</p>
              <div class="flex flex-wrap gap-3">
                <label class="flex items-center gap-2 text-sm">
                  <input type="checkbox" v-model="editMemberData.roles.permissions.view" class="w-4 h-4" />
                  View admins
                </label>
                <label class="flex items-center gap-2 text-sm">
                  <input type="checkbox" v-model="editMemberData.roles.permissions.create" class="w-4 h-4" />
                  Create admins
                </label>
                <label class="flex items-center gap-2 text-sm">
                  <input type="checkbox" v-model="editMemberData.roles.permissions.edit" class="w-4 h-4" />
                  Edit admins
                </label>
                <label class="flex items-center gap-2 text-sm">
                  <input type="checkbox" v-model="editMemberData.roles.permissions.delete" class="w-4 h-4" />
                  Delete admins
                </label>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-2">
            <button type="button" @click="cancelEdit" class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2 bg-[#7F56D9] text-white rounded-lg hover:bg-[#6C47B5]">Save</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { nanoid } from 'nanoid' // optional, generates small unique ids. `npm i nanoid` or remove and use Date.now()

definePageMeta({
  layout: 'dashboard'
})

const members = ref([
  {
    id: nanoid(),
    name: 'John Doe',
    email: 'john@example.com',
    password: '', 
    accountType: 'internal',
    roles: {
      superAdmin: true,
      admin: false,
      permissions: { view: true, create: true, edit: true, delete: true }
    }
  },
  {
    id: nanoid(),
    name: 'Sarah Smith',
    email: 'sarah@company.com',
    password: '',
    accountType: 'internal',
    roles: {
      superAdmin: false,
      admin: true,
      permissions: { view: true, create: false, edit: true, delete: false }
    }
  }
])

// reactive prototypes
const newMember = reactive({
  name: '',
  email: '',
  password: '',
  accountType: 'internal',
  roles: {
    superAdmin: false,
    admin: false,
    permissions: { view: false, create: false, edit: false, delete: false }
  }
})

const editIndex = ref(null) // index in members[] being edited
const editMemberData = reactive({
  id: '',
  name: '',
  email: '',
  password: '',
  accountType: 'internal',
  roles: {
    superAdmin: false,
    admin: false,
    permissions: { view: false, create: false, edit: false, delete: false }
  }
})

// helpers
function resetNew() {
  newMember.name = ''
  newMember.email = ''
  newMember.password = ''
  newMember.accountType = 'internal'
  newMember.roles.superAdmin = false
  newMember.roles.admin = false
  newMember.roles.permissions.view = false
  newMember.roles.permissions.create = false
  newMember.roles.permissions.edit = false
  newMember.roles.permissions.delete = false
}

function onNewSuperAdminChange() {
  if (newMember.roles.superAdmin) {
    // grant full permissions
    newMember.roles.admin = false
    newMember.roles.permissions.view = true
    newMember.roles.permissions.create = true
    newMember.roles.permissions.edit = true
    newMember.roles.permissions.delete = true
  } else {
    // remove super powers but keep existing admin flag off
    newMember.roles.permissions.view = false
    newMember.roles.permissions.create = false
    newMember.roles.permissions.edit = false
    newMember.roles.permissions.delete = false
  }
}

function onNewAdminToggle() {
  if (newMember.roles.admin) {
    // ensure at least view is selected for convenience (optional)
    if (!Object.values(newMember.roles.permissions).some(Boolean)) {
      newMember.roles.permissions.view = true
    }
  } else {
    newMember.roles.permissions.view = false
    newMember.roles.permissions.create = false
    newMember.roles.permissions.edit = false
    newMember.roles.permissions.delete = false
  }
}

function addMember() {
  // basic client-side validation
  if (!newMember.name || !newMember.email || !newMember.password) return

  // if superAdmin selected set full perms regardless of admin box
  const roles = {
    superAdmin: !!newMember.roles.superAdmin,
    admin: !!newMember.roles.admin && !newMember.roles.superAdmin,
    permissions: { ...newMember.roles.permissions }
  }
  if (roles.superAdmin) {
    roles.admin = false
    roles.permissions = { view: true, create: true, edit: true, delete: true }
  }

  const payload = {
    id: nanoid(),
    name: newMember.name,
    email: newMember.email,
    password: newMember.password, // demo only
    accountType: newMember.accountType,
    roles
  }

  members.value.push(payload)
  resetNew()
  // In production you'd call an API to create/auth user and persist roles server-side
}

function deleteMember(index) {
  // optional: confirm
  if (!confirm('Delete this admin?')) return
  members.value.splice(index, 1)
}

function openEdit(index) {
  editIndex.value = index
  const m = members.value[index]
  // deep-copy into editMemberData
  editMemberData.id = m.id
  editMemberData.name = m.name
  editMemberData.email = m.email
  editMemberData.password = '' // blank => keep existing
  editMemberData.accountType = m.accountType || 'internal'
  editMemberData.roles.superAdmin = !!m.roles.superAdmin
  editMemberData.roles.admin = !!m.roles.admin
  editMemberData.roles.permissions = { ...m.roles.permissions }
}

function cancelEdit() {
  editIndex.value = null
  editMemberData.id = ''
  editMemberData.name = ''
  editMemberData.email = ''
  editMemberData.password = ''
  editMemberData.accountType = 'internal'
  editMemberData.roles.superAdmin = false
  editMemberData.roles.admin = false
  editMemberData.roles.permissions = { view: false, create: false, edit: false, delete: false }
}

function onEditSuperAdminChange() {
  if (editMemberData.roles.superAdmin) {
    editMemberData.roles.admin = false
    editMemberData.roles.permissions.view = true
    editMemberData.roles.permissions.create = true
    editMemberData.roles.permissions.edit = true
    editMemberData.roles.permissions.delete = true
  } else {
    editMemberData.roles.permissions.view = false
    editMemberData.roles.permissions.create = false
    editMemberData.roles.permissions.edit = false
    editMemberData.roles.permissions.delete = false
  }
}

function onEditAdminToggle() {
  if (editMemberData.roles.admin) {
    if (!Object.values(editMemberData.roles.permissions).some(Boolean)) {
      editMemberData.roles.permissions.view = true
    }
  } else {
    editMemberData.roles.permissions.view = false
    editMemberData.roles.permissions.create = false
    editMemberData.roles.permissions.edit = false
    editMemberData.roles.permissions.delete = false
  }
}

function updateMember() {
  if (editIndex.value === null) return

  const idx = editIndex.value
  const original = members.value[idx]

  // merge changes (if password blank, keep old)
  const updated = {
    ...original,
    name: editMemberData.name,
    email: editMemberData.email,
    accountType: editMemberData.accountType,
    password: editMemberData.password ? editMemberData.password : original.password,
    roles: {
      superAdmin: !!editMemberData.roles.superAdmin,
      admin: !!editMemberData.roles.admin && !editMemberData.roles.superAdmin,
      permissions: { ...editMemberData.roles.permissions }
    }
  }

  if (updated.roles.superAdmin) {
    updated.roles.admin = false
    updated.roles.permissions = { view: true, create: true, edit: true, delete: true }
  }

  members.value[idx] = updated
  cancelEdit()
  // persist to backend in production
}


</script>
