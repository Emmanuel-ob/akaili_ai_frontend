<script setup>
import ToggleSwitch from '~/components/chatbot-setup/ToggleSwitch.vue'
const form = reactive({
         name: 'Customer Support Assistant',
          description: 'A helpful assistant for support and inquiries',
          chatbotEnabled: true,
          language: '',
          responseTime: '',
          personality: ''
         }) /* button toggle */
        
         
    
    
    
    
</script>
<template>
     <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Left Card: Basic Information -->
                    <section class="input-card border px-4 py-6 border-gray-200 rounded-2xl "> 
                    <h2 class="text-xl lg:text-2xl font-bold ">Basic Information</h2>
                    <p class=" text-gray-500 mt-1 mb-4">Set up the fundamental details of your chatbot</p>


                    <label class="block text-base font-semibold mt-4">Chatbot Name</label>
                    <div class="">

                     <input
                            v-model="form.name"
                            type="text"
                            placeholder="Customer Support Assistant"
                            class="mt-2 block w-full text-gray-600 rounded-md border border-gray-300 p-3
                                    focus:outline-none focus:border-gray-300"
                                    />
                    </div>


                    <label class="block text-base font-semibold mt-4">Description</label>
                    <textarea 
                            v-model="form.description" 
                            rows="4" placeholder="A helpful assistant for support and inquiries"
                    class="mt-2 block w-full text-gray-600 rounded-md border border-gray-300 p-3
                                    focus:outline-none focus:border-gray-300" />


                    <div class="mt-6 flex items-center justify-between">
                        <div>
                                <label class="block text-base font-semibold mt-4">Enable Chatbot</label>
                                <p class=" text-gray-500">Make this chatbot available to users</p>
                        </div>
                        <ToggleSwitch v-model="form.chatbotEnabled" />
                    </div>

                    </section>


                    <!-- Right Card: Configuration -->
                    <section class="input-card border px-4 py-6 border-gray-200 rounded-2xl ">
                    <h2 class="text-xl lg:text-2xl font-bold ">Configuration</h2>
                    <p class="text-gray-500 mt-1 mb-4">Advanced settings and parameters</p>


                    <label class="block text-base font-semibold mt-4">Primary Language</label>
                    <select 
                    v-model="form.language" class="mt-2 block w-full text-gray-600 rounded-md border border-gray-300 p-3
                                    focus:outline-none focus:border-gray-300">
                    <option value="">Select language</option>
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    </select>


                    <label class="block text-base font-semibold mt-4">Response Time</label>
                    <select 
                    v-model="form.responseTime" class="mt-2 block w-full text-gray-600 rounded-md border border-gray-300 p-3
                                    focus:outline-none focus:border-gray-300">
                    <option value="">Select response time</option>
                    <option>Instant</option>
                    <option>Fast</option>
                    <option>Normal</option>
                    </select>


                    <label class="block text-base font-semibold  mt-4">Personality</label>
                    <select
                     v-model="form.personality" class="mt-2 block w-full text-gray-600 rounded-md border border-gray-300 p-3
                                    focus:outline-none focus:border-gray-300">
                    <option value="">Select personality</option>
                    <option>Professional</option>
                    <option>Friendly</option>
                    <option>Playful</option>
                    </select>


                    <p class="text-xs text-gray-800 mt-6">Last updated: 2 hours ago</p>
                    </section>
                </div>
</template>


<style lang="scss" scoped>

</style>