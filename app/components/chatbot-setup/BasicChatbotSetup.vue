<!-- components/chatbot-setup/BasicChatbotSetup.vue -->
<script setup>
import { inject } from 'vue'
import ToggleSwitch from '~/components/chatbot-setup/ToggleSwitch.vue'

const formData = inject('formData')
const isEditing = inject('isEditing')
</script>

<template>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Card: Basic Information -->
        <section class="input-card border px-6 py-8 border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl transition-colors duration-300"> 
            <h2 class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Basic Information</h2>
            <p class="text-gray-500 dark:text-gray-400 mt-1 mb-6">Set up the fundamental details of your chatbot</p>

            <label class="block text-base font-semibold mt-4 text-gray-800 dark:text-gray-200">Chatbot Name</label>
            <input
                v-model="formData.name"
                type="text"
                placeholder="Customer Support Assistant"
                class="mt-2 block w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />

            <label class="block text-base font-semibold mt-4 text-gray-800 dark:text-gray-200">Description</label>
            <textarea 
                v-model="formData.description" 
                rows="4" 
                placeholder="A helpful assistant for support and inquiries"
                class="mt-2 block w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
            />

            <div class="mt-8 flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700">
                <div>
                    <label class="block text-base font-semibold text-gray-900 dark:text-white">Enable Chatbot</label>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Make this chatbot available to users</p>
                </div>
                <ToggleSwitch v-model="formData.is_active" />
            </div>
        </section>

        <!-- Right Card: Configuration -->
        <section class="input-card border px-6 py-8 border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl transition-colors duration-300">
            <h2 class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Configuration</h2>
            <p class="text-gray-500 dark:text-gray-400 mt-1 mb-6">Advanced settings and parameters</p>

            <label class="block text-base font-semibold mt-4 text-gray-800 dark:text-gray-200">Primary Language</label>
            <select 
                v-model="formData.language" 
                class="mt-2 block w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
                <option value="">Select language</option>
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
            </select>

            <label class="block text-base font-semibold mt-4 text-gray-800 dark:text-gray-200">Response Time</label>
            <select 
                v-model="formData.response_time" 
                class="mt-2 block w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
                <option value="">Select response time</option>
                <option value="instant">Instant</option>
                <option value="fast">Fast</option>
                <option value="normal">Normal</option>
            </select>

            <label class="block text-base font-semibold mt-4 text-gray-800 dark:text-gray-200">Personality</label>
            <select
                v-model="formData.personality" 
                class="mt-2 block w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
                <option value="">Select personality</option>
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="playful">Playful</option>
            </select>

            <p class="text-xs text-gray-500 dark:text-gray-400 mt-8 text-right italic">
                {{ isEditing ? 'Last updated: ' + (new Date().toLocaleTimeString()) : 'Ready to create' }}
            </p>
        </section>
    </div>
</template>