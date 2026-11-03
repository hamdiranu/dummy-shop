<template>
  <div class="flex w-full flex-col gap-1.5">
    <label v-if="label" class="block text-sm font-medium text-slate-700">
      {{ label }}
      <span v-if="required" class="text-rose-500">*</span>
    </label>

    <component
      :is="type === 'textarea' ? 'textarea' : 'input'"
      :type="type !== 'textarea' ? type : undefined"
      :placeholder="placeholder"
      :rows="type === 'textarea' ? 4 : undefined"
      :class="['input', type === 'textarea' && 'resize-none', error && 'input-error']"
      :value="modelValue"
      @input="onInput"
    />

    <p v-if="error" class="text-xs font-medium text-rose-500">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string | number
  label?: string
  placeholder?: string
  type?: string
  error?: boolean
  errorMessage?: string
  required?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

function onInput(event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>
