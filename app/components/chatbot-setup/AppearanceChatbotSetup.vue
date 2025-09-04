                    <script setup>
                     import { reactive} from 'vue'
                     import ColorInput from './ColorInput.vue';
                        
                        
                        
                       const form = reactive({
                        colorInput: '2563eb',
                        widgetPosition: '',
                        avatarStyle: '',
                        welcomeMessage: '',
                        widgetSize: ''
                        })

                        /* button toggle  */
                    </script>
<template>
     <div class="block border px-4 py-6 border-gray-200 rounded-2xl ">
                    <!-- heading -->
                     <div>
                         <h2 class="text-xl lg:text-2xl font-bold ">Visual Customization</h2>
                    <p class=" text-gray-500 mt-1 mb-4">Customize the look and feel of your chatbot widget</p>
                     </div>
                      
                    <section class="input-card grid grid-cols-1 lg:grid-cols-2 gap-6 border px-4 py-6 border-gray-200 rounded-2xl "> 
                        <!-- Left Card -->
                        <div class="">

                            <ColorInput v-model="form.colorInput" />


                             <label class="block text-base font-semibold  mt-4">Widget Position </label>
                            <select 
                            v-model="form.widgetPosition" class="mt-2 block w-full text-gray-600 rounded-md border border-gray-300 p-3
                                            focus:outline-none focus:border-gray-300">
                            <option value="">Select response time</option>
                            <option>Instant</option>
                            <option>Fast</option>
                            <option>Normal</option>
                            </select>
                             <label class="block text-base font-semibold  mt-4">Avatar Style</label>
                            <select 
                            v-model="form.avatarStyle" class="mt-2 block w-full text-gray-600 rounded-md border border-gray-300 p-3
                                            focus:outline-none focus:border-gray-300">
                            <option value="">Select response time</option>
                            <option>Instant</option>
                            <option>Fast</option>
                            <option>Normal</option>
                            </select>
                        </div>
                        <div class="">
                             <label class="block text-base font-semibold   mt-4">Welcome Message</label>
                            <textarea 
                                    v-model="form.welcomeMessage" 
                                    rows="4" placeholder="Hi, How can I help you today"
                            class="mt-2 block w-full text-gray-600 rounded-md border border-gray-300 p-3
                                            focus:outline-none focus:border-gray-300" />

                              <label class="block text-base font-semibold  mt-4">Widget size</label>
                            <select 
                            v-model="form.widgetSize" class="mt-2 block w-full text-gray-600 rounded-md border border-gray-300 p-3
                                            focus:outline-none focus:border-gray-300">
                            <option>Small</option>
                            <option value="">Medium</option>
                            <option>Large</option>
                            </select>
                        </div>
                    </section>
                    
                </div>
</template>


<style lang="scss" scoped>

</style>