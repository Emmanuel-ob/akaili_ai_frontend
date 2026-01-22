<template>
    <div class="fixed inset-0 z-50 overflow-y-auto" @click.self="$emit('close')">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">

            <!-- Backdrop -->
            <div class="fixed inset-0 transition-opacity bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75"
                @click="$emit('close')"></div>

            <!-- Modal -->
            <div
                class="relative inline-block w-full max-w-2xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white dark:bg-slate-900 rounded-2xl shadow-xl sm:my-8 sm:align-middle sm:p-6">

                <!-- Close Button -->
                <button @click="$emit('close')"
                    class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <!-- Header -->
                <div class="mb-6">
                    <div class="flex items-center gap-3 mb-2">
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
                            Invoice Details
                        </h3>
                        <span :class="[
                            'px-2.5 py-0.5 text-xs font-medium rounded-full',
                            invoice.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        ]">
                            {{ invoice.status }}
                        </span>
                    </div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ invoice.invoice_number }}</p>
                </div>

                <!-- Invoice Info Grid -->
                <div class="grid grid-cols-2 gap-6 mb-6 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                    <div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Amount</p>
                        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ invoice.formatted_amount }}</p>
                    </div>

                    <div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Currency</p>
                        <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ invoice.currency }}</p>
                    </div>

                    <div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Created</p>
                        <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(invoice.created_at) }}</p>
                    </div>

                    <div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Due Date</p>
                        <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(invoice.due_date) }}</p>
                    </div>

                    <div v-if="invoice.paid_at">
                        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Paid On</p>
                        <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(invoice.paid_at) }}</p>
                    </div>

                    <div v-if="invoice.payment_provider">
                        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Payment Provider</p>
                        <p class="text-sm text-gray-900 dark:text-white capitalize">{{ invoice.payment_provider }}</p>
                    </div>
                </div>

                <!-- Line Items -->
                <div v-if="invoice.line_items && invoice.line_items.length > 0" class="mb-6">
                    <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Line Items</h4>
                    <div class="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
                        <table class="w-full text-sm">
                            <thead class="bg-gray-50 dark:bg-slate-800">
                                <tr>
                                    <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                                        Description</th>
                                    <th class="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">
                                        Quantity</th>
                                    <th class="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">Amount
                                    </th>
                                    <th class="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 dark:divide-slate-700">
                                <tr v-for="(item, index) in invoice.line_items" :key="index">
                                    <td class="px-4 py-3 text-gray-900 dark:text-white">{{ item.description }}</td>
                                    <td class="px-4 py-3 text-right text-gray-900 dark:text-white">{{ item.quantity }}
                                    </td>
                                    <td class="px-4 py-3 text-right text-gray-900 dark:text-white">{{
                                        formatAmount(item.amount) }}</td>
                                    <td class="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">{{
                                        formatAmount(item.total) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Business Details -->
                <div v-if="invoice.business" class="mb-6 p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
                    <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Billed To</h4>
                    <div class="space-y-1 text-sm">
                        <p class="font-medium text-gray-900 dark:text-white">{{ invoice.business.name }}</p>
                        <p class="text-gray-600 dark:text-gray-400">{{ invoice.business.email }}</p>
                        <p v-if="invoice.business.location" class="text-gray-600 dark:text-gray-400">{{
                            invoice.business.location }}</p>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <button @click="$emit('close')"
                        class="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                        Close
                    </button>

                    <button v-if="invoice.status === 'paid'" @click="downloadPDF"
                        class="flex-1 px-4 py-2 bg-[#9E4CFF] text-white rounded-lg font-medium hover:bg-purple-700 transition">
                        Download PDF
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/authStore'

const props = defineProps({
    invoice: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['close'])

const config = useRuntimeConfig()
const authStore = useAuthStore()

const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const formatAmount = (amount) => {
    if (!amount) return '$0.00'
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: props.invoice.currency || 'USD'
    }).format(amount)
}

const downloadPDF = async () => {
    try {
        const response = await $fetch(
            `${config.public.apiBase}/api/billing/invoices/${props.invoice.id}/download`,
            {
                headers: { Authorization: `Bearer ${authStore.token}` }
            }
        )

        // For now, just alert (PDF generation not implemented)
        alert('PDF download will be implemented soon')
        console.log('Invoice download:', response)
    } catch (error) {
        console.error('Download failed:', error)
        alert('Failed to download invoice')
    }
}
</script>