<!-- components/chatbot-setup/EmbedCodeGenerator.vue -->
<template>
  <div
    class="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm dark:shadow-none rounded-2xl overflow-hidden transition-colors duration-300"
  >
    <div
      class="px-6 py-5 border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/20"
    >
      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <h3
            class="text-xl font-bold text-gray-900 dark:text-white font-subheading"
          >
            Widget Embed Code
          </h3>
          <p class="text-gray-600 dark:text-gray-400 font-sans text-sm">
            Integrate your chatbot into any website
          </p>
        </div>
        <div class="flex gap-4">
          <button
            :disabled="isGenerating"
            class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 px-4 py-2 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg text-sm font-sans"
            @click="loadEmbedCode"
          >
            {{ isGenerating ? "Loading..." : "Refresh" }}
          </button>
          <button
            :disabled="isRegenerating"
            class="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-2 font-medium hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg text-sm font-sans"
            @click="regenerateToken"
          >
            {{ isRegenerating ? "Regenerating..." : "Regenerate Token" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="embedCode" class="p-6 md:p-8">
      <!-- Basic Embed Code Section -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h4
            class="text-lg font-bold text-gray-900 dark:text-white font-subheading"
          >
            Embed Code
          </h4>
          <button
            class="text-sm text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium border border-gray-300 dark:border-slate-600 px-3 py-1.5 hover:border-purple-500 dark:hover:border-purple-400 transition-colors rounded-lg font-sans"
            @click="copyToClipboard(embedCode, 'basic')"
          >
            {{ copied.basic ? "✓ Copied!" : "Copy Code" }}
          </button>
        </div>

        <CodeBlock :code="embedCode" language="html" />

        <div
          class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl text-blue-800 dark:text-blue-300 text-sm"
        >
          <strong>Installation:</strong> Copy this code and paste it before the
          closing &lt;/body&gt; tag in your HTML.
        </div>
      </div>

      <!-- Installation Steps -->
      <div
        class="mt-8 p-6 border border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50 dark:bg-slate-800/30"
      >
        <h4
          class="text-lg font-bold text-gray-900 dark:text-white mb-4 font-subheading"
        >
          Installation Steps
        </h4>
        <ol
          class="text-gray-700 dark:text-gray-300 space-y-3 list-decimal list-inside marker:text-purple-500 marker:font-bold font-sans"
        >
          <li>Copy the embed code above</li>
          <li>Open your website's HTML file</li>
          <li>Paste the code before the closing &lt;/body&gt; tag</li>
          <li>Save and refresh your website</li>
          <li>The chat widget will appear in the bottom right corner</li>
        </ol>
      </div>

      <!-- Widget Token Info -->
      <div
        class="mt-8 p-6 bg-gray-50 dark:bg-slate-800/30 border border-gray-200 dark:border-slate-800 rounded-xl"
      >
        <h4
          class="text-lg font-bold text-gray-900 dark:text-white mb-4 font-subheading"
        >
          Widget Token
        </h4>
        <div
          class="font-mono text-sm text-gray-600 dark:text-gray-400 mb-3 break-all bg-white dark:bg-slate-900 p-3 rounded-lg border border-gray-200 dark:border-slate-700 select-all"
        >
          {{ widgetToken }}
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 font-sans">
          This token identifies your chatbot. Keep it secure and regenerate if
          compromised.
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-500 mt-2 font-sans">
          Generated: {{ tokenGeneratedAt }}
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-else-if="isGenerating"
      class="p-12 flex flex-col items-center justify-center"
    >
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"
      />
      <span class="mt-3 text-gray-600 dark:text-gray-400 font-sans"
        >Loading embed code...</span
      >
    </div>

    <!-- Empty State -->
    <div v-else class="py-16 text-center text-gray-500 dark:text-gray-400">
      <svg
        class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
      <p class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 font-sans">
        No embed code generated yet
      </p>
      <p class="text-sm font-sans">Click "Refresh" to generate your embed code</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import CodeBlock from "./CodeBlock.vue";

const props = defineProps({
  chatbotId: {
    type: String,
    required: true,
  },
  chatbotName: {
    type: String,
    default: "AI Assistant",
  },
});

const embedCode = ref("");
const widgetToken = ref("");
const tokenGeneratedAt = ref("");
const isGenerating = ref(false);
const isRegenerating = ref(false);
const copied = ref({
  basic: false,
});

const loadEmbedCode = async () => {
  isGenerating.value = true;
  try {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();

    const response = await $fetch(
      `${config.public.apiBase}/api/chatbots/${props.chatbotId}/embed-code`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      },
    );

    if (response.success) {
      widgetToken.value = response.data.widget_token;
      embedCode.value = response.data.embed_code;
      tokenGeneratedAt.value = new Date().toLocaleString();
    }
  } catch (error) {
    console.error("Failed to load embed code:", error);
  } finally {
    isGenerating.value = false;
  }
};

const regenerateToken = async () => {
  if (
    !confirm(
      "Are you sure you want to regenerate the token? Your old embed code will stop working and you'll need to update your website.",
    )
  ) {
    return;
  }

  isRegenerating.value = true;
  try {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();

    const response = await $fetch(
      `${config.public.apiBase}/api/chatbots/${props.chatbotId}/regenerate-token`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      },
    );

    if (response.success) {
      widgetToken.value = response.data.widget_token;
      embedCode.value = response.data.embed_code;
      tokenGeneratedAt.value = new Date().toLocaleString();

      alert(
        "Token regenerated successfully! Please update your website with the new embed code.",
      );
    }
  } catch (error) {
    console.error("Failed to regenerate token:", error);
    alert("Failed to regenerate token. Please try again.");
  } finally {
    isRegenerating.value = false;
  }
};

const copyToClipboard = async (text, type = "basic") => {
  try {
    await navigator.clipboard.writeText(text);
    copied.value[type] = true;
    setTimeout(() => (copied.value[type] = false), 2000);
  } catch (error) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    copied.value[type] = true;
    setTimeout(() => (copied.value[type] = false), 2000);
  }
};

onMounted(() => {
  loadEmbedCode();
});
</script>
