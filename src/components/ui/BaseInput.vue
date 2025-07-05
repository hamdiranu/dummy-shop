<template>
  <div class="gap-2 flex flex-col w-full">
    <label v-if="label" class="block text-sm font-medium">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <component
      :is="type === 'textarea' ? 'textarea' : 'input'"
      :type="type !== 'textarea' ? type : undefined"
      :placeholder="placeholder"
      :rows="type === 'textarea' ? 4 : undefined"
      :class="[
        'w-full border px-3 py-2 rounded text-sm',
        error ? 'border-red-500' : 'border-[#D9D9E6]',
      ]"
      :value="modelValue"
      @input="onInput"
    />

    <p v-if="error" class="text-red-500 text-xs mt-1">{{ errorMessage }}</p>
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
