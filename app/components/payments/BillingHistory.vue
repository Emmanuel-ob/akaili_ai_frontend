<template>
  <div class="space-y-6 font-sans">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h3
          class="text-lg font-semibold text-gray-800 dark:text-white font-subheading leading-tight"
        >
          Billing History
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          View all your invoices and payment transactions
        </p>
      </div>

      <button
        :disabled="loading"
        class="px-4 py-2 text-sm border border-gray-300 dark:border-slate-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
        @click="refreshInvoices"
      >
        <svg
          v-if="loading"
          class="animate-spin h-4 w-4 inline mr-2"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {{ loading ? "Loading..." : "Refresh" }}
      </button>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading && invoices.length === 0"
      class="animate-pulse space-y-4"
    >
      <div class="h-20 bg-gray-100 dark:bg-slate-800 rounded-lg"></div>
      <div class="h-20 bg-gray-100 dark:bg-slate-800 rounded-lg"></div>
      <div class="h-20 bg-gray-100 dark:bg-slate-800 rounded-lg"></div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!loading && invoices.length === 0"
      class="text-center py-12 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700"
    >
      <div
        class="bg-gray-100 dark:bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <svg
          class="w-8 h-8 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3
        class="text-lg font-bold text-gray-900 dark:text-white mb-2 font-subheading leading-tight"
      >
        No Invoices Yet
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">
        Your billing history will appear here once you make your first payment.
      </p>
      <NuxtLink
        to="/pricing"
        class="inline-block px-6 py-2 bg-[#9E4CFF] text-white rounded-lg font-medium hover:bg-purple-700 transition"
      >
        View Plans
      </NuxtLink>
    </div>

    <!-- Invoices List -->
    <div v-else class="space-y-4">
      <div
        v-for="invoice in invoices"
        :key="invoice.id"
        class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between">
          <!-- Invoice Details -->
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h4 class="font-semibold text-gray-900 dark:text-white">
                {{ invoice.invoice_number }}
              </h4>

              <!-- Status Badge -->
              <span
                :class="[
                  'px-2.5 py-0.5 text-xs font-medium rounded-full',
                  invoice.status === 'paid'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : invoice.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      : invoice.status === 'failed'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
                ]"
              >
                {{
                  invoice.status === "paid"
                    ? "Paid"
                    : invoice.status === "pending"
                      ? "Pending"
                      : invoice.status === "failed"
                        ? "Failed"
                        : invoice.status
                }}
              </span>
            </div>

            <div class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p>
                Amount:
                <span class="font-semibold text-gray-900 dark:text-white">{{
                  invoice.formatted_amount
                }}</span>
              </p>
              <p>Date: {{ formatDate(invoice.created_at) }}</p>
              <p v-if="invoice.paid_at">
                Paid on: {{ formatDate(invoice.paid_at) }}
              </p>
              <p
                v-if="invoice.payment_provider"
                class="flex items-center gap-1"
              >
                Provider:
                <span class="capitalize">{{ invoice.payment_provider }}</span>
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <button
              class="px-3 py-1.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
              @click="viewInvoice(invoice.id)"
            >
              View
            </button>

            <button
              v-if="invoice.status === 'paid'"
              class="px-3 py-1.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
              @click="downloadInvoice(invoice.id)"
            >
              Download
            </button>
          </div>
        </div>

        <!-- Overdue Warning -->
        <div
          v-if="invoice.is_overdue"
          class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <p
            class="text-sm text-red-800 dark:text-red-300 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            This invoice is overdue. Please make payment to avoid service
            interruption.
          </p>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="pagination && pagination.total_pages > 1"
      class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700"
    >
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Page {{ pagination.current_page }} of {{ pagination.total_pages }}
      </p>

      <div class="flex gap-2">
        <button
          :disabled="pagination.current_page === 1"
          class="px-3 py-1.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          @click="loadPage(pagination.current_page - 1)"
        >
          Previous
        </button>

        <button
          :disabled="pagination.current_page === pagination.total_pages"
          class="px-3 py-1.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          @click="loadPage(pagination.current_page + 1)"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Invoice Detail Modal -->
    <InvoiceDetailModal
      v-if="selectedInvoice"
      :invoice="selectedInvoice"
      @close="selectedInvoice = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "~/stores/authStore";
import InvoiceDetailModal from "~/components/payments/InvoiceDetailModal.vue";

const config = useRuntimeConfig();
const authStore = useAuthStore();

const invoices = ref([]);
const pagination = ref(null);
const loading = ref(false);
const selectedInvoice = ref(null);

const fetchInvoices = async (page = 1) => {
  loading.value = true;

  try {
    const response = await $fetch(
      `${config.public.apiBase}/api/billing/invoices?page=${page}`,
      {
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );

    if (response.success) {
      invoices.value = response.data.invoices;
      pagination.value = response.data.pagination;
    }
  } catch (error) {
    console.error("Failed to fetch invoices:", error);
  } finally {
    loading.value = false;
  }
};

const refreshInvoices = () => {
  fetchInvoices(pagination.value?.current_page || 1);
};

const loadPage = (page) => {
  fetchInvoices(page);
};

const viewInvoice = async (invoiceId) => {
  try {
    const response = await $fetch(
      `${config.public.apiBase}/api/billing/invoices/${invoiceId}`,
      {
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );

    if (response.success) {
      selectedInvoice.value = response.data.invoice;
    }
  } catch (error) {
    console.error("Failed to fetch invoice details:", error);
  }
};

const downloadInvoice = async (invoiceId) => {
  try {
    // In production, this should trigger a PDF download
    const response = await $fetch(
      `${config.public.apiBase}/api/billing/invoices/${invoiceId}/download`,
      {
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );

    // For now, just show an alert (PDF generation not implemented yet)
    alert("PDF generation will be implemented. Invoice data received.");
    console.log("Invoice download:", response);
  } catch (error) {
    console.error("Failed to download invoice:", error);
    alert("Failed to download invoice");
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(() => {
  fetchInvoices();
});
</script>
