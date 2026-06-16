<template>
    <div v-if="show"
        class="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-white px-4 py-2.5 flex items-center justify-between shadow-lg">
        <div class="flex items-center gap-2 text-sm font-medium">
            <span aria-hidden="true">⚠</span>
            <span>
                You are currently impersonating
                <strong>{{ targetEmail || 'a user' }}</strong>
                on behalf of admin <code>{{ impersonatorId || '—' }}</code>.
                Session expires in <strong>{{ remainingMinutes }}m {{ remainingSeconds }}s</strong>.
            </span>
        </div>
        <button @click="endSession"
            class="ml-3 px-3 py-1 rounded bg-white/20 hover:bg-white/30 text-xs font-semibold transition">
            End session
        </button>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const show = ref(false)
const expiresAt = ref(null)
const impersonatorId = ref(null)
const targetEmail = ref(null)
const now = ref(Date.now())

let tickHandle = null

const remainingMs = computed(() => {
    if (!expiresAt.value) return 0
    return Math.max(0, expiresAt.value - now.value)
})
const remainingMinutes = computed(() => Math.floor(remainingMs.value / 60000))
const remainingSeconds = computed(() => Math.floor((remainingMs.value % 60000) / 1000))

function clearImpersonationParam() {
    const q = { ...route.query }
    delete q._impersonating
    delete q._impersonator
    delete q._impersonate_token
    router.replace({ path: route.path, query: q, hash: '' })
}

async function endSession() {
    try {
        await authStore.logout()
    } catch (e) {
        // Force-clear local state even if remote revoke fails.
        authStore.token = null
        authStore.user = null
        authStore.isLoggedIn = false
    }
    show.value = false
    clearImpersonationParam()
    router.push('/login')
}

onMounted(() => {
    // Two arrival paths:
    //   (a) #_imp=<base64-json>  — initial admin handoff: token + user payload.
    //       Stash into authStore, drop the fragment, keep ?_impersonating=1.
    //   (b) ?_impersonating=1    — subsequent navigations within the imp session.
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#_imp=')) {
        const raw = decodeURIComponent(window.location.hash.slice('#_imp='.length))
        try {
            const decoded = JSON.parse(atob(raw))
            if (decoded?.token && decoded?.user) {
                authStore.setAuth(decoded.token, decoded.user)
                expiresAt.value = decoded.expires_at ? new Date(decoded.expires_at).getTime() : null
            }
        } catch (e) {
            console.warn('[IMPERSONATION] could not decode handoff payload', e)
        }
        // Strip the fragment from the URL so the token isn't visible.
        const cleanUrl = window.location.pathname + window.location.search
        window.history.replaceState({}, '', cleanUrl)
    }

    const flag = route.query._impersonating
    if (flag === '1' || flag === 1) {
        show.value = true
        impersonatorId.value = route.query._impersonator || null
        targetEmail.value = authStore.user?.email || null

        // Tick every second to update the countdown.
        tickHandle = setInterval(() => {
            now.value = Date.now()
            if (expiresAt.value && now.value >= expiresAt.value) {
                clearInterval(tickHandle)
                endSession()
            }
        }, 1000)
    }
})

onUnmounted(() => {
    if (tickHandle) clearInterval(tickHandle)
})
</script>
