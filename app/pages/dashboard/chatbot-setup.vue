<script setup>
    import BasicChatbotSetup from '~/components/chatbot-setup/BasicChatbotSetup.vue';      
    import { ref } from 'vue'
    import AppearanceChatbotSetup from '~/components/chatbot-setup/AppearanceChatbotSetup.vue';
    import BehaviourChatbotSetup from '~/components/chatbot-setup/BehaviourChatbotSetup.vue';

    const activeTab = ref('basic') // default active tab

    const tabs = [
    { key: 'basic', label: 'Basic' },
    { key: 'appearance', label: 'Appearance' },
    { key: 'behaviour', label: 'Behaviour' }
    ]                 
</script>
<template>
    <div class="bg-white h-[100vh]">
        <header class="bg-white px-6 py-4">
                <div class="flex justify-between items-center">
                  <div>
                        <h1 class="text-[#7F56D9] text-2xl font-bold">
                            Chatbot Setup
                        </h1>
                        <p class="text-sm lg:text-base text-[#6B7280] ">
                            Configure and customize your AI chatbot
                        </p>
                  </div>
        
                  <!-- Button -->
                  <div class="flex items-center space-x-4">
                        <button class=" px-5 py-4 nav_primary_btn text-sm lg: text-base text-white rounded-lg">
                          Save Changes
                        </button>
                  </div>
                </div>
              </header>
              <div class="grid grid-cols-3 gap-1 text-center mx-4 mb-8 mt-5">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        class="py-2 cursor-pointer transition-all duration-200 hover:bg-gray-100 rounded-xl"
        :class="activeTab === tab.key ? 'active_chatbot_setup' : ''"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </div>
    </div>

              <main class="px-6">
                <div v-if="activeTab === 'basic'">
                        <BasicChatbotSetup />
                    </div>
                    <div v-else-if="activeTab === 'appearance'">
                        <AppearanceChatbotSetup />
                    </div>
                    <div v-else-if="activeTab === 'behaviour'">
                        <BehaviourChatbotSetup />
                    </div>
              </main>
    </div>
</template>
 



