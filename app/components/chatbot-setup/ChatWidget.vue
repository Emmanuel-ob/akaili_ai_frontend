<!-- components/chatbot-setup/ChatWidget.vue -->
<template>
  <div
    ref="widgetContainer"
    class="bg-white dark:bg-slate-900 rounded-xl shadow-lg dark:shadow-none border border-gray-200 dark:border-slate-800 mx-auto transition-colors duration-300 flex flex-col relative group"
    :style="{
      width: widgetWidth + 'px',
      height: widgetHeight + 'px',
      maxWidth: '100%',
    }"
  >
    <!-- Chat Header -->
    <div
      class="bg-[#9E4CFF] dark:bg-[#7C3AED] text-white px-6 py-4 flex justify-between items-center shrink-0 select-none cursor-move"
      @mousedown="startDrag"
    >
      <div>
        <h3 class="text-lg font-semibold font-subheading leading-tight">
          {{ chatbotName || "AI Assistant" }}
        </h3>
        <p class="text-purple-100 text-sm font-sans">
          <span v-if="handoverStatus === 'requested'">⏳ Connecting...</span>
          <span v-else-if="handoverStatus === 'active'"
            >✅ Chatting with {{ agentName || "Agent" }}</span
          >
          <span v-else>🤖 AI Assistant</span>
        </p>
      </div>
      <button
        class="text-purple-100 hover:text-white text-sm underline transition-colors font-sans"
        @click="resetChat"
      >
        Reset
      </button>
    </div>

    <!-- Handover Status Banner -->
    <div
      v-if="handoverStatus === 'requested'"
      class="bg-yellow-50 dark:bg-yellow-900/30 border-b border-yellow-200 dark:border-yellow-800/50 p-3 shrink-0"
    >
      <div
        class="flex items-center text-yellow-800 dark:text-yellow-200 text-sm font-sans"
      >
        <div
          class="animate-spin mr-2 w-4 h-4 border-2 border-yellow-600 dark:border-yellow-400 border-t-transparent rounded-full"
        />
        <span>Finding an available agent...</span>
      </div>
    </div>

    <div
      v-if="handoverStatus === 'rejected'"
      class="bg-red-50 dark:bg-red-900/30 border-b border-red-200 dark:border-red-800/50 p-3 shrink-0"
    >
      <p class="text-red-800 dark:text-red-200 text-sm font-sans">
        ❌ All agents are busy. Please continue with the AI.
      </p>
    </div>

    <div
      v-if="handoverStatus === 'active'"
      class="bg-green-50 dark:bg-green-900/30 border-b border-green-200 dark:border-green-800/50 p-3 shrink-0"
    >
      <p
        class="text-green-800 dark:text-green-200 text-sm flex items-center font-sans"
      >
        <span
          class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"
        ></span>
        Connected to {{ agentName || "an agent" }}
      </p>
    </div>

    <!-- Messages Container -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-950"
    >
      <div
        v-if="messages.length === 0"
        class="text-center text-gray-500 dark:text-gray-400 mt-12"
      >
        <div
          class="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 inline-block max-w-xs mx-auto font-sans"
        >
          <p class="text-lg">👋</p>
          <p class="mt-2 font-medium">Hello! I'm your AI assistant.</p>
        </div>
      </div>

      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="[
          'flex',
          message.role === 'user' ? 'justify-end' : 'justify-start',
        ]"
      >
        <div
          :class="[
            'max-w-[90%] px-4 py-3 rounded-2xl text-sm shadow-sm font-sans',
            message.role === 'user'
              ? 'bg-[#9E4CFF] text-white rounded-br-none'
              : message.role === 'system'
                ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800/50 text-xs italic mx-auto'
                : message.role === 'agent'
                  ? 'bg-green-50 dark:bg-green-900/10 text-gray-800 dark:text-gray-200 border-l-4 border-green-500 rounded-bl-none'
                  : 'bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-slate-800 rounded-bl-none',
          ]"
        >
          <p
            v-if="message.role === 'agent'"
            class="text-xs text-green-600 dark:text-green-400 font-bold mb-1 font-sans"
          >
            {{ message.metadata?.agent_name || "Agent" }}
          </p>

          <div
            v-if="message.role !== 'user'"
            class="prose prose-sm dark:prose-invert max-w-none break-words leading-relaxed"
            v-html="formatMessage(message.message)"
          ></div>
          <p v-else class="whitespace-pre-wrap leading-relaxed">
            {{ message.message }}
          </p>

          <div
            v-if="
              message.role === 'assistant' &&
              message.sources &&
              message.sources.length > 0
            "
            class="mt-3 pt-2 border-t border-gray-100 dark:border-slate-700/50"
          >
            <p
              class="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mb-1"
            >
              Sources
            </p>
            <div class="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <div
                v-for="(source, idx) in message.sources.slice(0, 2)"
                :key="idx"
                class="truncate flex items-center"
              >
                <span>📄 {{ source.table || "Document" }}</span>
              </div>
            </div>
          </div>
          <p class="text-[10px] mt-2 text-right opacity-60">
            {{ formatTime(message.timestamp) }}
          </p>
        </div>
      </div>

      <div v-if="isTyping" class="flex justify-start">
        <div
          class="bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-slate-800 shadow-sm px-4 py-3 rounded-2xl rounded-bl-none"
        >
          <div class="flex space-x-1.5 items-center h-4">
            <div
              class="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
            ></div>
            <div
              class="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
              style="animation-delay: 0.1s"
            ></div>
            <div
              class="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
              style="animation-delay: 0.2s"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div
      class="p-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0"
    >
      <div v-if="!handoverStatus && !isHandoverRequested" class="mb-3">
        <button
          class="w-full text-xs sm:text-sm text-[#9E4CFF] dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium py-2 border border-[#9E4CFF] dark:border-purple-500/50 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors font-sans"
          @click="requestHumanAgent"
        >
          💬 Speak with a Human Agent
        </button>
      </div>

      <div class="flex space-x-2">
        <input
          v-model="currentMessage"
          :disabled="isTyping"
          type="text"
          placeholder="Type your message..."
          class="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 dark:disabled:bg-slate-800/50 transition-colors placeholder-gray-400 dark:placeholder-gray-500 font-sans"
          @keypress.enter="sendMessage"
        />
        <button
          :disabled="!currentMessage.trim() || isTyping"
          class="px-5 py-3 bg-[#9E4CFF] hover:bg-purple-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-all shadow-md font-sans text-sm"
          @click="sendMessage"
        >
          Send
        </button>
      </div>
    </div>

    <!-- Error Toast -->
    <div
      v-if="error"
      class="absolute bottom-20 left-4 right-4 bg-red-50 dark:bg-red-900/90 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-700 dark:text-red-200 text-center shadow-lg font-sans"
    >
      {{ error }}
    </div>

    <!-- =========================
             RESIZE HANDLES 
             ========================= -->

    <!-- Right Handle -->
    <div
      class="absolute right-0 top-0 bottom-4 w-3 cursor-ew-resize hover:bg-purple-500/10 z-50 transition-colors"
      @mousedown.prevent="startResize('right', $event)"
    ></div>

    <!-- Left Handle -->
    <div
      class="absolute left-0 top-0 bottom-4 w-3 cursor-ew-resize hover:bg-purple-500/10 z-50 transition-colors"
      @mousedown.prevent="startResize('left', $event)"
    ></div>

    <!-- Bottom Handle -->
    <div
      class="absolute left-4 bottom-0 right-4 h-3 cursor-ns-resize hover:bg-purple-500/10 z-50 transition-colors"
      @mousedown.prevent="startResize('bottom', $event)"
    ></div>

    <!-- Bottom-Right Corner -->
    <div
      class="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize flex items-end justify-end p-1 z-50 hover:bg-purple-500/20 rounded-tl-lg"
      @mousedown.prevent="startResize('bottom-right', $event)"
    >
      <div
        class="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full mb-1 mr-1"
      ></div>
    </div>

    <!-- Bottom-Left Corner -->
    <div
      class="absolute bottom-0 left-0 w-6 h-6 cursor-nesw-resize flex items-end justify-start p-1 z-50 hover:bg-purple-500/20 rounded-tr-lg"
      @mousedown.prevent="startResize('bottom-left', $event)"
    >
      <div
        class="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full mb-1 ml-1"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
  chatbotId: { type: String, required: true },
  chatbotName: { type: String, default: "AI Assistant" },
  testMode: String,
  testCustomerData: Object,
});

const messages = ref([]);
const currentMessage = ref("");
const isTyping = ref(false);
const error = ref("");
const sessionId = ref("");
const messagesContainer = ref(null);
const conversationId = ref(null);
const handoverStatus = ref(null);
const isHandoverRequested = ref(false);
const agentName = ref(null);

// Resize Logic
const widgetWidth = ref(400);
const widgetHeight = ref(600);
const resizeDirection = ref(null);
const startX = ref(0);
const startY = ref(0);
const startWidth = ref(0);
const startHeight = ref(0);

const { $echo } = useNuxtApp();
let conversationChannel = null;
const isHandoverActive = computed(() => handoverStatus.value === "active");

const formatMessage = (text) => {
  if (!text) return "";
  let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  const lines = formatted.split("\n");
  let inList = false;
  let listType = null;
  let html = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^[\*\-]\s+(.*)/.test(line)) {
      if (!inList || listType !== "ul") {
        if (inList) html += listType === "ul" ? "</ul>" : "</ol>";
        html += '<ul class="list-disc pl-5 my-2 space-y-1">';
        inList = true;
        listType = "ul";
      }
      html += `<li>${line.replace(/^[\*\-]\s+/, "")}</li>`;
    } else if (/^\d+\.\s+(.*)/.test(line)) {
      if (!inList || listType !== "ol") {
        if (inList) html += listType === "ul" ? "</ul>" : "</ol>";
        html += '<ol class="list-decimal pl-5 my-2 space-y-1">';
        inList = true;
        listType = "ol";
      }
      html += `<li>${line.replace(/^\d+\.\s+/, "")}</li>`;
    } else if (line.trim() !== "") {
      if (inList) {
        html += listType === "ul" ? "</ul>" : "</ol>";
        inList = false;
        listType = null;
      }
      html += `<p class="my-2">${line}</p>`;
    }
  }
  if (inList) html += listType === "ul" ? "</ul>" : "</ol>";
  return html;
};

const generateSessionId = () =>
  "chat_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
const formatTime = (ts) =>
  new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value)
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
};

// --- RESIZE HANDLERS ---
const startResize = (direction, e) => {
  resizeDirection.value = direction;
  startX.value = e.clientX;
  startY.value = e.clientY;
  startWidth.value = widgetWidth.value;
  startHeight.value = widgetHeight.value;

  window.addEventListener("mousemove", resize);
  window.addEventListener("mouseup", stopResize);
  document.body.style.userSelect = "none";
};

const resize = (e) => {
  if (!resizeDirection.value) return;

  const minWidth = 320;
  const minHeight = 400;
  const dx = e.clientX - startX.value;
  const dy = e.clientY - startY.value;

  // Right Side Resizing
  if (["right", "bottom-right"].includes(resizeDirection.value)) {
    const newWidth = startWidth.value + dx;
    if (newWidth >= minWidth) widgetWidth.value = newWidth;
  }

  // Left Side Resizing (Increasing width while dragging left)
  if (["left", "bottom-left"].includes(resizeDirection.value)) {
    const newWidth = startWidth.value - dx;
    if (newWidth >= minWidth) widgetWidth.value = newWidth;
  }

  // Bottom Resizing
  if (
    ["bottom", "bottom-right", "bottom-left"].includes(resizeDirection.value)
  ) {
    const newHeight = startHeight.value + dy;
    if (newHeight >= minHeight) widgetHeight.value = newHeight;
  }
};

const stopResize = () => {
  resizeDirection.value = null;
  window.removeEventListener("mousemove", resize);
  window.removeEventListener("mouseup", stopResize);
  document.body.style.userSelect = "";
};

// ... (Existing chat logic functions: requestHumanAgent, setupConversationListener, sendMessage, resetChat) ...
// Copying previous logic to ensure full functionality
const requestHumanAgent = async () => {
  if (isHandoverRequested.value) return;
  if (!conversationId.value) {
    error.value = "Please send a message first";
    return;
  }
  isHandoverRequested.value = true;
  messages.value.push({
    role: "user",
    message: "I would like to speak with a human agent",
    timestamp: new Date().toISOString(),
  });
  scrollToBottom();
  isTyping.value = true;
  try {
    const config = useRuntimeConfig();
    const res = await $fetch(`${config.public.apiBase}/api/handover/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        conversation_id: conversationId.value,
        session_id: sessionId.value,
        chatbot_id: props.chatbotId,
        user_message: "Agent Requested",
      },
    });
    if (res.success) {
      handoverStatus.value = "requested";
      messages.value.push({
        role: "system",
        message: "Connecting you with an agent...",
        timestamp: new Date().toISOString(),
      });
      setupConversationListener();
    }
  } catch (err) {
    error.value = "Failed to connect";
    isHandoverRequested.value = false;
  } finally {
    isTyping.value = false;
    scrollToBottom();
  }
};

const setupConversationListener = () => {
  if (!conversationId.value || conversationChannel) return;
  conversationChannel = $echo.channel(`conversation.${conversationId.value}`);
  conversationChannel.listen(".handover.accepted", (e) => {
    handoverStatus.value = "active";
    agentName.value = e.agent?.name;
    scrollToBottom();
  });
  conversationChannel.listen(".handover.rejected", (e) => {
    if (e.all_rejected) handoverStatus.value = "rejected";
    scrollToBottom();
  });
  conversationChannel.listen(".agent.message", (e) => {
    messages.value.push({
      role: "agent",
      message: e.message.message,
      timestamp: e.message.timestamp,
      metadata: { agent_name: e.agent.name },
    });
    scrollToBottom();
  });
};

const sendMessage = async () => {
  if (!currentMessage.value.trim() || isTyping.value) return;
  const msg = currentMessage.value.trim();
  currentMessage.value = "";
  error.value = "";
  messages.value.push({
    role: "user",
    message: msg,
    timestamp: new Date().toISOString(),
  });
  scrollToBottom();
  isTyping.value = true;
  try {
    const config = useRuntimeConfig();
    const auth = useAuthStore();
    if (isHandoverActive.value && auth.token) {
      await $fetch(`${config.public.apiBase}/api/agent-handover/message`, {
        method: "POST",
        headers: { Authorization: `Bearer ${auth.token}` },
        body: { conversation_id: conversationId.value, message: msg },
      });
      isTyping.value = false;
      return;
    }
    const res = await $fetch(`${config.public.apiBase}/api/chat`, {
      method: "POST",
      headers: { Authorization: `Bearer ${auth.token}` },
      body: {
        message: msg,
        chatbot_id: props.chatbotId,
        session_id: sessionId.value,
      },
    });
    if (res.success) {
      if (res.conversation_id) conversationId.value = res.conversation_id;
      if (!isHandoverActive.value)
        messages.value.push({
          role: "assistant",
          message: res.data.response.text,
          timestamp: new Date().toISOString(),
          sources: res.data.response.sources || [],
        });
    }
  } catch (e) {
    error.value = "Failed to send";
    isTyping.value = false;
  } finally {
    isTyping.value = false;
    scrollToBottom();
  }
};

const resetChat = () => {
  if (conversationChannel) {
    $echo.leave(`conversation.${conversationId.value}`);
    conversationChannel = null;
  }
  messages.value = [];
  sessionId.value = generateSessionId();
  conversationId.value = null;
  error.value = "";
  handoverStatus.value = null;
  isHandoverRequested.value = false;
};

onUnmounted(() => {
  if (conversationChannel) $echo.leave(`conversation.${conversationId.value}`);
  window.removeEventListener("mouseup", stopResize);
});
onMounted(() => {
  sessionId.value = generateSessionId();
});
</script>

<style scoped>
:deep(.prose ul),
:deep(.prose ol) {
  margin: 0.5rem 0;
}
:deep(.prose li) {
  margin: 0.25rem 0;
}
:deep(.prose strong) {
  font-weight: 700;
}
</style>
