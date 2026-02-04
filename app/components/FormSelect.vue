<!-- components/FormSelect.vue -->
<template>
  <div>
    <label
      v-if="label"
      class="block text-sm font-medium text-gray-700 mb-1 font-subheading leading-tight"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <select
      :value="modelValue"
      :required="required"
      :class="selectClasses"
      v-bind="$attrs"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" class="mt-1 text-sm text-red-600 font-sans">{{ error }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
  options: {
    type: Array,
    default: () => [],
  },
  variant: {
    type: String,
    default: "default",
    validator: (value) => ["default", "dark"].includes(value),
  },
});

defineEmits(["update:modelValue"]);

const selectClasses = computed(() => {
  const baseClasses =
    "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500";

  if (props.variant === "dark") {
    return `${baseClasses} bg-gray-800 border-gray-600 text-white focus:border-transparent`;
  }

  return `${baseClasses} border-gray-300 focus:border-transparent`;
});
</script>
