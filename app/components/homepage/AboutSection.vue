<!-- components/homepage/AboutSection.vue -->
<template>
  <section class="pb-16">
    <div class="max-w-7xl mx-auto px-6">
      
      <!-- 1. HEADER / MISSION -->
      <div class="text-center mb-16" data-aos="fade-up">
        <h2 class="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent pb-2" 
            style="background-image: linear-gradient(90deg, #9E4CFF, #2563EB);">
          We Are Xeli AI
        </h2>
        <p class="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          We are on a mission to democratize artificial intelligence for businesses of all sizes. 
          We believe that powerful, 24/7 customer support shouldn't be a luxury—it should be a standard.
        </p>
      </div>

      <!-- 2. THE STORY (Grid Layout) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
        <div data-aos="fade-right">
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Bridging the Gap Between Data and Conversation
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Founded with a simple idea: your data already has the answers your customers need. Xeli AI acts as the intelligent bridge, ingesting your knowledge base—PDFs, spreadsheets, and docs—and turning them into natural, human-like conversations.
            </p>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                Whether you are a startup needing to scale support or an enterprise looking to optimize workflows, our engine is built to learn from you, for you.
            </p>
        </div>
        <div class="relative" data-aos="fade-left">
            <!-- Decorative gradient blob -->
            <div class="absolute inset-0 bg-gradient-to-r from-[#9E4CFF] to-blue-600 opacity-10 blur-3xl rounded-full"></div>
            <!-- Illustration / Image Placeholder -->
            <div class="relative bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-8 shadow-2xl">
                 <div class="grid grid-cols-2 gap-4">
                    <div class="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl text-center">
                        <span class="block text-3xl font-bold text-[#9E4CFF] mb-1">99%</span>
                        <span class="text-xs text-gray-500 uppercase tracking-wide">Uptime</span>
                    </div>
                    <div class="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl text-center">
                        <span class="block text-3xl font-bold text-blue-500 mb-1">24/7</span>
                        <span class="text-xs text-gray-500 uppercase tracking-wide">Availability</span>
                    </div>
                    <div class="col-span-2 bg-gray-50 dark:bg-slate-800 p-4 rounded-xl flex items-center justify-between">
                        <div class="text-left">
                            <span class="block text-xl font-bold text-slate-900 dark:text-white">10M+</span>
                            <span class="text-xs text-gray-500 uppercase tracking-wide">Messages Processed</span>
                        </div>
                        <div class="h-10 w-10 bg-[#9E4CFF] rounded-full flex items-center justify-center text-white">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
      </div>

      <!-- 3. CORE VALUES -->
      <div class="mb-24">
        <div class="text-center mb-12">
            <h3 class="text-3xl font-bold text-slate-900 dark:text-white">Our Core Values</h3>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div v-for="(value, index) in values" :key="index" 
                 data-aos="fade-up" :data-aos-delay="index * 100"
                 class="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-8 rounded-2xl hover:border-purple-500/50 transition-colors duration-300 shadow-sm">
                <div class="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mb-6 text-[#9E4CFF]">
                    <component :is="value.icon" class="w-6 h-6" />
                </div>
                <h4 class="text-xl font-bold text-slate-900 dark:text-white mb-3">{{ value.title }}</h4>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ value.description }}</p>
            </div>
        </div>
      </div>

      <!-- 4. TEAM SECTION -->
      <div class="text-center">
        <h3 class="text-3xl font-bold text-slate-900 dark:text-white mb-12">Meet the Builders</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div v-for="(member, index) in team" :key="index" 
                 data-aos="zoom-in" :data-aos-delay="index * 100"
                 class="group">
                <div class="relative overflow-hidden rounded-2xl mb-4 aspect-square bg-gray-100 dark:bg-slate-800">
                    <img :src="member.image" :alt="member.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <h4 class="text-lg font-bold text-slate-900 dark:text-white">{{ member.name }}</h4>
                <p class="text-[#9E4CFF] text-sm font-medium">{{ member.role }}</p>
            </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { 
    ShieldCheck, 
    Zap, 
    Users 
} from 'lucide-vue-next'

// Core Values Data
const values = [
    {
        title: "Security First",
        description: "Your data is your asset. We employ enterprise-grade encryption and strict access controls to ensure your knowledge base remains secure.",
        icon: ShieldCheck
    },
    {
        title: "Lightning Fast",
        description: "Speed matters. Our optimized LLM architecture ensures your customers get accurate answers in milliseconds, not minutes.",
        icon: Zap
    },
    {
        title: "Customer Centric",
        description: "We build features based on what you need. Our roadmap is driven by user feedback and real-world support challenges.",
        icon: Users
    }
]

// Team Data (Placeholders - replace with real images/names)
const team = [
    {
        name: "Me Emmanuel",
        role: "Founder & CEO",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Ose",
        role: "Head of Engineering",
        image: "https://images.unsplash.com/photo-1573496359-0cf843d65c98?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Daniel",
        role: "Frontend developer",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Obute Faith",
        role: "Social Media Manager",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
]
</script>