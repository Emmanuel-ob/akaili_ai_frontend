<script setup>
import { inject } from 'vue'
import ToggleSwitch from '~/components/chatbot-setup/ToggleSwitch.vue'

// Inject form data from parent
const formData = inject('formData')
const isEditing = inject('isEditing')
</script>

<template>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Card: Basic Information -->
        <section class="input-card border px-4 py-6 border-gray-200 rounded-2xl"> 
            <h2 class="text-xl lg:text-2xl font-bold">Basic Information</h2>
            <p class="text-gray-500 mt-1 mb-4">Set up the fundamental details of your chatbot</p>

            <label class="block text-base font-semibold mt-4">Chatbot Name</label>
            <input
                v-model="formData.name"
                type="text"
                placeholder="Customer Support Assistant"
                class="mt-2 block w-full text-gray-600 rounded-md border border-gray-300 p-3 focus:outline-none focus:border-gray-300"
            />

            <label class="block text-base font-semibold mt-4">Description</label>
            <textarea 
                v-model="formData.description" 
                rows="4" 
                placeholder="A helpful assistant for support and inquiries"
                class="mt-2 block w-full text-gray-600 rounded-md border border-gray-300 p-3 focus:outline-none focus:border-gray-300" 
            />

            <div class="mt-6 flex items-center justify-between">
                <div>
                    <label class="block text-base font-semibold mt-4">Enable Chatbot</label>
                    <p class="text-gray-500">Make this chatbot available to users</p>
                </div>
                <ToggleSwitch v-model="formData.is_active" />
            </div>
        </section>

        <!-- Right Card: Configuration -->
        <section class="input-card border px-4 py-6 border-gray-200 rounded-2xl">
            <h2 class="text-xl lg:text-2xl font-bold">Configuration</h2>
            <p class="text-gray-500 mt-1 mb-4">Advanced settings and parameters</p>

            <label class="block text-base font-semibold mt-4">Primary Language</label>
            <select 
                v-model="formData.language" 
                class="mt-2 block w-full text-gray-600 rounded-md border border-gray-300 p-3 focus:outline-none focus:border-gray-300"
            >
                <option value="">Select language</option>
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
            </select>

            <label class="block text-base font-semibold mt-4">Response Time</label>
            <select 
                v-model="formData.response_time" 
                class="mt-2 block w-full text-gray-600 rounded-md border border-gray-300 p-3 focus:outline-none focus:border-gray-300"
            >
                <option value="">Select response time</option>
                <option value="instant">Instant</option>
                <option value="fast">Fast</option>
                <option value="normal">Normal</option>
            </select>

            <label class="block text-base font-semibold mt-4">Personality</label>
            <select
                v-model="formData.personality" 
                class="mt-2 block w-full text-gray-600 rounded-md border border-gray-300 p-3 focus:outline-none focus:border-gray-300"
            >
                <option value="">Select personality</option>
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="playful">Playful</option>
            </select>

            <p class="text-xs text-gray-800 mt-6">
                {{ isEditing ? 'Last updated: ' + (new Date().toLocaleTimeString()) : 'Ready to create' }}
            </p>
        </section>
    </div>
</template>