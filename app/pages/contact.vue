<template>
  <!-- Background: Light(White) -> Dark(#0b1020) -->
  <section class="min-h-screen pt-30 md:pt-24 lg:pt-28 bg-white dark:bg-[#0b1020] transition-colors duration-300">
    <div class="max-w-7xl pt-19 mx-auto px-6 lg:px-8">
      
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#9E4CFF] to-blue-600 dark:from-[#9E4CFF] dark:to-white">
          Get in Touch
        </h1>
        <p class="mt-3 text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          Have a question about our AI chatbots or want a demo? Fill the form or reach us directly — we typically respond within one business day.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- SIDEBAR INFO CARD -->
        <aside class="lg:col-span-4 rounded-2xl p-6 shadow-xl border transition-colors
          bg-gray-50 border-gray-100 
          dark:bg-white/5 dark:border-white/10 backdrop-blur-sm">
          
          <div class="flex items-start gap-4">
            <div class="w-16 h-16 flex items-center justify-center rounded-full bg-purple-100 dark:bg-white/10 text-purple-600 dark:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Contact Sales & Support</h3>
              <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">We're here to help with setup, integrations, and trials.</p>
            </div>
          </div>

          <dl class="mt-6 space-y-4 text-sm text-gray-600 dark:text-gray-300">
            <div>
              <dt class="font-medium text-gray-900 dark:text-gray-200">Email</dt>
              <dd class="mt-1">support@akili.ai</dd>
            </div>
            <div>
              <dt class="font-medium text-gray-900 dark:text-gray-200">Phone</dt>
              <dd class="mt-1">+234 803 968 8395</dd>
            </div>
            <div>
              <dt class="font-medium text-gray-900 dark:text-gray-200">Hours</dt>
              <dd class="mt-1">Mon–Fri, 9:00 AM — 6:00 PM</dd>
            </div>
          </dl>

          <div class="mt-6">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-200">Or reach us on</h4>
            <div class="flex items-center gap-3 mt-3 text-gray-500 dark:text-white">
              <a aria-label="Twitter" href="#" class="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-white/5 dark:hover:bg-white/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8.29 20c7.547 0 11.675-6.155 11.675-11.49 0-.175 0-.349-.012-.522A8.18 8.18 0 0022 5.92a8.27 8.27 0 01-2.357.637 4.07 4.07 0 001.804-2.245 8.18 8.18 0 01-2.605.98A4.11 4.11 0 0015.447 4c-2.266 0-4.102 1.827-4.102 4.08 0 .32.036.632.105.931A11.66 11.66 0 013 5.15a4.07 4.07 0 001.27 5.444 4.06 4.06 0 01-1.856-.512v.05C4.41 13.13 6.25 14.5 8.47 14.69a4.1 4.1 0 01-1.85.07 4.11 4.11 0 003.83 2.83A8.233 8.233 0 012 18.58 11.616 11.616 0 008.29 20"/></svg>
              </a>
              <a aria-label="LinkedIn" href="#" class="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-white/5 dark:hover:bg-white/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-14h4v2a4 4 0 014-1zM2 9h4v11H2z"/></svg>
              </a>
              <a aria-label="Github" href="#" class="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-white/5 dark:hover:bg-white/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5a12 12 0 00-3.79 23.4c.6.11.82-.26.82-.58v-2.1c-3.34.73-4.04-1.62-4.04-1.62-.54-1.4-1.32-1.77-1.32-1.77-1.08-.74.08-.72.08-.72 1.2.08 1.83 1.24 1.83 1.24 1.06 1.82 2.78 1.3 3.46.99.11-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.9 0-1.3.47-2.36 1.24-3.19-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.44 11.44 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.83 1.24 1.89 1.24 3.19 0 4.58-2.8 5.6-5.48 5.89.43.38.81 1.13.81 2.28v3.39c0 .32.21.7.82.58A12 12 0 0012 .5"/></svg>
              </a>
            </div>
          </div>
        </aside>

        <!-- MAIN FORM -->
        <form @submit.prevent="handleSubmit" class="lg:col-span-8 rounded-2xl p-6 shadow-xl border transition-colors
          bg-gray-50 border-gray-100 
          dark:bg-white/5 dark:border-white/10 backdrop-blur-sm">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Full name</label>
              <!-- 
                 UPDATED INPUT STYLE:
                 Light: bg-white
                 Dark: bg-slate-900/50 (semi-transparent dark) + border-white/10
              -->
              <input v-model="form.name" type="text" required placeholder="Jane Doe" 
                class="mt-2 w-full rounded-lg p-3 outline-none transition-all
                bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500
                dark:bg-slate-900/50 dark:border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:ring-purple-500 dark:focus:border-purple-500" 
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
              <input v-model="form.email" type="email" required placeholder="jane@company.com" 
                class="mt-2 w-full rounded-lg p-3 outline-none transition-all
                bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500
                dark:bg-slate-900/50 dark:border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:ring-purple-500 dark:focus:border-purple-500" 
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Company (optional)</label>
              <input v-model="form.company" type="text" placeholder="Acme Inc." 
                class="mt-2 w-full rounded-lg p-3 outline-none transition-all
                bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500
                dark:bg-slate-900/50 dark:border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:ring-purple-500 dark:focus:border-purple-500" 
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Phone (optional)</label>
              <input v-model="form.phone" type="tel" placeholder="+1 555 000 0000" 
                class="mt-2 w-full rounded-lg p-3 outline-none transition-all
                bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500
                dark:bg-slate-900/50 dark:border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:ring-purple-500 dark:focus:border-purple-500" 
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Subject</label>
              <input v-model="form.subject" type="text" required placeholder="How can we help?" 
                class="mt-2 w-full rounded-lg p-3 outline-none transition-all
                bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500
                dark:bg-slate-900/50 dark:border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:ring-purple-500 dark:focus:border-purple-500" 
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Message</label>
              <textarea v-model="form.message" required rows="6" placeholder="Tell us about your use case, goals, or issue" 
                class="mt-2 w-full rounded-lg p-3 outline-none resize-none transition-all
                bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500
                dark:bg-slate-900/50 dark:border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:ring-purple-500 dark:focus:border-purple-500"></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">How should we contact you?</label>
              <select v-model="form.preference" 
                class="mt-2 w-full rounded-lg p-3 outline-none transition-all appearance-none
                bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-purple-500
                dark:bg-slate-900/50 dark:border-white/10 dark:text-white dark:focus:ring-purple-500">
                <option value="email" class="dark:bg-slate-900 dark:text-white">Email</option>
                <option value="phone" class="dark:bg-slate-900 dark:text-white">Phone</option>
                <option value="either" class="dark:bg-slate-900 dark:text-white">Either</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Attach file (optional)</label>
              <input ref="fileInput" @change="handleFile" type="file" 
                class="mt-2 w-full rounded-lg p-2 text-sm outline-none transition-all
                bg-white border border-gray-300 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100
                dark:bg-slate-900/50 dark:border-white/10 dark:text-gray-300 dark:file:bg-purple-600 dark:file:text-white dark:hover:file:bg-purple-500" 
              />
            </div>

            <input v-model="form._honeypot" type="text" name="_honeypot" class="hidden" autocomplete="off" tabindex="-1" />
          </div>

          <div class="mt-6 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <button :disabled="isSubmitting" type="submit" 
                class="inline-flex items-center gap-2 px-5 py-3 rounded-full font-medium shadow focus:outline-none focus:ring-2 transition-colors
                bg-[#9E4CFF] hover:bg-purple-700 text-white focus:ring-purple-500
                dark:bg-purple-600 dark:hover:bg-purple-500 dark:focus:ring-purple-400">
                <svg v-if="!isSubmitting" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v4m0 8v4m8-8h-4M4 12H0"/></svg>
                {{ isSubmitting ? 'Sending...' : 'Send Message' }}
              </button>

              <button type="button" @click="clearForm" 
                class="inline-flex items-center gap-2 px-4 py-3 rounded-full font-medium focus:outline-none transition-colors
                bg-gray-200 hover:bg-gray-300 text-gray-700
                dark:bg-white/10 dark:hover:bg-white/15 dark:text-white">
                Clear
              </button>
            </div>
          </div>

          <div v-if="status.message" :class="['mt-4 rounded-md p-3 text-sm', status.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' : 'bg-green-100 text-green-800 dark:bg-emerald-900/30 dark:text-emerald-200']">{{ status.message }}</div>
        </form>
      </div>

      <!-- FAQ / quick links -->
      <div class="mt-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 rounded-2xl border transition-colors bg-gray-50 border-gray-200 dark:bg-white/5 dark:border-white/10">
            <h4 class="font-semibold text-gray-900 dark:text-white">Sales FAQ</h4>
            <p class="text-sm mt-2 text-gray-600 dark:text-gray-300">How long does setup take? — Usually 1–2 weeks depending on integrations.</p>
          </div>
          <div class="p-6 rounded-2xl border transition-colors bg-gray-50 border-gray-200 dark:bg-white/5 dark:border-white/10">
            <h4 class="font-semibold text-gray-900 dark:text-white">Privacy</h4>
            <p class="text-sm mt-2 text-gray-600 dark:text-gray-300">We prioritize data privacy and can sign a custom DPA for enterprise customers.</p>
          </div>
          <div class="p-6 rounded-2xl border transition-colors bg-gray-50 border-gray-200 dark:bg-white/5 dark:border-white/10">
            <h4 class="font-semibold text-gray-900 dark:text-white">Integrations</h4>
            <p class="text-sm mt-2 text-gray-600 dark:text-gray-300">Connect to Zendesk, Intercom, Slack, WhatsApp Business and more via our integrations layer.</p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'

const fileInput = ref(null)
const isSubmitting = ref(false)
const status = reactive({ message: '', type: '' })

const form = reactive({
  name: '',
  email: '',
  company: '',
  phone: '',
  subject: '',
  message: '',
  preference: 'email',
  file: null,
  _honeypot: ''
})

function handleFile(e) {
  const f = e.target.files && e.target.files[0]
  form.file = f || null
}

function clearForm() {
  Object.keys(form).forEach(key => form[key] = key === 'preference' ? 'email' : '')
  form.file = null
  if (fileInput.value) fileInput.value.value = null
  status.message = ''
  status.type = ''
}

async function handleSubmit() {
  status.message = ''
  status.type = ''
  if (form._honeypot) {
    status.message = 'Submission failed.'
    status.type = 'error'
    return
  }
  if (!form.name || !form.email || !form.subject || !form.message) {
    status.message = 'Please fill in name, email, subject and message.'
    status.type = 'error'
    return
  }

  isSubmitting.value = true

  try {
    const fd = new FormData()
    Object.keys(form).forEach(key => fd.append(key, form[key]))
    
    // Replace with actual endpoint
    // const res = await fetch('/api/contact', { method: 'POST', body: fd })
    
    // Simulating success for UI demo
    await new Promise(resolve => setTimeout(resolve, 1500))

    status.message = 'Thanks — we received your message. We will be in touch shortly.'
    status.type = 'success'
    clearForm()
  } catch (err) {
    console.error(err)
    status.message = 'Something went wrong. Please try again later.'
    status.type = 'error'
  } finally {
    isSubmitting.value = false
    await nextTick()
  }
}
</script>

<style scoped>
input[type="file"] { background-clip: padding-box; }
</style>