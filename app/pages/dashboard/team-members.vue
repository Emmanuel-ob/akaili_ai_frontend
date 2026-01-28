<!-- pages/dashboard/team-members.vue -->
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
      <!-- Table Header (Desktop) -->
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

            <!-- Roles (Pills) -->
            <div class="w-full md:col-span-5">
              <div v-if="member.roles && Object.keys(member.roles).length > 0" class="flex flex-wrap gap-2">
                 <!-- Role Badges (Clickable) -->
                <button v-for="(permissions, roleName) in member.roles" :key="roleName" 
                     @click="viewRoleDetails(roleName, permissions)"
                     class="group/role inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 dark:bg-slate-800 dark:hover:bg-purple-900/30 dark:text-gray-300 dark:hover:text-purple-300 border border-gray-200 dark:border-slate-700 transition-colors cursor-pointer">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#9E4CFF] mr-1.5"></span>
                    {{ formatRoleName(roleName) }}
                    <svg class="w-3 h-3 ml-1 text-gray-400 group-hover/role:text-[#9E4CFF] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
              </div>
              <div v-else>
                <span class="text-sm text-gray-400 dark:text-gray-500 italic">No roles assigned</span>
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

    <!-- Role Details Modal (Shows permissions correctly) -->
    <BaseModal :show="showRoleDetailModal" :title="formatRoleName(selectedRoleName)" size="sm" @close="showRoleDetailModal = false">
        <template #body>
            <div class="mb-4">
                <p class="text-xs text-gray-500 dark:text-gray-400">Permissions granted to this role:</p>
            </div>
            
            <div class="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto custom-scrollbar p-1">
                <div v-for="perm in selectedRolePermissions" :key="perm" 
                     class="flex items-center p-2 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                    <div class="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></div>
                    <span class="text-xs font-medium text-gray-700 dark:text-gray-200">{{ formatRoleName(perm) }}</span>
                </div>
                <div v-if="selectedRolePermissions.length === 0" class="col-span-2 text-center py-4 text-sm text-gray-400 italic">
                    No specific permissions listed.
                </div>
            </div>
            
            <div class="mt-6 flex justify-end">
                <button @click="showRoleDetailModal = false" class="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition font-medium text-xs">
                    Close
                </button>
            </div>
        </template>
    </BaseModal>

    <!-- Manage Roles Modal (With Select All) -->
    <BaseModal :show="showRolesModal" @close="closeRolesModal">
      <template #header>
        <div class="flex flex-col w-full">
            <div class="flex justify-between items-center w-full">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">Manage Roles</h3>
                <!-- Main Select All Button -->
                <button @click="toggleAllRoles(!areAllRolesSelected)" class="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline">
                    {{ areAllRolesSelected ? 'Deselect All' : 'Select All' }}
                </button>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Editing: <span class="text-purple-600 dark:text-purple-400 font-medium">{{ rolesMember?.name }}</span></p>
        </div>
      </template>
      <template #body>
        <form @submit.prevent="updateRoles" class="space-y-4">
          <div class="max-h-[500px] overflow-y-auto custom-scrollbar border border-gray-200 dark:border-slate-700 rounded-xl p-4 bg-gray-50 dark:bg-slate-900/50 space-y-3">
            <div v-for="role in teamStore.rolesList" :key="role.name" 
                 class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-3 transition-all hover:shadow-sm">
              <div class="flex justify-between items-center">
                  <label class="flex items-center gap-3 cursor-pointer select-none">
                     <input type="checkbox" v-model="editRoles[role.name].enabled" @change="toggleRole(editRoles, role.name)"
                        class="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500 cursor-pointer" />
                     <span class="font-bold text-gray-800 dark:text-white">{{ role.label }}</span>
                  </label>
                  
                  <!-- Subrole Select All -->
                  <button v-if="role.subroles.length > 0 && editRoles[role.name].enabled" 
                          type="button"
                          @click="toggleSubroles(role.name)" 
                          class="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                      {{ areAllSubrolesSelected(role.name) ? 'Clear' : 'All' }}
                  </button>
              </div>

              <!-- Subroles -->
              <div v-if="role.subroles.length > 0 && editRoles[role.name].enabled" 
                   class="mt-3 ml-2 pl-4 border-l-2 border-gray-200 dark:border-slate-700 space-y-2 grid grid-cols-2 gap-x-4">
                <label v-for="subrole in role.subroles" :key="subrole.name"
                  class="flex items-center gap-2 cursor-pointer select-none p-1 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded">
                  <input type="checkbox" v-model="editRoles[role.name].permissions[subrole.name]" 
                      :disabled="!editRoles[role.name].enabled"
                      class="w-3.5 h-3.5 text-purple-600 rounded border-gray-300 focus:ring-purple-500 cursor-pointer" />
                  <span class="text-xs text-gray-700 dark:text-gray-300">{{ subrole.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
            <button type="button" @click="closeRolesModal" class="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 text-xs font-medium">Cancel</button>
            <button type="submit" :disabled="teamStore.loading" class="px-4 py-2 bg-[#9E4CFF] hover:bg-[#8B3DFF] text-white rounded-lg shadow-sm text-xs font-medium disabled:opacity-50">{{ teamStore.loading ? 'Updating...' : 'Save Roles' }}</button>
          </div>
        </form>
      </template>
    </BaseModal>

    <!-- Delete Confirmation Modal (NEW) -->
    <BaseModal :show="showDeleteModal" title="Remove Member" size="sm" @close="closeDeleteModal">
      <template #body>
        <div class="text-center py-2" @keydown.enter.prevent="executeDelete" tabindex="0" ref="deleteModalContainer">
           <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 dark:bg-red-500/10 mb-6 transition-colors">
              <svg class="h-8 w-8 text-red-600 dark:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
           </div>
           <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Remove Member?</h3>
           <p class="text-sm text-gray-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
             Are you sure you want to remove <strong class="text-gray-900 dark:text-white">{{ memberToDelete?.name }}</strong>? This action cannot be undone.
           </p>
        </div>
        <div class="mt-8 flex justify-end gap-3">
           <button @click="closeDeleteModal"
             class="px-5 py-2.5 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none transition-colors font-medium">
             Cancel
           </button>
           <button @click="executeDelete"
             class="px-5 py-2.5 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-slate-900 transition-colors font-medium">
             Remove Member
           </button>
        </div>
      </template>
    </BaseModal>

    <!-- Add Member Modal -->
    <BaseModal :show="showAddModal" @close="closeAddModal">
      <template #header><h3 class="text-xl font-bold text-gray-900 dark:text-white">Add Team Member</h3></template>
      <template #body>
        <form @submit.prevent="addMember" class="space-y-4">
          <div><label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name</label><input v-model="newMember.name" type="text" required class="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none" placeholder="e.g. Jane Doe" /></div>
          <div><label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Email</label><input v-model="newMember.email" type="email" required class="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none" placeholder="jane@company.com" /></div>
          <!-- Roles Selection for Add (Same Select All Logic) -->
           <div>
            <div class="flex justify-between items-center mb-1">
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300">Assign Roles</label>
                <button type="button" @click="toggleAllRoles(null, newMember.roles)" class="text-[10px] font-bold text-purple-600 hover:underline">Select All</button>
            </div>
            <div class="max-h-60 overflow-y-auto custom-scrollbar border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50/50 dark:bg-slate-900/50 p-2 space-y-1">
              <div v-for="role in teamStore.rolesList" :key="role.name" class="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors">
                 <label class="flex items-center gap-3 cursor-pointer"><input type="checkbox" v-model="newMember.roles[role.name].enabled" class="w-4 h-4 text-purple-600 rounded" /><span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ role.label }}</span></label>
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800"><button type="button" @click="closeAddModal" class="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-600 dark:text-gray-400 text-xs">Cancel</button><button type="submit" class="px-4 py-2 bg-[#9E4CFF] text-white rounded-lg text-xs">{{ teamStore.loading ? 'Adding...' : 'Add Member' }}</button></div>
        </form>
      </template>
    </BaseModal>

    <!-- Edit Member Modal -->
    <BaseModal :show="showEditModal" @close="closeEditModal">
      <template #header><h3 class="text-xl font-bold text-gray-900 dark:text-white">Edit Team Member</h3></template>
      <template #body>
        <form @submit.prevent="updateMember" class="space-y-4">
          <div><label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name</label><input v-model="editMember.name" type="text" required class="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-lg p-2.5 text-sm" /></div>
          <div><label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Email</label><input v-model="editMember.email" type="email" required class="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-lg p-2.5 text-sm" /></div>
          <div><label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Password (Optional)</label><input v-model="editMember.password" type="password" class="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-lg p-2.5 text-sm" placeholder="Leave blank to keep current" /></div>
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800"><button type="button" @click="closeEditModal" class="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-600 dark:text-gray-400 text-xs">Cancel</button><button type="submit" :disabled="teamStore.loading" class="px-4 py-2 bg-[#9E4CFF] hover:bg-[#8B3DFF] text-white rounded-lg text-xs font-medium disabled:opacity-50">{{ teamStore.loading ? 'Updating...' : 'Update' }}</button></div>
        </form>
      </template>
    </BaseModal>

    <!-- Toasts -->
    <div v-if="teamStore.error" class="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-[100] animate-fade-in max-w-xs text-sm"><span>{{ teamStore.error }}</span><button @click="teamStore.clearError()" class="text-white/80 hover:text-white ml-auto">✕</button></div>
    <div v-if="successMessage" class="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-[100] animate-fade-in max-w-xs text-sm"><span>{{ successMessage }}</span><button @click="successMessage = ''" class="text-white/80 hover:text-white ml-auto">✕</button></div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, nextTick } from 'vue'
import { useTeamStore } from '~/stores/teamStore'
import BaseModal from '~/components/BaseModal.vue'

definePageMeta({ layout: 'dashboard' })

const teamStore = useTeamStore()
const successMessage = ref('')

// Modal states
const showAddModal = ref(false)
const showEditModal = ref(false)
const showRolesModal = ref(false)
const showRoleDetailModal = ref(false)
const showDeleteModal = ref(false) // NEW State for Delete Modal

const selectedRoleName = ref('')
const selectedRolePermissions = ref([])
const editRoles = reactive({})
const rolesMember = ref(null)
const memberToDelete = ref(null) // NEW State to track member being deleted
const deleteModalContainer = ref(null) // For focusing

// Init Roles
const initializeRoles = () => {
  const rolesObj = {}
  teamStore.rolesList.forEach(role => {
    rolesObj[role.name] = { enabled: false, permissions: {} }
    role.subroles.forEach(sub => { rolesObj[role.name].permissions[sub.name] = false })
  })
  return rolesObj
}

const newMember = reactive({ name: '', email: '', roles: initializeRoles() })
const editMember = reactive({ id: null, name: '', email: '', password: '' })

// --- SELECT ALL LOGIC ---
const areAllRolesSelected = computed(() => {
    return Object.values(editRoles).every(r => r.enabled)
})

const toggleAllRoles = (shouldSelect, targetRoles = editRoles) => {
    const targetState = shouldSelect !== null ? shouldSelect : !Object.values(targetRoles).every(r => r.enabled)
    Object.keys(targetRoles).forEach(key => {
        targetRoles[key].enabled = targetState
        Object.keys(targetRoles[key].permissions).forEach(pk => {
            targetRoles[key].permissions[pk] = targetState
        })
    })
}

const areAllSubrolesSelected = (roleName) => {
    const perms = editRoles[roleName].permissions
    return Object.values(perms).length > 0 && Object.values(perms).every(v => v)
}

const toggleSubroles = (roleName) => {
    const currentState = areAllSubrolesSelected(roleName)
    Object.keys(editRoles[roleName].permissions).forEach(key => {
        editRoles[roleName].permissions[key] = !currentState
    })
}
// ------------------------

const viewRoleDetails = (roleName, permissions) => {
    selectedRoleName.value = roleName
    if (Array.isArray(permissions)) selectedRolePermissions.value = permissions
    else if (typeof permissions === 'object' && permissions !== null) selectedRolePermissions.value = Object.entries(permissions).filter(([_, v]) => v).map(([k]) => k)
    else selectedRolePermissions.value = []
    showRoleDetailModal.value = true
}

const toggleRole = (rolesObj, roleName) => {
  if (!rolesObj[roleName].enabled) {
    Object.keys(rolesObj[roleName].permissions).forEach(k => rolesObj[roleName].permissions[k] = false)
  }
}

const formatRoleName = (name) => {
  if (typeof name !== 'string') return ''
  return name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

const convertRolesToApiFormat = (rolesObj) => {
  const apiRoles = {}
  Object.entries(rolesObj).forEach(([roleName, roleData]) => {
    if (roleData.enabled) {
      const hasSubroles = Object.keys(roleData.permissions).length > 0
      if (hasSubroles) {
        const enabledPermissions = {}
        Object.entries(roleData.permissions).forEach(([permName, value]) => { if (value) enabledPermissions[permName] = true })
        if (Object.keys(enabledPermissions).length > 0) apiRoles[roleName] = enabledPermissions
      } else { apiRoles[roleName] = true }
    }
  })
  return apiRoles
}

const convertApiRolesToFormFormat = (memberRoles) => {
  const formRoles = initializeRoles()
  if (!memberRoles) return formRoles
  Object.entries(memberRoles).forEach(([roleName, permissions]) => {
    if (formRoles[roleName]) {
      formRoles[roleName].enabled = true
      if (typeof permissions === 'object') {
        Object.entries(permissions).forEach(([permName, value]) => {
          if (formRoles[roleName].permissions[permName] !== undefined) formRoles[roleName].permissions[permName] = !!value
        })
      }
    }
  })
  return formRoles
}

// Modal Actions
const closeAddModal = () => { showAddModal.value = false; newMember.name = ''; newMember.email = ''; newMember.roles = initializeRoles() }
const closeEditModal = () => { showEditModal.value = false; editMember.id = null; editMember.name = ''; editMember.email = ''; editMember.password = '' }
const closeRolesModal = () => { showRolesModal.value = false; rolesMember.value = null; Object.assign(editRoles, {}) }
const closeDeleteModal = () => { showDeleteModal.value = false; memberToDelete.value = null; window.removeEventListener('keydown', handleEnterKey) }

const openEdit = (member) => { editMember.id = member.id; editMember.name = member.name; editMember.email = member.email; editMember.password = ''; showEditModal.value = true }
const openManageRoles = (member) => { rolesMember.value = member; Object.assign(editRoles, convertApiRolesToFormFormat(member.roles)); showRolesModal.value = true }

// CRUD
const addMember = async () => {
  try { await teamStore.addTeamMember({ name: newMember.name, email: newMember.email, roles: convertRolesToApiFormat(newMember.roles) }); successMessage.value = 'Member invited!'; closeAddModal(); setTimeout(() => successMessage.value = '', 5000) } catch (e) { console.error(e) }
}
const updateMember = async () => {
  try { const data = { name: editMember.name, email: editMember.email }; if (editMember.password) data.password = editMember.password; await teamStore.updateTeamMember(editMember.id, data); successMessage.value = 'Updated!'; closeEditModal(); setTimeout(() => successMessage.value = '', 3000) } catch (e) { console.error(e) }
}
const updateRoles = async () => {
  try { await teamStore.updateMemberRoles(rolesMember.value.id, convertRolesToApiFormat(editRoles)); successMessage.value = 'Roles updated!'; closeRolesModal(); setTimeout(() => successMessage.value = '', 3000) } catch (e) { console.error(e) }
}

// Delete Logic with Modal
const confirmDelete = (member) => {
  memberToDelete.value = member
  showDeleteModal.value = true
  
  // Accessibility: Focus modal for key listening
  nextTick(() => {
    if(deleteModalContainer.value) deleteModalContainer.value.focus()
  })
  
  window.addEventListener('keydown', handleEnterKey)
}

const handleEnterKey = (e) => {
  if (e.key === 'Enter') {
     e.preventDefault()
     executeDelete()
  }
}

const executeDelete = async () => {
  if (!memberToDelete.value) return
  
  // Optimistic UI: Close modal immediately
  const idToDelete = memberToDelete.value.id
  closeDeleteModal()
  
  try { 
    await teamStore.deleteTeamMember(idToDelete)
    successMessage.value = 'Removed!'
    setTimeout(() => successMessage.value = '', 3000) 
  } catch (e) { 
    console.error(e)
  }
}

onMounted(async () => { await teamStore.fetchTeamMembers(); newMember.roles = initializeRoles() })
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in 0.3s ease-out; }
/* Standard CSS Scrollbar (No @apply) */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #475569; }
</style>