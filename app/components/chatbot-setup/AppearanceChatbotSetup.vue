<!-- components/chatbot-setup/AppearanceChatbotSetup.vue -->
<script setup>
import { inject } from 'vue'
import ColorInput from './ColorInput.vue'

const formData = inject('formData')
</script>

<template>
    <!-- Removed outer border/bg classes here because parent handles container styling on desktop -->
    <div class="block">
        
        <!-- Heading -->
        <div class="mb-6 md:mb-8">
            <h2 class="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Visual Customization</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Customize the look and feel of your chatbot widget</p>
        </div>
         
        <!-- Content Grid -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8"> 
            
            <!-- Left Column -->
            <div class="space-y-6">
                <ColorInput v-model="formData.primary_color" />

                <div>
                    <label class="block text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">Widget Position</label>
                    <select 
                        v-model="formData.widget_position" 
                        class="block w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                    >
                        <option value="">Select position</option>
                        <option value="bottom-right">Bottom Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="top-right">Top Right</option>
                        <option value="top-left">Top Left</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">Avatar Style</label>
                    <select 
                        v-model="formData.avatar_style" 
                        class="block w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                    >
                        <option value="">Select avatar style</option>
                        <option value="circle">Circle</option>
                        <option value="square">Square</option>
                        <option value="rounded">Rounded</option>
                    </select>
                </div>
            </div>
            
            <!-- Right Column -->
            <div class="space-y-6">
                <div>
                    <label class="block text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">Welcome Message</label>
                    <textarea 
                        v-model="formData.welcome_message" 
                        rows="4" 
                        placeholder="Hi, How can I help you today?"
                        class="block w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm" 
                    />
                </div>

                <div>
                    <label class="block text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">Widget Size</label>
                    <select 
                        v-model="formData.widget_size" 
                        class="block w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                    >
                        <option value="">Select size</option>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                    </select>
                </div>
            </div>
        </section>
    </div>
</template>