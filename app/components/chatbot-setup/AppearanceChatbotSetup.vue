<!-- components/chatbot-setup/AppearanceChatbotSetup.vue -->
<script setup>
import { inject } from 'vue'
import ColorInput from './ColorInput.vue'

const formData = inject('formData')
</script>

<template>
    <div class="block border px-6 py-8 border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl transition-colors duration-300">
        <!-- heading -->
        <div class="mb-8">
            <h2 class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Visual Customization</h2>
            <p class="text-gray-500 dark:text-gray-400 mt-1">Customize the look and feel of your chatbot widget</p>
        </div>
         
        <section class="input-card grid grid-cols-1 lg:grid-cols-2 gap-8"> 
            <!-- Left Card -->
            <div>
                <ColorInput v-model="formData.primary_color" />

                <label class="block text-base font-semibold mt-6 text-gray-800 dark:text-gray-200">Widget Position</label>
                <select 
                    v-model="formData.widget_position" 
                    class="mt-2 block w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                    <option value="">Select position</option>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="top-left">Top Left</option>
                </select>

                <label class="block text-base font-semibold mt-6 text-gray-800 dark:text-gray-200">Avatar Style</label>
                <select 
                    v-model="formData.avatar_style" 
                    class="mt-2 block w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                    <option value="">Select avatar style</option>
                    <option value="circle">Circle</option>
                    <option value="square">Square</option>
                    <option value="rounded">Rounded</option>
                </select>
            </div>
            
            <!-- Right Card -->
            <div>
                <label class="block text-base font-semibold mt-0 lg:mt-0 text-gray-800 dark:text-gray-200">Welcome Message</label>
                <textarea 
                    v-model="formData.welcome_message" 
                    rows="4" 
                    placeholder="Hi, How can I help you today?"
                    class="mt-2 block w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                />

                <label class="block text-base font-semibold mt-6 text-gray-800 dark:text-gray-200">Widget Size</label>
                <select 
                    v-model="formData.widget_size" 
                    class="mt-2 block w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                    <option value="">Select size</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                </select>
            </div>
        </section>
    </div>
</template>