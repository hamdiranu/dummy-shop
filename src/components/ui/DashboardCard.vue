<template>
  <div class="bg-white rounded-lg border border-[#e5e7eb] p-6 shadow-sm">
    <div class="flex justify-between items-center mb-2">
      <p class="text-sm text-gray-500">{{ title }}</p>
      <component :is="icon" class="w-5 h-5" />
    </div>
    <h2 class="text-2xl font-bold">{{ value }}</h2>
    <p class="text-xs text-gray-400">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  value: string | number
  icon?: string // or define proper type like Component
}>()
</script>
