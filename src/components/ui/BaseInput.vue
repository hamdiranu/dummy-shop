<template>
  <div class="gap-2 flex flex-col w-full">
    <label v-if="label" class="block text-sm font-medium"
      >{{ label }}<span v-if="required" class="text-red-500">*</span></label
    >
    <input
      :type="type"
      :placeholder="placeholder"
      :class="[
        'w-full border px-3 py-2 rounded text-sm',
        error ? 'border-red-500' : 'border-[#D9D9E6]',
      ]"
      v-model="proxyValue"
    />
    <p v-if="error" class="text-red-500 text-xs mt-1">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  type?: string
  error?: boolean
  errorMessage?: string
  required?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const proxyValue = computed({
  get: () => props.modelValue,
  set: (val: string) => emit('update:modelValue', val),
})
</script>
