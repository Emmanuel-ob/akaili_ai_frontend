<script setup>
 import { reactive} from 'vue'
 import ToggleSwitch from '~/components/chatbot-setup/ToggleSwitch.vue'
    
    
    
   const form = reactive({
        fallbackMessage: 'I’m sorry, I didn’t understand that. Could you please rephrase?',
        maxConversationLenght: '',
        enableTypingIndicator: false,
        collectUserFeedback: false,
        handoffToHuman: false,
    })
    
    

    /* button toggle  */
</script>
<template>
     <div class="block border px-4 py-6 border-gray-200 rounded-2xl ">
                    <!-- heading -->
                     <div>
                         <h2 class="text-xl lg:text-2xl font-bold ">Behavior Settings</h2>
                    <p class=" text-gray-500 mt-1 mb-4">Customize the look and feel of your chatbot widget</p>
                     </div>
                      
                    <section class="input-card grid grid-cols-1 lg:grid-cols-2 gap-6 border px-4 py-6 border-gray-200 rounded-2xl "> 
                        <!-- Left Card -->
                        <div class="">
                                <label class="block text-base font-semibold   mt-4">Fallack Message</label>
                                        <textarea 
                                                v-model="form.fallbackMessage" 
                                                rows="4" 
                                                placeholder="I’m sorry, I didn’t understand that. Could you please rephrase?"
                                                class="mt-2 block w-full text-gray-600 rounded-md border border-gray-300 p-3
                                                        focus:outline-none focus:border-gray-300"
                                         />

                                <label class="block text-base font-semibold  mt-4">Max Conversations Lenght</label>
                                <select 
                                        v-model="form.maxConversationLenght" class="mt-2 block w-full text-gray-600 rounded-md border border-gray-300 p-3
                                                 focus:outline-none focus:border-gray-300">
                                        <option>10 messages</option>
                                        <option>50 messages</option>
                                        <option>100 messages</option>
                                </select>
                        </div>

                        <!-- Right Card -->
                        <div class="">
                                <div class="mt-6 flex items-center justify-between">
                                        <div>
                                                <label class="block text-base  font-semibold mt-4">Enable Typing Indicator</label>
                                                <p class=" text-gray-500">Show typing animation while processing</p>
                                        </div>
                                        <ToggleSwitch v-model="form.enableTypingIndicator" />
                                </div>
                                <div class="mt-6 flex items-center justify-between">
                                        <div>
                                                <label class="block text-base  font-semibold mt-4">Collect User Feedback</label>
                                                <p class=" text-gray-500">Ask for ratings after conversations</p>
                                        </div>
                                        <ToggleSwitch v-model="form.collectUserFeedback" />
                                </div>
                                <div class="mt-6 flex items-center justify-between">
                                        <div>
                                                <label class="block text-base  font-semibold mt-4">Handoff to Human</label>
                                                <p class=" text-gray-500">Allow escalation to human agents</p>
                                        </div>
                                        <ToggleSwitch v-model="form.handoffToHuman" />
                                        
                                </div>
                        </div>
                    </section>
                    
                </div>
</template>


<style lang="scss" scoped>

</style>