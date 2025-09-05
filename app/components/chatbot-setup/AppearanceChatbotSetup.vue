<script setup>
import { inject } from 'vue'
import ColorInput from './ColorInput.vue'

// Inject form data from parent
const formData = inject('formData')
</script>

<template>
    <div class="block border px-4 py-6 border-gray-200 rounded-2xl">
        <!-- heading -->
        <div>
            <h2 class="text-xl lg:text-2xl font-bold">Visual Customization</h2>
            <p class="text-gray-500 mt-1 mb-4">Customize the look and feel of your chatbot widget</p>
        </div>
         
        <section class="input-card grid grid-cols-1 lg:grid-cols-2 gap-6 border px-4 py-6 border-gray-200 rounded-2xl"> 
            <!-- Left Card -->
            <div>
                <ColorInput v-model="formData.primary_color" />

                <label class="block text-base font-semibold mt-4">Widget Position</label>
                <select 
                    v-model="formData.widget_position" 
                    class="mt-2 block w-full text-gray-600 rounded-md border border-gray-300 p-3 focus:outline-none focus:border-gray-300"
                >
                    <option value="">Select position</option>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="top-left">Top Left</option>
                </select>

                <label class="block text-base font-semibold mt-4">Avatar Style</label>
                <select 
                    v-model="formData.avatar_style" 
                    class="mt-2 block w-full text-gray-600 rounded-md border border-gray-300 p-3 focus:outline-none focus:border-gray-300"
                >
                    <option value="">Select avatar style</option>
                    <option value="circle">Circle</option>
                    <option value="square">Square</option>
                    <option value="rounded">Rounded</option>
                </select>
            </div>
            
            <div>
                <label class="block text-base font-semibold mt-4">Welcome Message</label>
                <textarea 
                    v-model="formData.welcome_message" 
                    rows="4" 
                    placeholder="Hi, How can I help you today?"
                    class="mt-2 block w-full text-gray-600 rounded-md border border-gray-300 p-3 focus:outline-none focus:border-gray-300" 
                />

                <label class="block text-base font-semibold mt-4">Widget Size</label>
                <select 
                    v-model="formData.widget_size" 
                    class="mt-2 block w-full text-gray-600 rounded-md border border-gray-300 p-3 focus:outline-none focus:border-gray-300"
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