<script setup>
import { inject } from 'vue'
import ToggleSwitch from '~/components/chatbot-setup/ToggleSwitch.vue'

// Inject form data from parent
const formData = inject('formData')
</script>

<template>
    <div class="block border px-4 py-6 border-gray-200 rounded-2xl">
        <!-- heading -->
        <div>
            <h2 class="text-xl lg:text-2xl font-bold">Behavior Settings</h2>
            <p class="text-gray-500 mt-1 mb-4">Configure how your chatbot responds and behaves</p>
        </div>
         
        <section class="input-card grid grid-cols-1 lg:grid-cols-2 gap-6 border px-4 py-6 border-gray-200 rounded-2xl"> 
            <!-- Left Card -->
            <div>
                <label class="block text-base font-semibold mt-4">Fallback Message</label>
                <textarea 
                    v-model="formData.fallback_message" 
                    rows="4" 
                    placeholder="I'm sorry, I didn't understand that. Could you please rephrase?"
                    class="mt-2 block w-full text-gray-600 rounded-md border border-gray-300 p-3 focus:outline-none focus:border-gray-300"
                />

                <label class="block text-base font-semibold mt-4">Max Conversation Length</label>
                <select 
                    v-model="formData.max_conversation_length" 
                    class="mt-2 block w-full text-gray-600 rounded-md border border-gray-300 p-3 focus:outline-none focus:border-gray-300"
                >
                    <option :value="10">10 messages</option>
                    <option :value="50">50 messages</option>
                    <option :value="100">100 messages</option>
                    <option :value="200">200 messages</option>
                </select>
            </div>

            <!-- Right Card -->
            <div>
                <div class="mt-6 flex items-center justify-between">
                    <div>
                        <label class="block text-base font-semibold mt-4">Enable Typing Indicator</label>
                        <p class="text-gray-500">Show typing animation while processing</p>
                    </div>
                    <ToggleSwitch v-model="formData.enable_typing_indicator" />
                </div>
                
                <div class="mt-6 flex items-center justify-between">
                    <div>
                        <label class="block text-base font-semibold mt-4">Collect User Feedback</label>
                        <p class="text-gray-500">Ask for ratings after conversations</p>
                    </div>
                    <ToggleSwitch v-model="formData.collect_user_feedback" />
                </div>
                
                <div class="mt-6 flex items-center justify-between">
                    <div>
                        <label class="block text-base font-semibold mt-4">Handoff to Human</label>
                        <p class="text-gray-500">Allow escalation to human agents</p>
                    </div>
                    <ToggleSwitch v-model="formData.handoff_to_human" />
                </div>
            </div>
        </section>
    </div>
</template>