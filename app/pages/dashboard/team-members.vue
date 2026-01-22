<!-- team-members.vue -->
<template>
  <div class="p-6 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Team Members</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your team, assign roles, and control access permissions.</p>
      </div>
      <button @click="showAddModal = true"
        class="bg-[#9E4CFF] hover:bg-[#8B3DFF] text-white px-6 py-2.5 rounded-xl shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span class="font-medium">Add Member</span>
      </button>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Total Members -->
      <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-800 transition-colors group hover:border-purple-200 dark:hover:border-purple-900/50">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Members</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">{{ teamStore.statistics.total_users || 0 }}</p>
          </div>
          <div class="w-14 h-14 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg class="w-7 h-7 text-[#9E4CFF] dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-9a4 4 0 11-8 0 4 4 0 018 0zm8 4a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Active Roles -->
      <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-800 transition-colors group hover:border-blue-200 dark:hover:border-blue-900/50">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Active Roles</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">{{ teamStore.statistics.total_roles || 0 }}</p>
          </div>
          <div class="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg class="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Customer Reps -->
      <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-800 transition-colors group hover:border-green-200 dark:hover:border-green-900/50">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Customer Reps</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">{{ teamStore.roleDistribution.customer_rep || 0 }}</p>
          </div>
          <div class="w-14 h-14 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg class="w-7 h-7 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="teamStore.loading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9E4CFF]"></div>
    </div>

    <!-- Members List -->
    <div v-else class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm dark:shadow-none border border-gray-200 dark:border-slate-800 overflow-hidden transition-colors">
      <!-- Table Header (Visible on Desktop) -->
      <div class="hidden md:grid md:grid-cols-12 gap-4 p-5 border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        <div class="col-span-4">User Details</div>
        <div class="col-span-5">Roles & Permissions</div>
        <div class="col-span-3 text-right">Actions</div>
      </div>

      <div v-if="teamStore.sortedMembers.length === 0" class="p-16 text-center">
        <div class="bg-gray-50 dark:bg-slate-800/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">No team members yet</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">Invite your colleagues to start collaborating.</p>
        <button @click="showAddModal = true" class="text-[#9E4CFF] hover:text-[#8B3DFF] font-medium">
            + Add first member
        </button>
      </div>

      <div v-else class="divide-y divide-gray-200 dark:divide-slate-800">
        <div v-for="member in teamStore.sortedMembers" :key="member.id" 
             class="p-5 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
          <div class="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
            
            <!-- User Info -->
            <div class="w-full md:col-span-4 flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center text-[#9E4CFF] dark:text-purple-400 font-bold text-lg">
                {{ member.name.charAt(0).toUpperCase() }}
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                    <h3 class="text-gray-900 dark:text-white font-medium text-base truncate">{{ member.name }}</h3>
                    <span v-if="member.is_owner"
                    class="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold border border-amber-200 dark:border-amber-800/50 uppercase tracking-wide">
                    Owner
                    </span>
                </div>
                <p class="text-gray-500 dark:text-gray-400 text-sm truncate">{{ member.email }}</p>
              </div>
            </div>

            <!-- Roles -->
            <div class="w-full md:col-span-5">
              <div v-if="member.roles && Object.keys(member.roles).length > 0" class="flex flex-wrap gap-2">
                <div v-for="(permissions, roleName) in member.roles" :key="roleName" 
                     class="bg-gray-100 dark:bg-slate-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-slate-700">
                    <div class="font-semibold text-gray-700 dark:text-gray-200 text-xs uppercase tracking-wide mb-1 flex items-center gap-1">
                        <div class="w-1.5 h-1.5 rounded-full bg-[#9E4CFF]"></div>
                        {{ formatRoleName(roleName) }}
                    </div>
                    <div v-if="permissions && Object.keys(permissions).length > 0" class="flex flex-wrap gap-1">
                         <span v-for="perm in permissions" :key="perm" class="text-[10px] text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-gray-200 dark:border-slate-600">
                            {{ formatRoleName(perm) }}
                         </span>
                    </div>
                </div>
              </div>
              <div v-else>
                <span class="text-sm text-gray-400 dark:text-gray-500 italic">No specific roles assigned</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="w-full md:col-span-3 flex md:justify-end gap-2 mt-4 md:mt-0">
              <div v-if="!member.is_owner" class="flex items-center bg-gray-50 dark:bg-slate-800 rounded-lg p-1 border border-gray-200 dark:border-slate-700">
                  <button @click="openManageRoles(member)" class="p-2 text-gray-600 dark:text-gray-400 hover:text-[#9E4CFF] hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all" title="Manage Roles">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                  </button>
                  <div class="w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"></div>
                  <button @click="openEdit(member)" class="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all" title="Edit Details">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <div class="w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"></div>
                  <button @click="confirmDelete(member)" class="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all" title="Remove Member">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Member Modal -->
    <BaseModal :show="showAddModal" @close="closeAddModal">
      <template #header>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Add Team Member</h3>
      </template>
      <template #body>
        <form @submit.prevent="addMember" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
            <input v-model="newMember.name" type="text" required
              class="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all shadow-sm"
              placeholder="e.g. Jane Doe" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
            <input v-model="newMember.email" type="email" required
              class="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all shadow-sm"
              placeholder="jane@company.com" />
          </div>

          <!-- Roles Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assign Roles & Permissions</label>
            <div class="max-h-80 overflow-y-auto custom-scrollbar border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50/50 dark:bg-slate-900/50 p-4 space-y-3">
              <div v-for="role in teamStore.rolesList" :key="role.name"
                class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-3 transition-colors hover:border-purple-200 dark:hover:border-purple-800">
                <label class="flex items-center gap-3 cursor-pointer select-none">
                  <div class="relative flex items-center">
                    <input type="checkbox" v-model="newMember.roles[role.name].enabled"
                      @change="toggleRole(newMember.roles, role.name)" 
                      class="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 transition-all checked:border-[#9E4CFF] checked:bg-[#9E4CFF]" />
                    <svg class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 w-3.5 h-3.5" viewBox="0 0 14 14" fill="none"><path d="M3 8L6 11L11 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                  </div>
                  <span class="font-semibold text-gray-800 dark:text-white">{{ role.label }}</span>
                </label>

                <!-- Subroles -->
                <div v-if="role.subroles.length > 0" 
                     class="mt-3 ml-2 pl-4 border-l-2 border-gray-200 dark:border-slate-700 space-y-2 transition-all duration-300"
                     :class="newMember.roles[role.name].enabled ? 'opacity-100 max-h-96' : 'opacity-40 grayscale max-h-0 overflow-hidden'">
                  <label v-for="subrole in role.subroles" :key="subrole.name"
                    class="flex items-center gap-2.5 cursor-pointer select-none group">
                     <div class="relative flex items-center">
                        <input type="checkbox" v-model="newMember.roles[role.name].permissions[subrole.name]"
                          :disabled="!newMember.roles[role.name].enabled"
                          class="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 transition-all checked:border-purple-500 checked:bg-purple-500 disabled:cursor-not-allowed" />
                        <svg class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 w-3 h-3" viewBox="0 0 14 14" fill="none"><path d="M3 8L6 11L11 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                     </div>
                    <span class="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{{ subrole.label }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
            <button type="button" @click="closeAddModal"
              class="px-5 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" :disabled="teamStore.loading"
              class="px-5 py-2.5 bg-[#9E4CFF] hover:bg-[#8B3DFF] text-white rounded-xl shadow-lg shadow-purple-500/20 font-medium disabled:opacity-50 disabled:shadow-none transition-all">
              {{ teamStore.loading ? 'Adding...' : 'Add Member' }}
            </button>
          </div>
        </form>
      </template>
    </BaseModal>

    <!-- Edit Member Modal -->
    <BaseModal :show="showEditModal" @close="closeEditModal">
      <template #header>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Edit Team Member</h3>
      </template>
      <template #body>
        <form @submit.prevent="updateMember" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
            <input v-model="editMember.name" type="text" required
              class="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-purple-500 outline-none transition-colors" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
            <input v-model="editMember.email" type="email" required
              class="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-purple-500 outline-none transition-colors" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              New Password <span class="text-gray-400 font-normal ml-1">(Optional)</span>
            </label>
            <input v-model="editMember.password" type="password"
              class="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-purple-500 outline-none transition-colors"
              placeholder="Leave blank to keep current password" />
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
            <button type="button" @click="closeEditModal"
              class="px-5 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" :disabled="teamStore.loading"
              class="px-5 py-2.5 bg-[#9E4CFF] hover:bg-[#8B3DFF] text-white rounded-xl shadow-lg shadow-purple-500/20 font-medium disabled:opacity-50 disabled:shadow-none transition-all">
              {{ teamStore.loading ? 'Updating...' : 'Update Member' }}
            </button>
          </div>
        </form>
      </template>
    </BaseModal>

    <!-- Manage Roles Modal -->
    <BaseModal :show="showRolesModal" @close="closeRolesModal">
      <template #header>
        <div class="flex flex-col">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Manage Roles</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Editing permissions for <span class="text-purple-600 dark:text-purple-400 font-medium">{{ rolesMember?.name }}</span></p>
        </div>
      </template>
      <template #body>
        <form @submit.prevent="updateRoles" class="space-y-4">
          <div class="max-h-[500px] overflow-y-auto custom-scrollbar border border-gray-200 dark:border-slate-700 rounded-xl p-4 bg-gray-50 dark:bg-slate-900/50 space-y-3">
            <div v-for="role in teamStore.rolesList" :key="role.name" 
                 class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-3 transition-all hover:shadow-md">
              <label class="flex items-center gap-3 cursor-pointer select-none">
                 <div class="relative flex items-center">
                    <input type="checkbox" v-model="editRoles[role.name].enabled" @change="toggleRole(editRoles, role.name)"
                      class="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 transition-all checked:border-purple-500 checked:bg-purple-500" />
                    <svg class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 w-3.5 h-3.5" viewBox="0 0 14 14" fill="none"><path d="M3 8L6 11L11 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                 </div>
                <span class="font-bold text-gray-800 dark:text-white">{{ role.label }}</span>
              </label>

              <!-- Subroles -->
              <div v-if="role.subroles.length > 0" 
                   class="mt-3 ml-2 pl-4 border-l-2 border-gray-200 dark:border-slate-700 space-y-2 transition-all duration-300"
                   :class="editRoles[role.name].enabled ? 'opacity-100 max-h-96' : 'opacity-40 grayscale pointer-events-none'">
                <p class="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider mb-2">Detailed Permissions</p>
                <label v-for="subrole in role.subroles" :key="subrole.name"
                  class="flex items-center gap-2.5 cursor-pointer select-none group p-1.5 rounded hover:bg-gray-50 dark:hover:bg-slate-700/50">
                  <div class="relative flex items-center">
                    <input type="checkbox" v-model="editRoles[role.name].permissions[subrole.name]" 
                        :disabled="!editRoles[role.name].enabled"
                        class="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 transition-all checked:border-purple-500 checked:bg-purple-500 disabled:cursor-not-allowed" />
                    <svg class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 w-3 h-3" viewBox="0 0 14 14" fill="none"><path d="M3 8L6 11L11 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                  </div>
                  <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{{ subrole.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
            <button type="button" @click="closeRolesModal"
              class="px-5 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" :disabled="teamStore.loading"
              class="px-5 py-2.5 bg-[#9E4CFF] hover:bg-[#8B3DFF] text-white rounded-xl shadow-lg shadow-purple-500/20 font-medium disabled:opacity-50 disabled:shadow-none transition-all">
              {{ teamStore.loading ? 'Updating...' : 'Save Roles' }}
            </button>
          </div>
        </form>
      </template>
    </BaseModal>

    <!-- Error Toast -->
    <div v-if="teamStore.error"
      class="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-fade-in max-w-sm">
      <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span class="text-sm font-medium">{{ teamStore.error }}</span>
      <button @click="teamStore.clearError()" class="text-white/80 hover:text-white ml-auto">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>

    <!-- Success Toast -->
    <div v-if="successMessage"
      class="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-fade-in max-w-sm">
      <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
      <span class="text-sm font-medium">{{ successMessage }}</span>
      <button @click="successMessage = ''" class="text-white/80 hover:text-white ml-auto">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useTeamStore } from '~/stores/teamStore'

definePageMeta({
  layout: 'dashboard'
})

const teamStore = useTeamStore()
const successMessage = ref('')

// Modal states
const showAddModal = ref(false)
const showEditModal = ref(false)
const showRolesModal = ref(false)


// Initialize roles structure
const initializeRoles = () => {
  const rolesObj = {}
  teamStore.rolesList.forEach(role => {
    rolesObj[role.name] = {
      enabled: false,
      permissions: {}
    }
    role.subroles.forEach(sub => {
      rolesObj[role.name].permissions[sub.name] = false
    })
  })
  return rolesObj
}

// Form data
const newMember = reactive({
  name: '',
  email: '',
  roles: initializeRoles()
})

const editMember = reactive({
  id: null,
  name: '',
  email: '',
  password: ''
})

const editRoles = reactive({})
const rolesMember = ref(null)

// Toggle role and handle subroles
const toggleRole = (rolesObj, roleName) => {
  if (!rolesObj[roleName].enabled) {
    // Disable all permissions when role is disabled
    Object.keys(rolesObj[roleName].permissions).forEach(key => {
      rolesObj[roleName].permissions[key] = false
    })
  }
}

// Format role name for display
const formatRoleName = (name) => {
  if (typeof name !== 'string') return ''
  return name
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// Convert roles object to API format
const convertRolesToApiFormat = (rolesObj) => {
  const apiRoles = {}
  Object.entries(rolesObj).forEach(([roleName, roleData]) => {
    if (roleData.enabled) {
      const hasSubroles = Object.keys(roleData.permissions).length > 0
      if (hasSubroles) {
        const enabledPermissions = {}
        Object.entries(roleData.permissions).forEach(([permName, value]) => {
          if (value) {
            enabledPermissions[permName] = true
          }
        })
        if (Object.keys(enabledPermissions).length > 0) {
          apiRoles[roleName] = enabledPermissions
        }
      } else {
        apiRoles[roleName] = true
      }
    }
  })
  return apiRoles
}

// Convert API roles to form format
const convertApiRolesToFormFormat = (memberRoles) => {
  const formRoles = initializeRoles()
  if (!memberRoles) return formRoles

  Object.entries(memberRoles).forEach(([roleName, permissions]) => {
    if (formRoles[roleName]) {
      formRoles[roleName].enabled = true
      if (typeof permissions === 'object') {
        Object.entries(permissions).forEach(([permName, value]) => {
          if (formRoles[roleName].permissions[permName] !== undefined) {
            formRoles[roleName].permissions[permName] = !!value
          }
        })
      }
    }
  })
  return formRoles
}

// Modal handlers
const closeAddModal = () => {
  showAddModal.value = false
  newMember.name = ''
  newMember.email = ''
  newMember.roles = initializeRoles()
}

const closeEditModal = () => {
  showEditModal.value = false
  editMember.id = null
  editMember.name = ''
  editMember.email = ''
  editMember.password = ''
}

const closeRolesModal = () => {
  showRolesModal.value = false
  rolesMember.value = null
  Object.assign(editRoles, {})
}

const openEdit = (member) => {
  editMember.id = member.id
  editMember.name = member.name
  editMember.email = member.email
  editMember.password = ''
  showEditModal.value = true
}

const openManageRoles = (member) => {
  rolesMember.value = member
  Object.assign(editRoles, convertApiRolesToFormFormat(member.roles))
  showRolesModal.value = true
}

// CRUD operations
const addMember = async () => {
  try {
    const apiRoles = convertRolesToApiFormat(newMember.roles)
    await teamStore.addTeamMember({
      name: newMember.name,
      email: newMember.email,
      roles: apiRoles
    })
    successMessage.value = 'Team member invited successfully!'
    closeAddModal()
    setTimeout(() => { successMessage.value = '' }, 5000)
  } catch (error) {
    console.error('Failed to add member:', error)
  }
}

const updateMember = async () => {
  try {
    const data = {
      name: editMember.name,
      email: editMember.email
    }
    if (editMember.password) {
      data.password = editMember.password
    }
    await teamStore.updateTeamMember(editMember.id, data)
    successMessage.value = 'Team member updated successfully!'
    closeEditModal()
    setTimeout(() => { successMessage.value = '' }, 3000)
  } catch (error) {
    console.error('Failed to update member:', error)
  }
}

const updateRoles = async () => {
  try {
    const apiRoles = convertRolesToApiFormat(editRoles)
    await teamStore.updateMemberRoles(rolesMember.value.id, apiRoles)
    successMessage.value = 'Roles updated successfully!'
    closeRolesModal()
    setTimeout(() => { successMessage.value = '' }, 3000)
  } catch (error) {
    console.error('Failed to update roles:', error)
  }
}

const confirmDelete = async (member) => {
  if (!confirm(`Are you sure you want to remove ${member.name} from the team?`)) return

  try {
    await teamStore.deleteTeamMember(member.id)
    successMessage.value = 'Team member removed successfully!'
    setTimeout(() => { successMessage.value = '' }, 3000)
  } catch (error) {
    console.error('Failed to delete member:', error)
  }
}

// Initialize
onMounted(async () => {
  await teamStore.fetchTeamMembers()
  newMember.roles = initializeRoles()
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Custom Scrollbar for Modal content */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}
.dark .custom-scrollbar {
  scrollbar-color: #475569 transparent;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #475569;
}
</style>